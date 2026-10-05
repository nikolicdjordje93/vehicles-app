using System.ComponentModel.DataAnnotations;

namespace Vehicles.Api.Models;

public record LoginRequest(
    [Required(ErrorMessage = "Email is required.")] string Email,
    [Required(ErrorMessage = "Password is required.")] string Password);
