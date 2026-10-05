namespace Vehicles.Api.Models;

// DTO za odgovor na register - namerno BEZ PasswordHash polja, taj
// podatak nikad ne sme da stigne do fronta, čak ni heširan.
public record RegisterResponse(int Id, string Email, Role Role);
