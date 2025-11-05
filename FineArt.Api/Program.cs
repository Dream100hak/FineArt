using Microsoft.EntityFrameworkCore;
using FineArt.Infrastructure.Persistence;
using FineArt.Domain;
using FineArt.Api.Contracts;

var builder = WebApplication.CreateBuilder(args);

var cs = builder.Configuration.GetConnectionString("MySql");
builder.Services.AddDbContext<AppDb>(o => o.UseMySql(cs, ServerVersion.AutoDetect(cs)));

builder.Services.AddCors(o => o.AddPolicy("react", p => p
    .WithOrigins("http://localhost:3000","https://fineart.co.kr","https://admin.fineart.co.kr")
    .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("react");

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
});

app.Run();
