using Vehicles.Api.Models;

namespace Vehicles.Api.Services;

// Read-only on purpose - equipment rows are only added directly in the
// database (same as BodyTypes), so there's no Create/Update/Delete here,
// just the one list the Equipment page and the vehicle form both need.
public interface IEquipmentService
{
    Task<List<EquipmentResponse>> GetAsync();
}
