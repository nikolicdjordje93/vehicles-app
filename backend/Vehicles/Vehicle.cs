namespace Vehicles.Api.Models;

// EF Core entity - one row in the "Vehicles" table.
public class Vehicle
{
    public int Id { get; set; }
    public bool IsNew { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string BodyType { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Engine { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal Price { get; set; }

    // Optional selected tyre - null means no tyres chosen for this vehicle.
    public int? TyreId { get; set; }
    public Tyre? Tyre { get; set; }
    public int? TyreQuantity { get; set; }

    // Soft delete - true means "hidden", the row still exists in the DB.
    public bool IsDeleted { get; set; }
}
