using Vehicles.Api.Models;

namespace Vehicles.Api.Services;

// The controller only talks to this interface - all the actual database
// work (and the business rules, like "throw if the id doesn't exist")
// lives in VehicleService below.
public interface IVehicleService
{
    Task<List<VehicleResponse>> GetAsync(bool isNew);
    Task<VehicleOptions> GetOptionsAsync();
    Task<VehicleResponse> CreateAsync(CreateVehicleRequest request);
    Task UpdateAsync(int id, CreateVehicleRequest request);
    Task DeleteAsync(int id);
}
