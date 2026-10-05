namespace Vehicles.Api.Models;

// Ko sme da se uloguje u aplikaciju. PasswordHash - nikad sama lozinka u
// čitljivom obliku, samo njena heširana (jednosmerno transformisana)
// vrednost (vidi IPasswordHasher<Korisnik> kad stignemo do register/login).
public class Korisnik
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public Role Role { get; set; }
}
