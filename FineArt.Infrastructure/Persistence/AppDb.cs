using Microsoft.EntityFrameworkCore;
using FineArt.Domain;

namespace FineArt.Infrastructure.Persistence;

// EF Core DbContext
public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }

    public DbSet<Artwork> Artworks => Set<Artwork>();
}
