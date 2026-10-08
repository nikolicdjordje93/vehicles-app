using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Vehicles.Api.Exceptions;

namespace Vehicles.Api.ErrorHandling;

// Single place that turns ANY exception escaping a controller action into
// an HTTP response. Services throw plain C# exceptions (NotFoundException,
// ConflictException, ...) instead of returning ActionResult themselves -
// this is what catches those, so controllers don't need a try/catch in
// every single method.
//
// Registered once in Program.cs via AddExceptionHandler<GlobalExceptionHandler>()
// + app.UseExceptionHandler().
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        // Klijent je sam prekinuo zahtev (zatvorio tab, otišao na drugu
        // stranicu), pa je CancellationToken otkazao upit. To nije bag: ne
        // logujemo ga kao grešku i ne pišemo odgovor, jer nema ko da ga primi.
        // 499 = "Client Closed Request", ustaljen kod za baš ovu situaciju.
        if (exception is OperationCanceledException && httpContext.RequestAborted.IsCancellationRequested)
        {
            httpContext.Response.StatusCode = StatusCodes.Status499ClientClosedRequest;
            return true;
        }

        // Add a new case here whenever a new exception type needs its own
        // status code - everything not listed falls through to 500.
        var (statusCode, title) = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            ConflictException => (StatusCodes.Status409Conflict, exception.Message),
            UnauthorizedException => (StatusCodes.Status401Unauthorized, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "Something went wrong. Please try again later.")
        };

        // Only the unexpected (500) case gets logged with its full details -
        // NotFoundException/ConflictException are normal, expected outcomes,
        // not bugs, so they'd just be noise in the server log.
        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception while processing {Method} {Path}",
                httpContext.Request.Method, httpContext.Request.Path);
        }

        httpContext.Response.StatusCode = statusCode;

        await httpContext.Response.WriteAsJsonAsync(
            new ProblemDetails { Status = statusCode, Title = title },
            cancellationToken);

        // true = "handled, don't rethrow" - false would let ASP.NET's
        // default (much less friendly) error page take over instead.
        return true;
    }
}
