using System.ComponentModel.DataAnnotations;

namespace Vehicles.Api.Models;

// No [property: ...] target here - for a record's primary constructor
// parameters, ASP.NET's model validation reads attributes straight off the
// parameter itself. Putting them on the generated property instead
// ([property: ...]) throws an InvalidOperationException at request time -
// .NET checks for exactly this mistake instead of silently ignoring it.
public record CreateVehicleRequest(
    bool IsNew,
    [Required(ErrorMessage = "Brand is required.")]
    string Brand,
    [Required(ErrorMessage = "Model is required.")]
    string Model,
    // [Required] is a no-op on int (0 is a valid value for it), so a hard
    // lower bound is what actually catches "no body type chosen" here.
    [Range(1, int.MaxValue, ErrorMessage = "Body type is required.")]
    int BodyTypeId,
    [Required(ErrorMessage = "Color is required.")]
    string Color,
    [Required(ErrorMessage = "Engine is required.")]
    string Engine,
    [Range(1900, 2100, ErrorMessage = "Year must be between 1900 and 2100.")]
    int Year,
    [Range(typeof(decimal), "0.01", "79228162514264337593543950335", ErrorMessage = "Price must be greater than 0.")]
    decimal Price,
    // Optional - null means no tyre attached to this vehicle.
    int? TyreId,
    [Range(1, 100, ErrorMessage = "Tyre quantity must be a positive number.")]
    int? TyreQuantity,
    // The full set of equipment ids this vehicle should end up with - not
    // "add this one" or "remove that one". No [Required] - an empty list
    // (no equipment at all) is perfectly valid, so it stays optional; if
    // the field is missing entirely from the JSON, this defaults to null,
    // which VehicleService treats the same as an empty list.
    List<int>? EquipmentIds);
