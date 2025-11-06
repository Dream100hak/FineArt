using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FineArt.Infrastructure.Persistence;
using FineArt.Domain;
using FineArt.Api.Contracts;
using FineArt.Application.Auth;
using FineArt.Infrastructure.Auth;

var builder = WebApplication.CreateBuilder(args);

var cs = builder.Configuration.GetConnectionString("MySql");
builder.Services.AddDbContext<AppDb>(o => o.UseMySql(cs, ServerVersion.AutoDetect(cs)));

builder.Services.AddSingleton(TimeProvider.System);
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

var jwtOptions = new JwtOptions();
builder.Configuration.GetSection("Jwt").Bind(jwtOptions);
if (string.IsNullOrWhiteSpace(jwtOptions.Key))
{
    throw new InvalidOperationException("JWT Key is not configured.");
}

var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtOptions.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtOptions.Audience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = signingKey,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(1)
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddCors(o => o.AddPolicy("react", p => p
    .WithOrigins("http://localhost:3000","https://fineart.co.kr","https://admin.fineart.co.kr")
    .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("react");

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/healthz", () => Results.Ok(new { ok = true, ts = DateTime.UtcNow }));

app.MapGet("/api/artworks", async (AppDb db) =>
    await db.Artworks
      .OrderByDescending(a => a.Id)
      .Select(a => new { a.Id, a.Title, a.Price, a.ImageUrl, a.Status, a.CreatedAt })
      .ToListAsync());

app.MapGet("/api/artworks/{id:int}", async (int id, AppDb db) =>
{
    var a = await db.Artworks.FindAsync(id);
    return a is null ? Results.NotFound()
                     : Results.Ok(new { a.Id, a.Title, a.Price, a.ImageUrl, a.Status, a.CreatedAt });
});


app.MapPost("/api/artworks", async (ArtworkCreateDto dto, AppDb db) =>
{
    if (string.IsNullOrWhiteSpace(dto.Title) || dto.Price < 0)
        return Results.BadRequest(new { message = "유효하지 않은 입력" });

    var e = new Artwork
    {
        Title = dto.Title.Trim(),
        Price = dto.Price,
        ImageUrl = dto.ImageUrl?.Trim() ?? "",
        CreatedAt = DateTime.UtcNow
    };
    db.Artworks.Add(e);
    await db.SaveChangesAsync();
    return Results.Created($"/api/artworks/{e.Id}", new { e.Id, e.Title, e.Price, e.ImageUrl, e.CreatedAt });
}).RequireAuthorization("AdminOnly");

app.MapPost("/auth/register", async (RegisterRequest request, AuthService authService, CancellationToken cancellationToken) =>
{
    var result = await authService.RegisterAsync(request.Email, request.Password, request.Role, cancellationToken);
    return result.Success
        ? Results.Ok(new AuthResponse(result.Token!, result.ExpiresAt!.Value))
        : Results.BadRequest(new { message = result.Error });
});

app.MapPost("/auth/login", async (LoginRequest request, AuthService authService, CancellationToken cancellationToken) =>
{
    var result = await authService.LoginAsync(request.Email, request.Password, cancellationToken);
    return result.Success
        ? Results.Ok(new AuthResponse(result.Token!, result.ExpiresAt!.Value))
        : Results.BadRequest(new { message = result.Error });
});

app.Run();
