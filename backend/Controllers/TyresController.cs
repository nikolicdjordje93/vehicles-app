using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vehicles.Api.Models;
using Vehicles.Api.Services;

namespace Vehicles.Api.Controllers;

// Thin on purpose - see the comment at the top of VehiclesController for
// why there's no try/catch here. [Authorize] ovde - isti obrazac kao na
// VehiclesController (Delete ispod dodatno zahteva Admin rolu).
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TyresController : ControllerBase
{
    private readonly ITyreService _tyreService;

    public TyresController(ITyreService tyreService)
    {
        _tyreService = tyreService;
    }

    // GET /api/tyres
    [HttpGet]
    public async Task<ActionResult> Get()
    {
        return Ok(await _tyreService.GetAsync());
    }

    // GET /api/tyres/options - same idea as VehiclesController.GetOptions.
    [HttpGet("options")]
    public async Task<ActionResult<TyreOptions>> GetOptions()
    {
        return Ok(await _tyreService.GetOptionsAsync());
    }

    // POST /api/tyres - Create, same shape as VehiclesController.Post.
    [HttpPost]
    public async Task<ActionResult> Post([FromBody] CreateTyreRequest request)
    {
        var response = await _tyreService.CreateAsync(request);
        return StatusCode(201, response);
    }

    // PUT /api/tyres/5 - Update.
    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int id, [FromBody] CreateTyreRequest request)
    {
        await _tyreService.UpdateAsync(id, request);
        return NoContent();
    }

    // DELETE /api/tyres/5 - soft delete, refused (409, via ConflictException)
    // if a vehicle still has this tyre attached. Admin-only.
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _tyreService.DeleteAsync(id);
        return NoContent();
    }
}
