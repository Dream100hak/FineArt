using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FineArt.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class LinkArtistToArtworks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArtistId",
                table: "Artworks",
                type: "int",
                nullable: true);

            migrationBuilder.Sql("""
                INSERT INTO Artists (Name, Bio, Nationality, ImageUrl, CreatedAt)
                SELECT 'Unknown Artist', '', '', '', UTC_TIMESTAMP()
                WHERE NOT EXISTS (SELECT 1 FROM Artists);
                """);

            migrationBuilder.Sql("""
                UPDATE Artworks
                SET ArtistId = (
                    SELECT Id FROM Artists ORDER BY Id LIMIT 1
                )
                WHERE ArtistId IS NULL;
                """);

            migrationBuilder.AlterColumn<int>(
                name: "ArtistId",
                table: "Artworks",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artworks_ArtistId",
                table: "Artworks",
                column: "ArtistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Artworks_Artists_ArtistId",
                table: "Artworks",
                column: "ArtistId",
                principalTable: "Artists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artworks_Artists_ArtistId",
                table: "Artworks");

            migrationBuilder.DropIndex(
                name: "IX_Artworks_ArtistId",
                table: "Artworks");

            migrationBuilder.AlterColumn<int>(
                name: "ArtistId",
                table: "Artworks",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.DropColumn(
                name: "ArtistId",
                table: "Artworks");
        }
    }
}
