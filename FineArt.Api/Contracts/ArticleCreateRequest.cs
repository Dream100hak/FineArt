namespace FineArt.Api.Contracts;

public record ArticleCreateRequest(
    string Title,
    string Content,
    string? ImageUrl,
    string? ThumbnailUrl,
    string Writer,
    string Category);
