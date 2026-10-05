namespace Vehicles.Api.Models;

// DTO - the JSON shape returned to the frontend for one piece of equipment.
public record EquipmentResponse(int Id, string Name, string Code);
