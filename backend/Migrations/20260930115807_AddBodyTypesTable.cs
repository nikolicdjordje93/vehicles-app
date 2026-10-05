using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Vehicles.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBodyTypesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BodyTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BodyTypes", x => x.Id);
                });

            migrationBuilder.AddColumn<int>(
                name: "BodyTypeId",
                table: "Vehicles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            // Prebacujemo postojeće vrednosti PRE nego što obrišemo staru kolonu.
            migrationBuilder.Sql(@"
                INSERT INTO ""BodyTypes"" (""Name"")
                SELECT DISTINCT ""BodyType"" FROM ""Vehicles"";
            ");

            migrationBuilder.Sql(@"
                UPDATE ""Vehicles"" v
                SET ""BodyTypeId"" = bt.""Id""
                FROM ""BodyTypes"" bt
                WHERE bt.""Name"" = v.""BodyType"";
            ");

            migrationBuilder.DropColumn(
                name: "BodyType",
                table: "Vehicles");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_BodyTypeId",
                table: "Vehicles",
                column: "BodyTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_BodyTypes_BodyTypeId",
                table: "Vehicles",
                column: "BodyTypeId",
                principalTable: "BodyTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_BodyTypes_BodyTypeId",
                table: "Vehicles");

            migrationBuilder.DropTable(
                name: "BodyTypes");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_BodyTypeId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "BodyTypeId",
                table: "Vehicles");

            migrationBuilder.AddColumn<string>(
                name: "BodyType",
                table: "Vehicles",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}