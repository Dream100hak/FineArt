using FineArt.Domain;
using Microsoft.EntityFrameworkCore;

namespace FineArt.Application.Artworks;

public class ArtworkQueryService
{
    public async Task<(IReadOnlyList<Artwork> Items, int TotalCount)> QueryAsync(
        IQueryable<Artwork> source,
        string? keyword,
        int? priceMin,
        int? priceMax,
        string? status,
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

        var filtered = ApplyFilters(source, keyword, priceMin, priceMax, status);
        var totalCount = await filtered.CountAsync(cancellationToken);

        var ordered = ApplySort(filtered, sort);
        var skip = (page - 1) * size;
        var items = await ordered.Skip(skip).Take(size).ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    private static IQueryable<Artwork> ApplyFilters(
        IQueryable<Artwork> query,
        string? keyword,
        int? priceMin,
        int? priceMax,
        string? status)
    {
        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var term = keyword.Trim();
            query = query.Where(a => a.Title.Contains(term));
        }

        if (priceMin.HasValue)
        {
            query = query.Where(a => a.Price >= priceMin.Value);
        }

        if (priceMax.HasValue)
        {
            query = query.Where(a => a.Price <= priceMax.Value);
        }

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<ArtworkStatus>(status, ignoreCase: true, out var parsedStatus))
        {
            query = query.Where(a => a.Status == parsedStatus);
        }

        return query;
    }

    private static IQueryable<Artwork> ApplySort(IQueryable<Artwork> query, string? sort) =>
        sort switch
        {
            "created" => query.OrderByDescending(a => a.CreatedAt).ThenByDescending(a => a.Id),
            "-price" => query.OrderByDescending(a => a.Price).ThenByDescending(a => a.Id),
            "+price" => query.OrderBy(a => a.Price).ThenByDescending(a => a.Id),
            _ => query.OrderByDescending(a => a.Id)
        };
}
