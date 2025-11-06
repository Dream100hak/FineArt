using System.Linq;
using FineArt.Api.Contracts;
using FineArt.Application.Artworks;
using FineArt.Domain;
using FineArt.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FineArt.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtworksController : ControllerBase
{
    private readonly AppDb _db;
    private readonly ArtworkQueryService _artworkQueryService;

    public ArtworksController(AppDb db, ArtworkQueryService artworkQueryService)
    {
        _db = db;
        _artworkQueryService = artworkQueryService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? keyword,
        [FromQuery] int? priceMin,
        [FromQuery] int? priceMax,
        [FromQuery] string? status,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int size = 10,
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

        var (items, total) = await _artworkQueryService.QueryAsync(
            _db.Artworks.AsNoTracking(),
            keyword,
            priceMin,
            priceMax,
            status,
            sort,
            page,
            size,
            cancellationToken);

        var responseItems = items.Select(a => new
        {
            a.Id,
            a.Title,
            a.Price,
            a.ImageUrl,
            Status = a.Status.ToString(),
            a.CreatedAt
        });

        return Ok(new
        {
            total,
            page,
            size,
            items = responseItems
        });
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        var artwork = await _db.Artworks
            .AsNoTracking()
            .Where(a => a.Id == id)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.Price,
                a.ImageUrl,
                Status = a.Status.ToString(),
                a.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        return artwork is null
            ? NotFound(new { message = "Artwork not found." })
            : Ok(artwork);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] ArtworkCreateDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Price < 0)
        {
            return BadRequest(new { message = "Title and price must be valid." });
        }

        var artwork = new Artwork
        {
            Title = dto.Title.Trim(),
            Price = dto.Price,
            ImageUrl = dto.ImageUrl?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        await _db.Artworks.AddAsync(artwork, cancellationToken);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = artwork.Id }, new
        {
            artwork.Id,
            artwork.Title,
            artwork.Price,
            artwork.ImageUrl,
            Status = artwork.Status.ToString(),
            artwork.CreatedAt
        });
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] ArtworkUpdateDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Price < 0)
        {
            return BadRequest(new { message = "Title and price must be valid." });
        }

        if (!Enum.TryParse<ArtworkStatus>(dto.Status, true, out var status))
        {
            return BadRequest(new { message = "Artwork status is not valid." });
        }

        var artwork = await _db.Artworks.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (artwork is null)
        {
            return NotFound(new { message = "Artwork not found." });
        }

        artwork.Title = dto.Title.Trim();
        artwork.Price = dto.Price;
        artwork.ImageUrl = dto.ImageUrl?.Trim() ?? string.Empty;
        artwork.Status = status;

        await _db.SaveChangesAsync(cancellationToken);

        return Ok(new
        {
            artwork.Id,
            artwork.Title,
            artwork.Price,
            artwork.ImageUrl,
            Status = artwork.Status.ToString(),
            artwork.CreatedAt
        });
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var artwork = await _db.Artworks.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
        if (artwork is null)
        {
            return NotFound(new { message = "Artwork not found." });
        }

        _db.Artworks.Remove(artwork);
        await _db.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
