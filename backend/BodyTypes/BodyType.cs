namespace Vehicles.Api.Models;

// Šifarnik - a controlled, standalone list of valid body types (Sedan,
// Hatchback, SUV...). This list exists on its own, independent of which
// vehicles currently exist - unlike the old free-text field, deleting
// every SUV in stock wouldn't make "SUV" disappear from here.
public class BodyType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
