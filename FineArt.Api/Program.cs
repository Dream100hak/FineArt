using Microsoft.EntityFrameworkCore;
using FineArt.Infrastructure.Persistence;

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

app.Run();
