namespace Vehicles.Api.Models;

// This is the EF Core ENTITY - it describes one row in the "Vehicles" table.
// It is a plain mutable class (not a record) because EF Core needs to be able
// to track changes to its properties over time (important later for update/delete).
// It is intentionally NOT sent directly to the frontend - the controllers map it
// into the NewVehicle / UsedVehicle DTOs that the API already returns.
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
}
