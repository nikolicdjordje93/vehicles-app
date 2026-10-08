using Vehicles.Api.Models;

namespace Vehicles.Api.Services;

public interface ITyreService
{
    Task<List<TyreResponse>> GetAsync(CancellationToken cancellationToken);
    Task<TyreOptions> GetOptionsAsync(CancellationToken cancellationToken);
    Task<TyreResponse> CreateAsync(CreateTyreRequest request);
    Task UpdateAsync(int id, CreateTyreRequest request);
    Task DeleteAsync(int id);
}
