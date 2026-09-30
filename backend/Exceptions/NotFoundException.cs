namespace Vehicles.Api.Exceptions;

// Thrown from a service when a requested id doesn't exist (or was soft-
// deleted, which query filters already treat as "doesn't exist"). The
// global exception handler catches this and turns it into a 404.
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message)
    {
    }
}
