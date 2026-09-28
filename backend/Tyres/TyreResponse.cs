namespace Vehicles.Api.Models;

// DTO - the JSON shape we return to the frontend for a tyre. Same
// entity/DTO split as Vehicle/VehicleResponse, applied here for the same
// reason: the frontend gets a stable contract, independent of however the
// Tyres table ends up structured internally (e.g. once it's connected to
// Vehicles through a join table).
public record TyreResponse(int Id, string Brand, int SizeInches, string Season, decimal Price);
