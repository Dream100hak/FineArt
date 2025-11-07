namespace FineArt.Domain;

public enum ArtworkStatus
{
    ForSale,
    Sold,
    Rentable
}

public class Artwork
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public int Price { get; set; }
    public string ImageUrl { get; set; } = "";
    public ArtworkStatus Status { get; set; } = ArtworkStatus.ForSale;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int ArtistId { get; set; }
    public Artist? Artist { get; set; }
}
