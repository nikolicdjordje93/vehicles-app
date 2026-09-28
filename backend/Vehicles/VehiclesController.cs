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
            // Referencing v.Tyre.X here is enough for EF Core to generate
            // the join itself - no .Include() needed since we're
            // projecting specific columns, not loading whole entities.
            .Select(v => new VehicleResponse(
                v.Id, v.IsNew, v.Brand, v.Model, v.Year, v.BodyType, v.Color, v.Engine, v.Price,
                v.TyreId, v.TyreQuantity,
                v.Tyre == null ? null : v.Tyre.Brand,
                v.Tyre == null ? (int?)null : v.Tyre.SizeInches,
                v.Tyre == null ? null : v.Tyre.Season))
            .ToListAsync();

        return Ok(vehicles);
    }

    // GET /api/vehicles/options
    // Powers the autocomplete suggestions on the "Add vehicle" form. Note
    // the route: [HttpGet("options")] adds "options" as a literal segment
    // after api/vehicles, so this doesn't collide with the plain
    // GET /api/vehicles?isNew=... above - ASP.NET tells them apart by the
    // route template, not just the HTTP verb.
    //
    // We pull the (small) set of vehicle rows into memory first with
    // ToListAsync(), then do the Distinct()/GroupBy() work as plain C#
    // (LINQ to Objects) rather than asking Postgres to do it. With only a
    // few dozen rows that's simpler to read and reason about; a table with
    // millions of rows would instead want this pushed down into SQL.
    [HttpGet("options")]
    public async Task<ActionResult<VehicleOptions>> GetOptions()
    {
        var vehicles = await _db.Vehicles
            .Select(v => new { v.Brand, v.Model, v.BodyType, v.Color, v.Engine, v.Year })
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

        var colors = vehicles
            .Select(v => v.Color)
            .Distinct()
            .OrderBy(c => c)
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

        // Separate table, not derived from the vehicles above - this is
        // the real list of tyres a vehicle can be attached to.
        var tyres = await _db.Tyres
            .OrderBy(t => t.Brand)
            .Select(t => new TyreResponse(t.Id, t.Brand, t.SizeInches, t.Season, t.Price))
            .ToListAsync();

        return Ok(new VehicleOptions(brands, modelsByBrand, bodyTypes, colors, engines, years, tyres));
    }

    // POST /api/vehicles
    // This is the Create operation. [FromBody] tells ASP.NET to read the
    // request's JSON body and deserialize it into a CreateVehicleRequest -
    // the natural way to send a whole object, as opposed to [FromQuery]
    // which only works for a handful of simple values in the URL.
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
            Price = request.Price,
            TyreId = request.TyreId,
            TyreQuantity = request.TyreQuantity
        };

        // Add() only stages the new row in EF Core's in-memory change
        // tracker. Nothing touches Postgres until SaveChangesAsync() runs -
        // that's the line that actually executes the INSERT.
        _db.Vehicles.Add(vehicle);
        await _db.SaveChangesAsync();

        // We map back to VehicleResponse instead of returning the entity
        // straight from the database - the same rule applies to what we
        // hand back after a write as to what we hand back after a read.
        // vehicle.Id is only populated *after* SaveChangesAsync() runs,
        // since that's the point where Postgres actually assigns it.
        // Tyre details are left null here - this response isn't read by
        // the frontend (it just triggers a refetch of the Get() list
        // above, which does the join), so it's not worth another query.
        var response = new VehicleResponse(vehicle.Id, vehicle.IsNew, vehicle.Brand, vehicle.Model, vehicle.Year, vehicle.BodyType, vehicle.Color, vehicle.Engine, vehicle.Price, vehicle.TyreId, vehicle.TyreQuantity, null, null, null);

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
        var vehicle = await _db.Vehicles.FindAsync(id);
        if (vehicle is null)
        {
            return NotFound();
        }

        vehicle.IsNew = request.IsNew;
        vehicle.Brand = request.Brand;
        vehicle.Model = request.Model;
        vehicle.BodyType = request.BodyType;
        vehicle.Color = request.Color;
        vehicle.Engine = request.Engine;
        vehicle.Year = request.Year;
        vehicle.Price = request.Price;
        vehicle.TyreId = request.TyreId;
        vehicle.TyreQuantity = request.TyreQuantity;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // DELETE /api/vehicles/5
    // Soft delete - we don't remove the row, just flag it. FindAsync
    // already respects the HasQueryFilter on Vehicle, so an already-
    // deleted (or nonexistent) id comes back null either way.
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var vehicle = await _db.Vehicles.FindAsync(id);
        if (vehicle is null)
        {
            return NotFound();
        }

        vehicle.IsDeleted = true;
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
