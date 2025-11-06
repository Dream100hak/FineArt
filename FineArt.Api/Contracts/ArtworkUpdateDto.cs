namespace FineArt.Api.Contracts;

public record ArtworkUpdateDto(string Title, int Price, string? ImageUrl, string Status);
