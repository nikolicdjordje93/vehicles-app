namespace Vehicles.Api.Exceptions;

// Thrown from a service when the request is well-formed but conflicts with
// the current state of the data - e.g. deleting a tyre that's still
// attached to a vehicle. The global exception handler turns this into 409.
public class ConflictException : Exception
{
    public ConflictException(string message) : base(message)
    {
    }
}
