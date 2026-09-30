using Microsoft.AspNetCore.Mvc;
using Vehicles.Api.Models;
using Vehicles.Api.Services;

namespace Vehicles.Api.Controllers;

// Thin on purpose - every method just calls IVehicleService and translates
// its result into an HTTP response. All the actual logic (including the
// "throw if not found" rules) lives in VehicleService; if it throws, the
// GlobalExceptionHandler catches it and picks the right status code - so
// no try/catch is needed here.
[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    // [FromQuery] tells ASP.NET to read this parameter from the URL's query
    // string (?isNew=true), not from the route or the request body.
    // GET /api/vehicles?isNew=true  -> new vehicles
    // GET /api/vehicles?isNew=false -> used vehicles
    [HttpGet]
    public async Task<ActionResult> Get([FromQuery] bool isNew)
    {
        return Ok(await _vehicleService.GetAsync(isNew));
    }

    // GET /api/vehicles/options
    // [HttpGet("options")] adds "options" as a literal segment after
    // api/vehicles, so this doesn't collide with the plain
    // GET /api/vehicles?isNew=... above - ASP.NET tells them apart by the
    // route template, not just the HTTP verb.
    [HttpGet("options")]
    public async Task<ActionResult<VehicleOptions>> GetOptions()
    {
        return Ok(await _vehicleService.GetOptionsAsync());
    }

    // POST /api/vehicles - Create. [FromBody] tells ASP.NET to read the
    // request's JSON body and deserialize it into a CreateVehicleRequest.
    // If that request fails a Data Annotation (e.g. missing Brand,
    // negative Price), [ApiController] rejects it with a 400 automatically,
    // before this method even runs.
    [HttpPost]
    public async Task<ActionResult> Post([FromBody] CreateVehicleRequest request)
    {
        var response = await _vehicleService.CreateAsync(request);

        // 201 Created is the conventional HTTP status for "a new resource
        // now exists" - different from 200 OK, which just means "the
        // request succeeded" without implying anything new was made.
        return StatusCode(201, response);
    }

    // PUT /api/vehicles/5 - Update. Reuses CreateVehicleRequest since the
    // shape is identical to what Create needs; the id comes from the route.
    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int id, [FromBody] CreateVehicleRequest request)
    {
        await _vehicleService.UpdateAsync(id, request);
        return NoContent();
    }

    // DELETE /api/vehicles/5 - Soft delete.
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        await _vehicleService.DeleteAsync(id);
        return NoContent();
    }
}
