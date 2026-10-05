using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vehicles.Api.Services;

namespace Vehicles.Api.Controllers;

// Thin on purpose - same reasoning as TyresController. Read-only: there's
// no POST/PUT/DELETE here, since new equipment is added straight into the
// database, not through the app. [Authorize] - samo ulogovan korisnik
// (bilo koje role) sme da pogleda listu.
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class EquipmentController : ControllerBase
{
    private readonly IEquipmentService _equipmentService;

    public EquipmentController(IEquipmentService equipmentService)
    {
        _equipmentService = equipmentService;
    }

    // GET /api/equipment
    [HttpGet]
    public async Task<ActionResult> Get()
    {
        return Ok(await _equipmentService.GetAsync());
    }
}
