using FineArt.Domain;
using Microsoft.EntityFrameworkCore;

namespace FineArt.Application.Articles;

public class ArticleQueryService
{
    public async Task<(IReadOnlyList<Article> Items, int TotalCount)> QueryAsync(
        IQueryable<Article> source,
        string? category,
        string? keyword,
        string? sort,
        int page,
        int size,
        CancellationToken cancellationToken = default)
    {
        if (page < 1)
        {
            page = 1;
        }

        if (size < 1)
        {
            size = 10;
        }

        var filtered = ApplyFilters(source, category, keyword);
        var totalCount = await filtered.CountAsync(cancellationToken);

        var ordered = ApplySort(filtered, sort);
        var skip = (page - 1) * size;
        var items = await ordered
            .Skip(skip)
            .Take(size)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public Task<Article?> GetByIdAsync(
        IQueryable<Article> source,
        int id,
        CancellationToken cancellationToken = default) =>
        source.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

    private static IQueryable<Article> ApplyFilters(IQueryable<Article> query, string? category, string? keyword)
    {
        if (!string.IsNullOrWhiteSpace(category))
        {
            var normalizedCategory = category.Trim().ToLower();
            query = query.Where(a => a.Category == normalizedCategory);
        }

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var term = keyword.Trim();
            query = query.Where(a =>
                a.Title.Contains(term) ||
                a.Content.Contains(term) ||
                a.Writer.Contains(term));
        }

        return query;
    }

    private static IQueryable<Article> ApplySort(IQueryable<Article> query, string? sort) =>
        sort switch
        {
            "oldest" => query.OrderBy(a => a.CreatedAt).ThenBy(a => a.Id),
            "-views" => query.OrderByDescending(a => a.Views).ThenByDescending(a => a.CreatedAt),
            "+views" => query.OrderBy(a => a.Views).ThenByDescending(a => a.CreatedAt),
            _ => query.OrderByDescending(a => a.CreatedAt).ThenByDescending(a => a.Id)
        };
}
