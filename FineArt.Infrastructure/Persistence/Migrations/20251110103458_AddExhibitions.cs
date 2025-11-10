using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FineArt.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddExhibitions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Exhibitions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Artist = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ImageUrl = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Location = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Category = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: false, defaultValue: "Group")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exhibitions", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Exhibitions",
                columns: new[] { "Id", "Artist", "Category", "CreatedAt", "Description", "EndDate", "ImageUrl", "Location", "StartDate", "Title" },
                values: new object[,]
                {
                    { 1, "이수현", "Digital", new DateTime(2024, 12, 20, 0, 0, 0, 0, DateTimeKind.Utc), "디지털 확장 설치전. FineArt Cube 전체를 감싸는 몰입형 잉크 라이트 설치입니다.", new DateTime(2025, 6, 16, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=2000&q=80", "FineArt Cube", new DateTime(2025, 2, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Void Ink · 여백의 잔상" },
                    { 2, "미나 허", "Group", new DateTime(2025, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "미디어 회화전. OLED 페인트 패널과 투명 스크린으로 서울의 야경을 재해석합니다.", new DateTime(2025, 8, 30, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2000&q=80", "FineArt Cube", new DateTime(2025, 4, 12, 0, 0, 0, 0, DateTimeKind.Utc), "Seoul Lightscape" },
                    { 3, "라텍스 듀오", "Installation", new DateTime(2025, 1, 22, 0, 0, 0, 0, DateTimeKind.Utc), "조명 작업전. 섬세한 석고 텍스처와 광섬유를 결합한 라텍스 듀오의 신작.", new DateTime(2025, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1465311440653-ba9b1d68da21?auto=format&fit=crop&w=2000&q=80", "FineArt Gallery", new DateTime(2025, 5, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Warm Mineral" }
                });

            migrationBuilder.CreateIndex(
                name: "idx_exhibitions_category",
                table: "Exhibitions",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "idx_exhibitions_schedule",
                table: "Exhibitions",
                column: "StartDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Exhibitions");
        }
    }
}
