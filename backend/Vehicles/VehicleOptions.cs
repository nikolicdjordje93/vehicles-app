namespace Vehicles.Api.Models;

// Powers the autocomplete suggestions on the "Add vehicle" form - the
// distinct values that already exist in the database for each field, plus
// which models belong to which brand. These are suggestions, not a hard
// whitelist: the form fields stay free text, so a genuinely new brand or
// model can still be typed in.
public record VehicleOptions(
    List<string> Brands,
    Dictionary<string, List<string>> ModelsByBrand,
    // Šifarnik - a real hard list (id + name), same as Tyres below,
    // not free text like Brands/Colors/Engines.
    List<BodyTypeResponse> BodyTypes,
    List<string> Colors,
    List<string> Engines,
    List<int> Years,
    // Existing tyres, for the optional "attach a tyre" dropdown - this one
    // IS a hard list (a real TyreId, not free text), unlike the rest.
    List<TyreResponse> Tyres,
    // Every piece of equipment that exists, for the checkbox list on the
    // form - same reasoning as BodyTypes/Tyres above.
    List<EquipmentResponse> Equipment);
