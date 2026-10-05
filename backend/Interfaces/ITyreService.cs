using Vehicles.Api.Models;

namespace Vehicles.Api.Services;

public interface ITyreService
{
    Task<List<TyreResponse>> GetAsync();
    Task<TyreOptions> GetOptionsAsync();
    Task<TyreResponse> CreateAsync(CreateTyreRequest request);
    Task UpdateAsync(int id, CreateTyreRequest request);
    Task DeleteAsync(int id);
}
