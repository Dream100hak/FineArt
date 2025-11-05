using FineArt.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

public class AppDbFactory : IDesignTimeDbContextFactory<AppDb>
{
    public AppDb CreateDbContext(string[] args)
    {
        // FineArt.Infrastructure 기준으로 FineArt.Api 폴더를 BasePath로
        var basePath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "FineArt.Api"));

        var cfg = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var cs = cfg.GetConnectionString("MySql")
                 ?? "server=localhost;port=3306;database=fineart;user=root;password=비번";

        var options = new DbContextOptionsBuilder<AppDb>()
            .UseMySql(cs, ServerVersion.AutoDetect(cs))
            .Options;

        return new AppDb(options);
    }
}
