using FineArt.Domain;
using Microsoft.EntityFrameworkCore;

namespace FineArt.Application.Artworks;

public class ArtworkCommandService
{
    private readonly DbContext _db;
    private readonly DbSet<Artwork> _artworks;

    public ArtworkCommandService(DbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _artworks = _db.Set<Artwork>();
    }

    public async Task<Artwork> CreateAsync(
        string title,
        int price,
        string? imageUrl,
        ArtworkStatus status,
        CancellationToken cancellationToken = default)
    {
        var artwork = new Artwork
        {
            Title = title.Trim(),
            Price = price,
            ImageUrl = imageUrl?.Trim() ?? string.Empty,
            Status = status,
            CreatedAt = DateTime.UtcNow
        };

        await _artworks.AddAsync(artwork, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        return artwork;
    }

    public async Task<Artwork?> UpdateAsync(
        int id,
        string title,
        int price,
        string? imageUrl,
        ArtworkStatus status,
        CancellationToken cancellationToken = default)
    {
        var artwork = await _artworks.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (artwork is null)
        {
            return null;
        }

        artwork.Title = title.Trim();
        artwork.Price = price;
        artwork.ImageUrl = imageUrl?.Trim() ?? string.Empty;
        artwork.Status = status;

        await _db.SaveChangesAsync(cancellationToken);

        return artwork;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var artwork = await _artworks.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (artwork is null)
        {
            return false;
        }

        _artworks.Remove(artwork);
        await _db.SaveChangesAsync(cancellationToken);

        return true;
    }
}
