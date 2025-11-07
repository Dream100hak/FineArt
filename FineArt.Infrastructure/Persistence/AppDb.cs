using Microsoft.EntityFrameworkCore;
using FineArt.Domain;

namespace FineArt.Infrastructure.Persistence;

// EF Core DbContext
public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }

    public DbSet<Artwork> Artworks => Set<Artwork>();
    public DbSet<Artist> Artists => Set<Artist>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(builder =>
        {
            builder.HasIndex(u => u.Email).IsUnique();
            builder.Property(u => u.Email).HasMaxLength(256);
            builder.Property(u => u.Role).HasMaxLength(64);
        });

        modelBuilder.Entity<Artist>(builder =>
        {
            builder.Property(a => a.Name).HasMaxLength(200);
            builder.Property(a => a.Nationality).HasMaxLength(100);
            builder.Property(a => a.ImageUrl).HasMaxLength(1024);
        });

        modelBuilder.Entity<Artwork>(builder =>
        {
            builder.HasIndex(a => a.Price).HasDatabaseName("idx_artwork_price");
            builder.HasIndex(a => a.CreatedAt).HasDatabaseName("idx_artwork_created_at");
            builder.HasOne(a => a.Artist)
                .WithMany(ar => ar.Artworks)
                .HasForeignKey(a => a.ArtistId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Article>(builder =>
        {
            builder.Property(a => a.Title).HasMaxLength(500);
            builder.Property(a => a.Writer).HasMaxLength(128);
            builder.Property(a => a.Category).HasMaxLength(64);
            builder.Property(a => a.ImageUrl).HasMaxLength(2048);
            builder.Property(a => a.Views).HasDefaultValue(0);
            builder.HasIndex(a => a.Category).HasDatabaseName("idx_articles_category");
            builder.HasIndex(a => a.CreatedAt).HasDatabaseName("idx_articles_created_at");
        });
    }
}
