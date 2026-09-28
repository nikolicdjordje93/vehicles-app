namespace Vehicles.Api.Models;

// Powers the autocomplete suggestions on the Add/Edit tyre form.
public record TyreOptions(
    List<string> Brands,
    List<int> Sizes,
    List<string> Seasons);
