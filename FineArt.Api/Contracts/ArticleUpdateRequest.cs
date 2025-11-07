namespace FineArt.Api.Contracts;

public record ArticleUpdateRequest(
    string Title,
    string Content,
    string? ImageUrl,
    string? ThumbnailUrl,
    string Writer,
    string Category);
