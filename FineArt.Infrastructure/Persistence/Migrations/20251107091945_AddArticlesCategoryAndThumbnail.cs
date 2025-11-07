using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FineArt.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddArticlesCategoryAndThumbnail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "Articles",
                type: "varchar(2048)",
                maxLength: 2048,
                nullable: false,
                defaultValue: string.Empty)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.Sql(
                """
                INSERT INTO Articles (Title, Content, ImageUrl, ThumbnailUrl, Writer, Category, Views, CreatedAt, UpdatedAt)
                SELECT seed.Title,
                       seed.Content,
                       seed.ImageUrl,
                       seed.ThumbnailUrl,
                       seed.Writer,
                       seed.Category,
                       seed.Views,
                       seed.CreatedAt,
                       seed.UpdatedAt
                FROM (
                    SELECT '서비스 오픈 안내' AS Title,
                           '파인아트 보드 정식 오픈 공지입니다.' AS Content,
                           'https://cdn.fineart.local/articles/notice-hero.jpg' AS ImageUrl,
                           'https://cdn.fineart.local/articles/notice-thumb.jpg' AS ThumbnailUrl,
                           'FineArt Admin' AS Writer,
                           'notice' AS Category,
                           0 AS Views,
                           '2025-01-15 00:00:00' AS CreatedAt,
                           '2025-01-15 00:00:00' AS UpdatedAt
                    UNION ALL
                    SELECT '3월 라이브 옥션' AS Title,
                           '프리미엄 작가 10인의 대표작이 공개됩니다.' AS Content,
                           'https://cdn.fineart.local/articles/event-hero.jpg' AS ImageUrl,
                           'https://cdn.fineart.local/articles/event-thumb.jpg' AS ThumbnailUrl,
                           'Curator Team' AS Writer,
                           'event' AS Category,
                           0 AS Views,
                           '2025-02-20 00:00:00' AS CreatedAt,
                           '2025-02-20 00:00:00' AS UpdatedAt
                    UNION ALL
                    SELECT '거장 추천 전시 5선' AS Title,
                           '주말에 가기 좋은 자유 게시판 추천입니다.' AS Content,
                           'https://cdn.fineart.local/articles/free-hero.jpg' AS ImageUrl,
                           'https://cdn.fineart.local/articles/free-thumb.jpg' AS ThumbnailUrl,
                           'Community Host' AS Writer,
                           'free' AS Category,
                           0 AS Views,
                           '2025-03-03 00:00:00' AS CreatedAt,
                           '2025-03-03 00:00:00' AS UpdatedAt
                ) AS seed
                WHERE NOT EXISTS (SELECT 1 FROM Articles);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DELETE FROM Articles
                WHERE Title IN ('서비스 오픈 안내', '3월 라이브 옥션', '거장 추천 전시 5선');
                """);

            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "Articles");
        }
    }
}
