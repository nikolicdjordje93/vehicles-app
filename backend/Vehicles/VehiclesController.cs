using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vehicles.Api.Data;
using Vehicles.Api.Models;

namespace Vehicles.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly AppDbContext _db;

    public VehiclesController(AppDbContext db)
    {
        _db = db;
    }

    // [FromQuery] tells ASP.NET to read this parameter from the URL's query
    // string (?isNew=true), not from the route or the request body.
    // GET /api/vehicles?isNew=true  -> new vehicles
    // GET /api/vehicles?isNew=false -> used vehicles
    //
    // Now that New and Used share one VehicleResponse shape, there's no
    // longer a need to branch into two separate Select() projections - the
    // isNew flag only affects the Where() filter.
    [HttpGet]
    public async Task<ActionResult> Get([FromQuery] bool isNew)
    {
        // OrderBy is how we control display order - not by relying on the
        // physical order rows happen to be stored in. Grouping by Brand
        // (then Model, so it's stable within the same brand) means a newly
        // inserted row lands next to its brand-mates instead of at the end.
        var vehicles = await _db.Vehicles
            .Where(v => v.IsNew == isNew)
            .OrderBy(v => v.Brand)
            .ThenBy(v => v.Model)
            .Select(v => new VehicleResponse(v.Id, v.IsNew, v.Brand, v.Model, v.Year, v.BodyType, v.Color, v.Engine, v.Price))
            .ToListAsync();

        return Ok(vehicles);
    }

    [HttpGet("options")]
    public async Task<ActionResult<VehicleOptions>> GetOptions()
    {
        var vehicles = await _db.Vehicles
            .Select(v => new { v.Brand, v.Model, v.BodyType, v.Engine, v.Year })
            .ToListAsync();

        var brands = vehicles
            .Select(v => v.Brand)
            .Distinct()
            .OrderBy(b => b)
            .ToList();

        // GroupBy(v => v.Brand) buckets the rows by brand, then for each
        // bucket we pull out just the distinct model names - this is how
        // we know "which models belong to which brand" for the dependent
        // (cascading) suggestion list on the frontend.
        var modelsByBrand = vehicles
            .GroupBy(v => v.Brand)
            .ToDictionary(
                group => group.Key,
                group => group.Select(v => v.Model).Distinct().OrderBy(m => m).ToList());

        var bodyTypes = vehicles
            .Select(v => v.BodyType)
            .Distinct()
            .OrderBy(b => b)
            .ToList();

        var engines = vehicles
            .Select(v => v.Engine)
            .Distinct()
            .OrderBy(e => e)
            .ToList();

        var years = vehicles
            .Select(v => v.Year)
            .Distinct()
            .OrderByDescending(y => y)
            .ToList();

        return Ok(new VehicleOptions(brands, modelsByBrand, bodyTypes, engines, years));
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] CreateVehicleRequest request)
    {
        var vehicle = new Vehicle
        {
            IsNew = request.IsNew,
            Brand = request.Brand,
            Model = request.Model,
            BodyType = request.BodyType,
            Color = request.Color,
            Engine = request.Engine,
            Year = request.Year,
            Price = request.Price
        };

        _db.Vehicles.Add(vehicle);
        await _db.SaveChangesAsync();

        var response = new VehicleResponse(vehicle.Id, vehicle.IsNew, vehicle.Brand, vehicle.Model, vehicle.Year, vehicle.BodyType, vehicle.Color, vehicle.Engine, vehicle.Price);

        return StatusCode(201, response);
    }
}
