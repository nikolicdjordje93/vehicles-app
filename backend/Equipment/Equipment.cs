namespace Vehicles.Api.Models;

// Standalone list of equipment/features a vehicle can have (Cruise
// control, ABS, Navigation...). Many-to-many with Vehicle - see
// VehicleEquipment, the join table in between.
public class Equipment
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}
