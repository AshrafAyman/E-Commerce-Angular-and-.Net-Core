using Microsoft.EntityFrameworkCore.Migrations;

namespace EmojiStore.Migrations
{
    public partial class changeProductTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Governorate",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "Governorate",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "ShippingId",
                table: "Products",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ShippingId",
                table: "Products",
                column: "ShippingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Shippings_ShippingId",
                table: "Products",
                column: "ShippingId",
                principalTable: "Shippings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Shippings_ShippingId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ShippingId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ShippingId",
                table: "Products");

            migrationBuilder.AddColumn<string>(
                name: "Governorate",
                table: "Customers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Governorate",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
