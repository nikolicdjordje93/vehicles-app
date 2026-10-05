namespace Vehicles.Api.Models;

// The many-to-many join table between Vehicle and Equipment - one row per
// vehicle+equipment combination that actually exists. Composite primary
// key (VehicleId, EquipmentId), not its own Id - configured in
// AppDbContext.OnModelCreating - because that pair already uniquely
// identifies a row (the same vehicle can't have the same equipment twice),
// so a surrogate id would just be an extra column with no new information.
public class VehicleEquipment
{
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    public int EquipmentId { get; set; }
    public Equipment? Equipment { get; set; }
}
