using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using Vehicles.Api.Data;
using Vehicles.Api.ErrorHandling;
using Vehicles.Api.Models;
using Vehicles.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Bez ovoga bi Role (enum) putovao kroz JSON kao broj (0, 1...) - sa
// JsonStringEnumConverter se u request/response telu vidi "Admin"/
// "Operater", isto kao što smo već uradili za kolonu u bazi.
builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("VehiclesDb")));

// JWT Bearer - ovo je ono što PROVERAVA token na dolaznim zahtevima
// (potpis, isticanje, issuer, audience), za razliku od AuthService koji
// SAMO generiše token pri loginu. Isti Jwt:Key mora da se poklopi sa onim
// kojim je token potpisan, inače se nijedan token neće prihvatiti.
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
        };
    });

builder.Services.AddAuthorization();

// One instance per request (matches AppDbContext's own lifetime) - each
// service just wraps DB calls, so there's no reason to keep it around
// longer than that.
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<ITyreService, TyreService>();
builder.Services.AddScoped<IEquipmentService, EquipmentService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// PasswordHasher<Korisnik> - iz Microsoft.Extensions.Identity.Core paketa
// (dodaj ga sa `dotnet add package Microsoft.Extensions.Identity.Core`
// ako već nije u projektu). Hešira/proverava lozinke, ništa više - ne
// povlači celu ASP.NET Identity infrastrukturu (bez login cookie-ja i sl).
builder.Services.AddScoped<IPasswordHasher<Korisnik>, PasswordHasher<Korisnik>>();

// GlobalExceptionHandler is what actually converts an exception into a
// response; AddProblemDetails() makes the built-in 400 (validation) and
// 404/500 (ours) responses share the same JSON shape.
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseCors("FrontendPolicy");

// Needs to run before anything that might throw - i.e. as early in the
// pipeline as possible.
app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// UseAuthentication mora da bude PRE UseAuthorization - prvo se utvrdi KO
// je pozivalac (iz tokena), tek onda se proveri da li SME ono što traži.
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
