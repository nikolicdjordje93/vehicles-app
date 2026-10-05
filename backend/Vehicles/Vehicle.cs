namespace Vehicles.Api.Models;

// EF Core entity - one row in the "Vehicles" table.
public class Vehicle
{
    public int Id { get; set; }
    public bool IsNew { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    // Šifarnik FK - same pattern as TyreId/Tyre below.
    public int BodyTypeId { get; set; }
    public BodyType? BodyType { get; set; }
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

    // Many-to-many with Equipment, through the VehicleEquipment join
    // table. One row here per piece of equipment this vehicle actually has.
    public ICollection<VehicleEquipment> VehicleEquipment { get; set; } = new List<VehicleEquipment>();
}
