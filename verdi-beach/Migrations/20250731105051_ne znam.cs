using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace verdi_beach.Migrations
{
    /// <inheritdoc />
    public partial class neznam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ZoneId",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Reservations",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Reservations",
                newName: "id");

            migrationBuilder.AddColumn<int>(
                name: "ZoneId",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
