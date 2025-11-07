namespace FineArt.Api.Contracts;

public record ArticleCreateRequest(
    string Title,
    string Content,
    string? ImageUrl,
    string Writer,
    string Category);
