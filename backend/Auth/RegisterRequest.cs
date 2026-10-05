using System.ComponentModel.DataAnnotations;

namespace Vehicles.Api.Models;

// Šta POST /api/auth/register prima. Password je plain tekst OVDE (stiže
// preko HTTPS-a sa fronta) - heširamo ga tek u AuthService, nikad ga ne
// upisujemo u bazu u ovom obliku.
public record RegisterRequest(
    [Required(ErrorMessage = "Email is required."), EmailAddress(ErrorMessage = "Invalid email format.")] string Email,
    [Required(ErrorMessage = "Password is required.")] string Password,
    Role Role);
