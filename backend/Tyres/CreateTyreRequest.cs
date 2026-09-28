namespace Vehicles.Api.Models;

// What the frontend sends when creating or updating a tyre - same idea as
// CreateVehicleRequest, no Id since the database assigns (or the route
// already carries) it.
public record CreateTyreRequest(
    string Brand,
    int SizeInches,
    string Season,
    decimal Price);
