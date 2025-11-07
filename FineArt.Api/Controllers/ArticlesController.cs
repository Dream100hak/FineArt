using System;
using System.Collections.Generic;
using System.Linq;
using FineArt.Api.Contracts;
using FineArt.Application.Articles;
using FineArt.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FineArt.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly AppDb _db;
    private readonly ArticleQueryService _articleQueryService;
    private readonly ArticleCommandService _articleCommandService;

    public ArticlesController(
        AppDb db,
        ArticleQueryService articleQueryService,
        ArticleCommandService articleCommandService)
    {
        _db = db;
        _articleQueryService = articleQueryService;
        _articleCommandService = articleCommandService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll(
        [FromQuery] ArticleListQuery query,
        CancellationToken cancellationToken = default)
    {
        var page = query.Page < 1 ? 1 : query.Page;
        var size = query.Size < 1 ? 10 : query.Size;

        var source = _db.Articles.AsNoTracking();
        var (items, total) = await _articleQueryService.QueryAsync(
            source,
            query.Category,
            query.Keyword,
            query.Sort,
            page,
            size,
            cancellationToken);

        var responseItems = items.Select(a => new
        {
            a.Id,
            a.Title,
            a.Content,
            Author = a.Writer,
            Writer = a.Writer,
            a.Category,
            a.Views,
            a.ImageUrl,
            a.ThumbnailUrl,
            Images = BuildImageSet(a.ImageUrl, a.ThumbnailUrl),
            a.CreatedAt,
            a.UpdatedAt
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
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken = default)
    {
        var article = await _articleCommandService.IncrementViewCountAsync(id, cancellationToken);
        if (article is null)
        {
            return NotFound(new { message = "Article not found." });
        }

        return Ok(new
        {
            article.Id,
            article.Title,
            article.Content,
            Author = article.Writer,
            Writer = article.Writer,
            article.Category,
            article.Views,
            article.ImageUrl,
            article.ThumbnailUrl,
            Images = BuildImageSet(article.ImageUrl, article.ThumbnailUrl),
            article.CreatedAt,
            article.UpdatedAt
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(
        [FromBody] ArticleCreateRequest request,
        CancellationToken cancellationToken = default)
    {
        var validationError = ValidateArticlePayload(request.Title, request.Content, request.Writer, request.Category);
        if (validationError is not null)
        {
            return BadRequest(new { message = validationError });
        }

        // ImageUrl remains a simple string so the planned /upload endpoint can plug in without changing this contract.
        var article = await _articleCommandService.CreateAsync(
            request.Title,
            request.Content,
            request.ImageUrl,
            request.ThumbnailUrl,
            request.Writer,
            request.Category,
            cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = article.Id }, new
        {
            article.Id,
            article.Title,
            article.Content,
            Author = article.Writer,
            Writer = article.Writer,
            article.Category,
            article.Views,
            article.ImageUrl,
            article.ThumbnailUrl,
            Images = BuildImageSet(article.ImageUrl, article.ThumbnailUrl),
            article.CreatedAt,
            article.UpdatedAt
        });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] ArticleUpdateRequest request,
        CancellationToken cancellationToken = default)
    {
        var validationError = ValidateArticlePayload(request.Title, request.Content, request.Writer, request.Category);
        if (validationError is not null)
        {
            return BadRequest(new { message = validationError });
        }

        // When images start flowing through /upload we can simply pass the returned URL here.
        var article = await _articleCommandService.UpdateAsync(
            id,
            request.Title,
            request.Content,
            request.ImageUrl,
            request.ThumbnailUrl,
            request.Writer,
            request.Category,
            cancellationToken);

        if (article is null)
        {
            return NotFound(new { message = "Article not found." });
        }

        return Ok(new
        {
            article.Id,
            article.Title,
            article.Content,
            Author = article.Writer,
            Writer = article.Writer,
            article.Category,
            article.Views,
            article.ImageUrl,
            article.ThumbnailUrl,
            Images = BuildImageSet(article.ImageUrl, article.ThumbnailUrl),
            article.CreatedAt,
            article.UpdatedAt
        });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken = default)
    {
        var deleted = await _articleCommandService.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound(new { message = "Article not found." });
        }

        return NoContent();
    }

    private static IReadOnlyList<string> BuildImageSet(string? imageUrl, string? thumbnailUrl)
    {
        var images = new List<string>(capacity: 2);
        if (!string.IsNullOrWhiteSpace(imageUrl))
        {
            images.Add(imageUrl);
        }

        if (!string.IsNullOrWhiteSpace(thumbnailUrl) &&
            !string.Equals(thumbnailUrl, imageUrl, StringComparison.OrdinalIgnoreCase))
        {
            images.Add(thumbnailUrl);
        }

        return images;
    }

    private static string? ValidateArticlePayload(string title, string content, string writer, string category)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return "Title is required.";
        }

        if (string.IsNullOrWhiteSpace(content))
        {
            return "Content is required.";
        }

        if (string.IsNullOrWhiteSpace(writer))
        {
            return "Writer is required.";
        }

        if (string.IsNullOrWhiteSpace(category))
        {
            return "Category is required.";
        }

        return null;
    }
}
