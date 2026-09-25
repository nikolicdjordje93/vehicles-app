namespace Vehicles.Api.Models;

// Powers the autocomplete suggestions on the "Add vehicle" form - the
// distinct values that already exist in the database for each field, plus
// which models belong to which brand. These are suggestions, not a hard
// whitelist: the form fields stay free text, so a genuinely new brand or
// model can still be typed in.
public record VehicleOptions(
    List<string> Brands,
    Dictionary<string, List<string>> ModelsByBrand,
    List<string> BodyTypes,
    List<string> Engines,
    List<int> Years);
