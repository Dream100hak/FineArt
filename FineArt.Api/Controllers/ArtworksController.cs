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
    private readonly ArtworkCommandService _artworkCommandService;

    public ArtworksController(
        AppDb db,
        ArtworkQueryService artworkQueryService,
        ArtworkCommandService artworkCommandService)
    {
        _db = db;
        _artworkQueryService = artworkQueryService;
        _artworkCommandService = artworkCommandService;
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

        var source = _db.Artworks
            .AsNoTracking()
            .Include(a => a.Artist);

        var (items, total) = await _artworkQueryService.QueryAsync(
            source,
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
            a.ArtistId,
            ArtistName = a.Artist?.Name ?? string.Empty,
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
                a.ArtistId,
                ArtistName = a.Artist != null ? a.Artist.Name : string.Empty,
                a.CreatedAt
            })
            .FirstOrDefaultAsync(cancellationToken);

        return artwork is null
            ? NotFound(new { message = "Artwork not found." })
            : Ok(artwork);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Create([FromBody] ArtworkCreateDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Price < 0 || dto.ArtistId <= 0)
        {
            return BadRequest(new { message = "Title, price, and artist must be valid." });
        }

        if (!Enum.TryParse<ArtworkStatus>(dto.Status, true, out var status))
        {
            return BadRequest(new { message = "Artwork status is not valid." });
        }

        var artist = await _db.Artists
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == dto.ArtistId, cancellationToken);
        if (artist is null)
        {
            return BadRequest(new { message = "Artist not found." });
        }

        var artwork = await _artworkCommandService.CreateAsync(
            dto.Title,
            dto.Price,
            dto.ImageUrl,
            status,
            dto.ArtistId,
            cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = artwork.Id }, new
        {
            artwork.Id,
            artwork.Title,
            artwork.Price,
            artwork.ImageUrl,
            Status = artwork.Status.ToString(),
            artwork.ArtistId,
            ArtistName = artist.Name,
            artwork.CreatedAt
        });
    }

    [HttpPut("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Update(int id, [FromBody] ArtworkUpdateDto dto, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Title) || dto.Price < 0 || dto.ArtistId <= 0)
        {
            return BadRequest(new { message = "Title, price, and artist must be valid." });
        }

        if (!Enum.TryParse<ArtworkStatus>(dto.Status, true, out var status))
        {
            return BadRequest(new { message = "Artwork status is not valid." });
        }

        var artist = await _db.Artists
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == dto.ArtistId, cancellationToken);
        if (artist is null)
        {
            return BadRequest(new { message = "Artist not found." });
        }

        var artwork = await _artworkCommandService.UpdateAsync(
            id,
            dto.Title,
            dto.Price,
            dto.ImageUrl,
            status,
            dto.ArtistId,
            cancellationToken);

        if (artwork is null)
        {
            return NotFound(new { message = "Artwork not found." });
        }

        return Ok(new
        {
            artwork.Id,
            artwork.Title,
            artwork.Price,
            artwork.ImageUrl,
            Status = artwork.Status.ToString(),
            artwork.ArtistId,
            ArtistName = artist.Name,
            artwork.CreatedAt
        });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _artworkCommandService.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound(new { message = "Artwork not found." });
        }

        return NoContent();
    }
}
