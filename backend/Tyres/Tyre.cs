namespace Vehicles.Api.Models;

// EF Core entity - one row in the "Tyres" table. A mutable class, same
// reasoning as Vehicle: EF Core needs to be able to track and update its
// properties over time. This is the entity we'll eventually connect to
// Vehicle through a separate join table, once a vehicle can have specific
// tyres attached to it.
public class Tyre
{
    public int Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public int SizeInches { get; set; }
    public string Season { get; set; } = string.Empty;
    public decimal Price { get; set; }

    // Soft delete - true means "hidden", the row still exists in the DB.
    public bool IsDeleted { get; set; }
}
