namespace Vehicles.Api.Models;

// This is what the frontend sends us when adding a NEW row to the Vehicles
// table. It has no Id (the database assigns that automatically) and no
// "New vs Used" DTO shape - that split only matters when we READ vehicles
// back out and decide whether to label the brand field "Brand" or
// "Manufacturer". For writing, we just need the raw entity fields.
public record CreateVehicleRequest(
    bool IsNew,
    string Brand,
    string Model,
    string BodyType,
    string Color,
    string Engine,
    int Year,
    decimal Price);
