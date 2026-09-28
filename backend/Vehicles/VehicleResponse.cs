namespace Vehicles.Api.Models;

// The single shape we return for a vehicle - whether it's new or used.
// Earlier this project had two near-identical records (NewVehicle /
// UsedVehicle) that differed only in one field's name (Brand vs
// Manufacturer). Since the frontend showed the same label either way,
// that split wasn't earning its keep - it just meant two DTOs, two
// TypeScript types, and an if/else in the controller for no real benefit.
// One shared response DTO removes all of that duplication.
public record VehicleResponse(
    int Id,
    bool IsNew,
    string Brand,
    string Model,
    int Year,
    string BodyType,
    string Color,
    string Engine,
    decimal Price,
    int? TyreId,
    int? TyreQuantity,
    // Denormalized from the attached Tyre (if any) so the frontend can
    // show it in the table without a second request.
    string? TyreBrand,
    int? TyreSizeInches,
    string? TyreSeason);
