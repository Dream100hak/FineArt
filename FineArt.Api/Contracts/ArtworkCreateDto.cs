namespace FineArt.Api.Contracts;

public record ArtworkCreateDto(string Title, int Price, string? ImageUrl, string Status);
