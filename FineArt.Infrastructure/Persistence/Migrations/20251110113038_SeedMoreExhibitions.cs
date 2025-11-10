using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FineArt.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedMoreExhibitions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Exhibitions",
                columns: new[] { "Id", "Artist", "CreatedAt", "Description", "EndDate", "ImageUrl", "Location", "StartDate", "Title" },
                values: new object[] { 4, "서이현", new DateTime(2025, 1, 28, 0, 0, 0, 0, DateTimeKind.Utc), "은은한 빛으로 숨 쉬는 인터랙티브 식물 설치. 관람자의 움직임에 따라 잎맥이 발광합니다.", new DateTime(2025, 7, 8, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=2000&q=80", "FineArt Green Room", new DateTime(2025, 3, 10, 0, 0, 0, 0, DateTimeKind.Utc), "Luminary Garden" });

            migrationBuilder.InsertData(
                table: "Exhibitions",
                columns: new[] { "Id", "Artist", "Category", "CreatedAt", "Description", "EndDate", "ImageUrl", "Location", "StartDate", "Title" },
                values: new object[,]
                {
                    { 5, "Collective Prism", "Group", new DateTime(2025, 2, 3, 0, 0, 0, 0, DateTimeKind.Utc), "수평선처럼 펼쳐지는 색면 미디어. 8K 레이어가 시간에 따라 서서히 이동합니다.", new DateTime(2025, 10, 4, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=80", "FineArt Cube", new DateTime(2025, 6, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Chromatic Drift" },
                    { 6, "이마루 & 윤채", "Group", new DateTime(2025, 2, 12, 0, 0, 0, 0, DateTimeKind.Utc), "도자기 조각 위에 프로젝션 맵핑을 입혀 소리와 색이 울리는 설치전.", new DateTime(2025, 9, 19, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80", "FineArt Atelier", new DateTime(2025, 4, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Echoes of Clay" },
                    { 7, "Studio Nabile", "Digital", new DateTime(2025, 3, 8, 0, 0, 0, 0, DateTimeKind.Utc), "공간 전체를 사용하는 270도 홀로그램 연출과 클래식 사운드의 만남.", new DateTime(2026, 1, 12, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=2000&q=80", "FineArt Dome", new DateTime(2025, 8, 15, 0, 0, 0, 0, DateTimeKind.Utc), "Hologram Opera" }
                });

            migrationBuilder.InsertData(
                table: "Exhibitions",
                columns: new[] { "Id", "Artist", "CreatedAt", "Description", "EndDate", "ImageUrl", "Location", "StartDate", "Title" },
                values: new object[] { 8, "린다 베르그", new DateTime(2025, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "극지방의 빛을 기록한 사진과 사운드 아카이브를 immersive 환경으로 재현.", new DateTime(2026, 2, 20, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80", "FineArt Vault", new DateTime(2025, 9, 20, 0, 0, 0, 0, DateTimeKind.Utc), "Northbound Light" });

            migrationBuilder.InsertData(
                table: "Exhibitions",
                columns: new[] { "Id", "Artist", "Category", "CreatedAt", "Description", "EndDate", "ImageUrl", "Location", "StartDate", "Title" },
                values: new object[,]
                {
                    { 9, "Paper Assembly", "Installation", new DateTime(2025, 4, 10, 0, 0, 0, 0, DateTimeKind.Utc), "거대한 종이 구조물을 쌓아 도시 풍경을 재구성하는 설치 프로젝트.", new DateTime(2025, 11, 30, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=2000&q=80", "FineArt Warehouse", new DateTime(2025, 5, 18, 0, 0, 0, 0, DateTimeKind.Utc), "Paper Tectonics" },
                    { 10, "Co.studio Bloom", "Installation", new DateTime(2025, 4, 18, 0, 0, 0, 0, DateTimeKind.Utc), "향과 빛, 사운드를 결합해 계절의 변화를 체험하게 하는 몰입형 정원.", new DateTime(2025, 12, 5, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=2000&q=80", "FineArt Pavilion", new DateTime(2025, 7, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Sensorial Bloom" },
                    { 11, "장도현", "Digital", new DateTime(2025, 5, 6, 0, 0, 0, 0, DateTimeKind.Utc), "레이저 스캔으로 기록한 도시의 잔상을 데이터 조각으로 시각화.", new DateTime(2026, 3, 14, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80", "FineArt Research Lab", new DateTime(2025, 10, 8, 0, 0, 0, 0, DateTimeKind.Utc), "Afterimage Waves" },
                    { 12, "FineArt Robot Lab", "Group", new DateTime(2025, 5, 20, 0, 0, 0, 0, DateTimeKind.Utc), "수장고에서 꺼낸 모듈 조각을 로봇 암으로 재배열하는 라이브 퍼포먼스.", new DateTime(2026, 4, 25, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1475688621402-4257a8543cfe?auto=format&fit=crop&w=2000&q=80", "FineArt Machine Room", new DateTime(2025, 11, 12, 0, 0, 0, 0, DateTimeKind.Utc), "Kinetic Archive" },
                    { 13, "Atmos Lab", "Installation", new DateTime(2025, 5, 28, 0, 0, 0, 0, DateTimeKind.Utc), "안개를 분사하는 대형 지도 구조와 프로젝션을 결합해 도시 기후를 표현.", new DateTime(2025, 9, 30, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2000&q=80", "FineArt Plaza", new DateTime(2025, 6, 25, 0, 0, 0, 0, DateTimeKind.Utc), "Mist City Atlas" },
                    { 14, "Mira Collective", "Digital", new DateTime(2025, 6, 8, 0, 0, 0, 0, DateTimeKind.Utc), "수중 녹음을 재구성한 사운드 인스톨레이션과 빛의 파동 퍼포먼스.", new DateTime(2026, 5, 10, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1475694867812-f82b8696d610?auto=format&fit=crop&w=2000&q=80", "FineArt Hall B1", new DateTime(2025, 12, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Aquifer Chorus" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Exhibitions",
                keyColumn: "Id",
                keyValue: 14);
        }
    }
}
