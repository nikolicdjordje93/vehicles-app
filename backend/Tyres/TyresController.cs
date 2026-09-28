using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vehicles.Api.Data;
using Vehicles.Api.Models;

namespace Vehicles.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TyresController : ControllerBase
{
    private readonly AppDbContext _db;

    public TyresController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/tyres - now reads from Postgres via AppDbContext instead of
    // the old hardcoded in-memory list, the same migration Vehicles went
    // through earlier.
    [HttpGet]
    public async Task<ActionResult> Get()
    {
        var tyres = await _db.Tyres
            .OrderBy(t => t.Brand)
            .Select(t => new TyreResponse(t.Id, t.Brand, t.SizeInches, t.Season, t.Price))
            .ToListAsync();

        return Ok(tyres);
    }

    // GET /api/tyres/options - same idea as VehiclesController.GetOptions.
    [HttpGet("options")]
    public async Task<ActionResult<TyreOptions>> GetOptions()
    {
        var tyres = await _db.Tyres
            .Select(t => new { t.Brand, t.SizeInches, t.Season })
            .ToListAsync();

        var brands = tyres.Select(t => t.Brand).Distinct().OrderBy(b => b).ToList();
        var sizes = tyres.Select(t => t.SizeInches).Distinct().OrderBy(s => s).ToList();
        var seasons = tyres.Select(t => t.Season).Distinct().OrderBy(s => s).ToList();

        return Ok(new TyreOptions(brands, sizes, seasons));
    }

    // POST /api/tyres - Create, same shape as VehiclesController.Post.
    [HttpPost]
    public async Task<ActionResult> Post([FromBody] CreateTyreRequest request)
    {
        var tyre = new Tyre
        {
            Brand = request.Brand,
            SizeInches = request.SizeInches,
            Season = request.Season,
            Price = request.Price
        };

        _db.Tyres.Add(tyre);
        await _db.SaveChangesAsync();

        var response = new TyreResponse(tyre.Id, tyre.Brand, tyre.SizeInches, tyre.Season, tyre.Price);
        return StatusCode(201, response);
    }

    // PUT /api/tyres/5 - Update.
    [HttpPut("{id}")]
    public async Task<ActionResult> Put(int id, [FromBody] CreateTyreRequest request)
    {
        var tyre = await _db.Tyres.FindAsync(id);
        if (tyre is null)
        {
            return NotFound();
        }

        tyre.Brand = request.Brand;
        tyre.SizeInches = request.SizeInches;
        tyre.Season = request.Season;
        tyre.Price = request.Price;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    // DELETE /api/tyres/5 - soft delete, same as VehiclesController.
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        var tyre = await _db.Tyres.FindAsync(id);
        if (tyre is null)
        {
            return NotFound();
        }

        tyre.IsDeleted = true;
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
