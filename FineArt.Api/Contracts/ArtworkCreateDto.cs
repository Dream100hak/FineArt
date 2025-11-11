namespace FineArt.Api.Contracts;

public record ArtworkCreateDto(
    string Title,
    string Description,
    string MainTheme,
    string? SubTheme,
    string Size,
    string Material,
    int Price,
    bool IsRentable,
    int? RentPrice,
    string? ImageUrl,
    string Status,
    int ArtistId);
