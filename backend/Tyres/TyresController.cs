using Microsoft.AspNetCore.Mvc;
using Vehicles.Api.Models;

namespace Vehicles.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TyresController : ControllerBase
{
    private static readonly List<Tyres> Data = new()
    {
        new Tyres(1, "Michelin", 16, "Summer", 85m),
        new Tyres(2, "Bridgestone", 17, "Winter", 95m),
        new Tyres(3, "Goodyear", 18, "All-season", 105m),
        new Tyres(4, "Continental", 16, "Summer", 80m),
        new Tyres(5, "Pirelli", 17, "Winter", 98m),
        new Tyres(6, "Dunlop", 18, "All-season", 100m),
        new Tyres(7, "Hankook", 15, "Summer", 65m),
        new Tyres(8, "Yokohama", 16, "Winter", 78m),
        new Tyres(9, "Kumho", 17, "All-season", 82m),
        new Tyres(10, "Michelin", 18, "Winter", 115m),
        new Tyres(11, "Continental", 17, "All-season", 92m),
        new Tyres(12, "Bridgestone", 15, "Summer", 70m),
        new Tyres(13, "Pirelli", 18, "Summer", 108m),
        new Tyres(14, "Goodyear", 16, "Winter", 88m),
        new Tyres(15, "Hankook", 17, "All-season", 90m)
    };

    [HttpGet]
    public ActionResult<List<Tyres>> Get()
    {
        return Data;
    }
}
