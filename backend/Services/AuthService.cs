using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Vehicles.Api.Data;
using Vehicles.Api.Exceptions;
using Vehicles.Api.Models;

namespace Vehicles.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher<Korisnik> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext db, IPasswordHasher<Korisnik> passwordHasher, IConfiguration configuration)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        // Baza ima jedinstven indeks na Email (vidi AppDbContext), ali
        // proveravamo i ovde unapred - lepša poruka (409 sa jasnim
        // tekstom) nego da pustimo bazu da puca sa sirovom greškom.
        var emailExists = await _db.Korisnici.AnyAsync(k => k.Email == request.Email);
        if (emailExists)
        {
            throw new ConflictException("A user with this email already exists.");
        }

        var korisnik = new Korisnik
        {
            Email = request.Email,
            Role = request.Role
        };

        // HashPassword traži ceo Korisnik objekat kao prvi parametar (ne
        // samo lozinku) - zato prvo pravimo objekat (bez PasswordHash-a),
        // pa tek onda računamo heš i upisujemo ga.
        korisnik.PasswordHash = _passwordHasher.HashPassword(korisnik, request.Password);

        _db.Korisnici.Add(korisnik);
        await _db.SaveChangesAsync();

        return new RegisterResponse(korisnik.Id, korisnik.Email, korisnik.Role);
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var korisnik = await _db.Korisnici.FirstOrDefaultAsync(k => k.Email == request.Email);

        // Ista poruka za "email ne postoji" i "pogrešna lozinka" - ne
        // odajemo napadaču koji od ta dva razloga je stvarno u pitanju.
        if (korisnik is null)
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        var result = _passwordHasher.VerifyHashedPassword(korisnik, korisnik.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        var token = GenerateJwtToken(korisnik);

        return new LoginResponse(token, korisnik.Id, korisnik.Email, korisnik.Role);
    }

    private string GenerateJwtToken(Korisnik korisnik)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // ClaimTypes.Role (ne neki naš custom claim) - ovo je standardno
        // ime koje ASP.NET Core sam prepoznaje kad kasnije budemo pisali
        // [Authorize(Roles = "Admin")] na nekom endpointu.
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, korisnik.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, korisnik.Email),
            new Claim(ClaimTypes.Role, korisnik.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
