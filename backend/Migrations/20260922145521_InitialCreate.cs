using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Vehicles.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IsNew = table.Column<bool>(type: "boolean", nullable: false),
                    Brand = table.Column<string>(type: "text", nullable: false),
                    Model = table.Column<string>(type: "text", nullable: false),
                    BodyType = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    Engine = table.Column<string>(type: "text", nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Vehicles",
                columns: new[] { "Id", "BodyType", "Brand", "Color", "Engine", "IsNew", "Model", "Price", "Year" },
                values: new object[,]
                {
                    { 1, "Hatchback", "Volkswagen", "White", "1.0 TSI", true, "Polo", 18500m, 2026 },
                    { 2, "Hatchback", "Volkswagen", "Black", "1.5 TSI", true, "Golf", 24500m, 2026 },
                    { 3, "SUV", "Volkswagen", "Grey", "2.0 TDI", true, "Tiguan", 34500m, 2026 },
                    { 4, "Sedan", "Volkswagen", "Blue", "2.0 TDI", true, "Passat", 33500m, 2026 },
                    { 5, "Hatchback", "Audi", "Blue", "1.5 TFSI", true, "A3", 28000m, 2026 },
                    { 6, "Sedan", "Audi", "Black", "2.0 TDI", true, "A4", 42000m, 2026 },
                    { 7, "Sedan", "Audi", "Grey", "2.0 TDI", true, "A6", 55000m, 2026 },
                    { 8, "SUV", "Audi", "White", "1.5 TFSI", true, "Q3", 38000m, 2026 },
                    { 9, "SUV", "Audi", "White", "2.0 TFSI", true, "Q5", 52000m, 2026 },
                    { 10, "Hatchback", "Seat", "Red", "1.0 MPI", true, "Ibiza", 16500m, 2026 },
                    { 11, "Hatchback", "Seat", "Silver", "1.5 TSI", true, "Leon", 23000m, 2026 },
                    { 12, "SUV", "Seat", "Orange", "1.0 TSI", true, "Arona", 21000m, 2026 },
                    { 13, "Sedan", "Skoda", "Blue", "2.0 TDI", true, "Octavia", 27500m, 2026 },
                    { 14, "Hatchback", "Skoda", "White", "1.0 TSI", true, "Fabia", 17500m, 2026 },
                    { 15, "SUV", "Skoda", "Black", "2.0 TDI", true, "Kodiaq", 39500m, 2026 },
                    { 16, "Hatchback", "Volkswagen", "Blue", "1.6 TDI", false, "Golf", 8500m, 2015 },
                    { 17, "Wagon", "Skoda", "Silver", "2.0 TDI", false, "Octavia", 9800m, 2017 },
                    { 18, "Sedan", "Volkswagen", "Black", "2.0 TDI", false, "Passat", 10500m, 2016 },
                    { 19, "Sedan", "Audi", "Grey", "2.0 TDI", false, "A4", 9200m, 2014 },
                    { 20, "Hatchback", "Seat", "Red", "1.6 TDI", false, "Leon", 6500m, 2013 },
                    { 21, "Hatchback", "Volkswagen", "White", "1.0 TSI", false, "Polo", 9700m, 2018 },
                    { 22, "Hatchback", "Skoda", "Blue", "1.2 TSI", false, "Fabia", 6200m, 2016 },
                    { 23, "SUV", "Audi", "Black", "2.0 TDI", false, "Q3", 13500m, 2015 },
                    { 24, "Hatchback", "Seat", "Yellow", "1.0 MPI", false, "Ibiza", 8900m, 2019 },
                    { 25, "SUV", "Volkswagen", "Grey", "2.0 TDI", false, "Tiguan", 15500m, 2017 },
                    { 26, "Hatchback", "Audi", "Blue", "1.4 TFSI", false, "A3", 11500m, 2016 },
                    { 27, "Sedan", "Skoda", "Black", "2.0 TDI", false, "Superb", 12500m, 2015 },
                    { 28, "SUV", "Seat", "Orange", "1.0 TSI", false, "Arona", 14500m, 2020 },
                    { 29, "Wagon", "Volkswagen", "White", "1.6 TDI", false, "Passat", 7200m, 2013 },
                    { 30, "Sedan", "Audi", "Silver", "2.0 TDI", false, "A6", 8900m, 2012 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Vehicles");
        }
    }
}
