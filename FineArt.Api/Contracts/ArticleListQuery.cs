namespace FineArt.Api.Contracts;

public record ArticleListQuery(
    string? Category,
    string? Keyword,
    string? Sort,
    int Page = 1,
    int Size = 10);
