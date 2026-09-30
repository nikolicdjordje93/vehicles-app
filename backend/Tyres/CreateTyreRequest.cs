using System.ComponentModel.DataAnnotations;

namespace Vehicles.Api.Models;

// What the frontend sends when creating or updating a tyre - same idea as
// CreateVehicleRequest, no Id since the database assigns (or the route
// already carries) it. See CreateVehicleRequest for why there's no
// [property: ...] target on the attributes below.
public record CreateTyreRequest(
    [Required(ErrorMessage = "Brand is required.")]
    string Brand,
    [Range(1, 100, ErrorMessage = "Size must be a positive number.")]
    int SizeInches,
    [Required(ErrorMessage = "Season is required.")]
    string Season,
    [Range(typeof(decimal), "0.01", "79228162514264337593543950335", ErrorMessage = "Price must be greater than 0.")]
    decimal Price);
