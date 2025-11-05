using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FineArt.Infrastructure.Migrations
{
    public partial class AddArtworkStatus : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Artworks",         // 실제 테이블명이 소문자라면 "artworks"로 변경
                type: "int",
                nullable: false,
                defaultValue: 0);          // ForSale = 0
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Artworks");        // 소문자면 동일하게 맞추기
        }
    }
}
