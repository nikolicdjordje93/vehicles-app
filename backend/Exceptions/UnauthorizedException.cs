namespace Vehicles.Api.Exceptions;

// Thrown from AuthService when email/password at login don't match. The
// global exception handler turns this into 401. Same message is used for
// both "email doesn't exist" and "wrong password" - we never reveal to
// the caller which one of the two was actually the problem.
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message)
    {
    }
}
