using FineArt.Domain;
using Microsoft.EntityFrameworkCore;

namespace FineArt.Application.Articles;

public class ArticleCommandService
{
    private readonly DbContext _db;
    private readonly DbSet<Article> _articles;

    public ArticleCommandService(DbContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _articles = _db.Set<Article>();
    }

    public async Task<Article> CreateAsync(
        string title,
        string content,
        string? imageUrl,
        string? thumbnailUrl,
        string writer,
        string category,
        CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var article = new Article
        {
            Title = title.Trim(),
            Content = content.Trim(),
            ImageUrl = imageUrl?.Trim() ?? string.Empty,
            ThumbnailUrl = thumbnailUrl?.Trim() ?? string.Empty,
            Writer = writer.Trim(),
            Category = NormalizeCategory(category),
            Views = 0,
            CreatedAt = now,
            UpdatedAt = now
        };

        await _articles.AddAsync(article, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        return article;
    }

    public async Task<Article?> UpdateAsync(
        int id,
        string title,
        string content,
        string? imageUrl,
        string? thumbnailUrl,
        string writer,
        string category,
        CancellationToken cancellationToken = default)
    {
        var article = await _articles.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (article is null)
        {
            return null;
        }

        article.Title = title.Trim();
        article.Content = content.Trim();
        article.ImageUrl = imageUrl?.Trim() ?? string.Empty;
        article.ThumbnailUrl = thumbnailUrl?.Trim() ?? string.Empty;
        article.Writer = writer.Trim();
        article.Category = NormalizeCategory(category);
        article.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(cancellationToken);

        return article;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var article = await _articles.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (article is null)
        {
            return false;
        }

        _articles.Remove(article);
        await _db.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<Article?> IncrementViewCountAsync(int id, CancellationToken cancellationToken = default)
    {
        var article = await _articles.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (article is null)
        {
            return null;
        }

        article.Views += 1;
        await _db.SaveChangesAsync(cancellationToken);

        return article;
    }

    private static string NormalizeCategory(string category) =>
        string.IsNullOrWhiteSpace(category)
            ? string.Empty
            : category.Trim().ToLowerInvariant();
}
