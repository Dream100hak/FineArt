using Microsoft.EntityFrameworkCore;
using FineArt.Domain;

namespace FineArt.Infrastructure.Persistence;

// EF Core DbContext
public class AppDb : DbContext
{
    public AppDb(DbContextOptions<AppDb> options) : base(options) { }

    public DbSet<Artwork> Artworks => Set<Artwork>();
    public DbSet<Artist> Artists => Set<Artist>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Exhibition> Exhibitions => Set<Exhibition>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(builder =>
        {
            builder.HasIndex(u => u.Email).IsUnique();
            builder.Property(u => u.Email).HasMaxLength(256);
            builder.Property(u => u.Role).HasMaxLength(64);
        });

        modelBuilder.Entity<Artist>(builder =>
        {
            builder.Property(a => a.Name).HasMaxLength(200);
            builder.Property(a => a.Nationality).HasMaxLength(100);
            builder.Property(a => a.ImageUrl).HasMaxLength(1024);
        });

        modelBuilder.Entity<Artwork>(builder =>
        {
            builder.HasIndex(a => a.Price).HasDatabaseName("idx_artwork_price");
            builder.HasIndex(a => a.CreatedAt).HasDatabaseName("idx_artwork_created_at");
            builder.HasOne(a => a.Artist)
                .WithMany(ar => ar.Artworks)
                .HasForeignKey(a => a.ArtistId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Article>(builder =>
        {
            builder.Property(a => a.Title).HasMaxLength(500);
            builder.Property(a => a.Writer).HasMaxLength(128);
            builder.Property(a => a.Category).HasMaxLength(64);
            builder.Property(a => a.ImageUrl).HasMaxLength(2048);
            builder.Property(a => a.ThumbnailUrl).HasMaxLength(2048);
            builder.Property(a => a.Views).HasDefaultValue(0);
            builder.HasIndex(a => a.Category).HasDatabaseName("idx_articles_category");
            builder.HasIndex(a => a.CreatedAt).HasDatabaseName("idx_articles_created_at");
        });

        modelBuilder.Entity<Exhibition>(builder =>
        {
            builder.Property(e => e.Title).HasMaxLength(255).IsRequired();
            builder.Property(e => e.Artist).HasMaxLength(255).IsRequired();
            builder.Property(e => e.Location).HasMaxLength(255).IsRequired();
            builder.Property(e => e.ImageUrl).HasMaxLength(500);
            builder.Property(e => e.Description).HasColumnType("longtext");
            builder.Property(e => e.Category)
                .HasConversion<string>()
                .HasMaxLength(32)
                .HasDefaultValue(ExhibitionCategory.Group);
            builder.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP(6)");

            builder.HasIndex(e => e.Category).HasDatabaseName("idx_exhibitions_category");
            builder.HasIndex(e => e.StartDate).HasDatabaseName("idx_exhibitions_schedule");

            builder.HasData(
                new Exhibition
                {
                    Id = 1,
                    Title = "Void Ink · 여백의 잔상",
                    Description = "디지털 확장 설치전. FineArt Cube 전체를 감싸는 몰입형 잉크 라이트 설치입니다.",
                    Artist = "이수현",
                    Location = "FineArt Cube",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 2, 15), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2025, 6, 16), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Digital,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2024, 12, 20), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 2,
                    Title = "Seoul Lightscape",
                    Description = "미디어 회화전. OLED 페인트 패널과 투명 스크린으로 서울의 야경을 재해석합니다.",
                    Artist = "미나 허",
                    Location = "FineArt Cube",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 4, 12), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2025, 8, 30), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Group,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 1, 5), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 3,
                    Title = "Warm Mineral",
                    Description = "조명 작업전. 섬세한 석고 텍스처와 광섬유를 결합한 라텍스 듀오의 신작.",
                    Artist = "라텍스 듀오",
                    Location = "FineArt Gallery",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 5, 2), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2025, 9, 1), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1465311440653-ba9b1d68da21?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Installation,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 1, 22), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 4,
                    Title = "Luminary Garden",
                    Description = "은은한 빛으로 숨 쉬는 인터랙티브 식물 설치. 관람자의 움직임에 따라 잎맥이 발광합니다.",
                    Artist = "서이현",
                    Location = "FineArt Green Room",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 3, 10), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2025, 7, 8), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Solo,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 1, 28), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 5,
                    Title = "Chromatic Drift",
                    Description = "수평선처럼 펼쳐지는 색면 미디어. 8K 레이어가 시간에 따라 서서히 이동합니다.",
                    Artist = "Collective Prism",
                    Location = "FineArt Cube",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 6, 1), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2025, 10, 4), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Group,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 2, 3), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 6,
                    Title = "Echoes of Clay",
                    Description = "도자기 조각 위에 프로젝션 맵핑을 입혀 소리와 색이 울리는 설치전.",
                    Artist = "이마루 & 윤채",
                    Location = "FineArt Atelier",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 4, 5), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2025, 9, 19), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Group,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 2, 12), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 7,
                    Title = "Hologram Opera",
                    Description = "공간 전체를 사용하는 270도 홀로그램 연출과 클래식 사운드의 만남.",
                    Artist = "Studio Nabile",
                    Location = "FineArt Dome",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 8, 15), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2026, 1, 12), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Digital,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 3, 8), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 8,
                    Title = "Northbound Light",
                    Description = "극지방의 빛을 기록한 사진과 사운드 아카이브를 immersive 환경으로 재현.",
                    Artist = "린다 베르그",
                    Location = "FineArt Vault",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 9, 20), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2026, 2, 20), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Solo,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 4, 1), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 9,
                    Title = "Paper Tectonics",
                    Description = "거대한 종이 구조물을 쌓아 도시 풍경을 재구성하는 설치 프로젝트.",
                    Artist = "Paper Assembly",
                    Location = "FineArt Warehouse",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 5, 18), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2025, 11, 30), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Installation,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 4, 10), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 10,
                    Title = "Sensorial Bloom",
                    Description = "향과 빛, 사운드를 결합해 계절의 변화를 체험하게 하는 몰입형 정원.",
                    Artist = "Co.studio Bloom",
                    Location = "FineArt Pavilion",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 7, 2), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2025, 12, 5), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Installation,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 4, 18), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 11,
                    Title = "Afterimage Waves",
                    Description = "레이저 스캔으로 기록한 도시의 잔상을 데이터 조각으로 시각화.",
                    Artist = "장도현",
                    Location = "FineArt Research Lab",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 10, 8), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2026, 3, 14), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Digital,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 5, 6), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 12,
                    Title = "Kinetic Archive",
                    Description = "수장고에서 꺼낸 모듈 조각을 로봇 암으로 재배열하는 라이브 퍼포먼스.",
                    Artist = "FineArt Robot Lab",
                    Location = "FineArt Machine Room",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 11, 12), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2026, 4, 25), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1475688621402-4257a8543cfe?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Group,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 5, 20), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 13,
                    Title = "Mist City Atlas",
                    Description = "안개를 분사하는 대형 지도 구조와 프로젝션을 결합해 도시 기후를 표현.",
                    Artist = "Atmos Lab",
                    Location = "FineArt Plaza",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 6, 25), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2025, 9, 30), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Installation,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 5, 28), DateTimeKind.Utc)
                },
                new Exhibition
                {
                    Id = 14,
                    Title = "Aquifer Chorus",
                    Description = "수중 녹음을 재구성한 사운드 인스톨레이션과 빛의 파동 퍼포먼스.",
                    Artist = "Mira Collective",
                    Location = "FineArt Hall B1",
                    StartDate = DateTime.SpecifyKind(new DateTime(2025, 12, 1), DateTimeKind.Utc),
                    EndDate = DateTime.SpecifyKind(new DateTime(2026, 5, 10), DateTimeKind.Utc),
                    ImageUrl = "https://images.unsplash.com/photo-1475694867812-f82b8696d610?auto=format&fit=crop&w=2000&q=80",
                    Category = ExhibitionCategory.Digital,
                    CreatedAt = DateTime.SpecifyKind(new DateTime(2025, 6, 8), DateTimeKind.Utc)
                });
        });
    }
}
