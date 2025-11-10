namespace FineArt.Api.Contracts;

public record ExhibitionCreateRequest(
    string Title,
    string Description,
    string Artist,
    DateTime StartDate,
    DateTime EndDate,
    string? ImageUrl,
    string Location,
    string Category);
