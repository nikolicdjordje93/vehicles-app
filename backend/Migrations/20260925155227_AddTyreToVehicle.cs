using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vehicles.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTyreToVehicle : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TyreId",
                table: "Vehicles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TyreQuantity",
                table: "Vehicles",
                type: "integer",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Vehicles",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "TyreId", "TyreQuantity" },
                values: new object[] { null, null });

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_TyreId",
                table: "Vehicles",
                column: "TyreId");

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Tyres_TyreId",
                table: "Vehicles",
                column: "TyreId",
                principalTable: "Tyres",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Tyres_TyreId",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_TyreId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "TyreId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "TyreQuantity",
                table: "Vehicles");
        }
    }
}
