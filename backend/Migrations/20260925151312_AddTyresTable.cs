using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Vehicles.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTyresTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tyres",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Brand = table.Column<string>(type: "text", nullable: false),
                    SizeInches = table.Column<int>(type: "integer", nullable: false),
                    Season = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tyres", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Tyres",
                columns: new[] { "Id", "Brand", "Price", "Season", "SizeInches" },
                values: new object[,]
                {
                    { 1, "Michelin", 85m, "Summer", 16 },
                    { 2, "Bridgestone", 95m, "Winter", 17 },
                    { 3, "Goodyear", 105m, "All-season", 18 },
                    { 4, "Continental", 80m, "Summer", 16 },
                    { 5, "Pirelli", 98m, "Winter", 17 },
                    { 6, "Dunlop", 100m, "All-season", 18 },
                    { 7, "Hankook", 65m, "Summer", 15 },
                    { 8, "Yokohama", 78m, "Winter", 16 },
                    { 9, "Kumho", 82m, "All-season", 17 },
                    { 10, "Michelin", 115m, "Winter", 18 },
                    { 11, "Continental", 92m, "All-season", 17 },
                    { 12, "Bridgestone", 70m, "Summer", 15 },
                    { 13, "Pirelli", 108m, "Summer", 18 },
                    { 14, "Goodyear", 88m, "Winter", 16 },
                    { 15, "Hankook", 90m, "All-season", 17 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tyres");
        }
    }
}
