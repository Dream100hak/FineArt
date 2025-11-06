using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace FineArt.Infrastructure.Persistence;

public class AppDbFactory : IDesignTimeDbContextFactory<AppDb>
{
    public AppDb CreateDbContext(string[] args)
    {
        var basePath = Directory.GetCurrentDirectory();
        var apiPath = Path.Combine(basePath, "..", "FineArt.Api");

        var configuration = new ConfigurationBuilder()
            .SetBasePath(apiPath)
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var cs = configuration.GetConnectionString("MySql");
        if (string.IsNullOrWhiteSpace(cs))
        {
            throw new InvalidOperationException("MySql connection string was not found.");
        }

        var optionsBuilder = new DbContextOptionsBuilder<AppDb>();
        optionsBuilder.UseMySql(cs, ServerVersion.AutoDetect(cs));

        return new AppDb(optionsBuilder.Options);
    }
}
