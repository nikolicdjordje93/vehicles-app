using Microsoft.EntityFrameworkCore;
using Vehicles.Api.Data;
using Vehicles.Api.Exceptions;
using Vehicles.Api.Models;

namespace Vehicles.Api.Services;

// All the logic that used to live directly in VehiclesController - moved
// here so the controller can stay a thin HTTP layer (parse the request,
// call this, return a status code) and this class can focus purely on
// "what does adding/editing/deleting a vehicle actually mean".
public class VehicleService : IVehicleService
{
    private readonly AppDbContext _db;

    public VehicleService(AppDbContext db)
    {
        _db = db;
    }

    // OrderBy is how we control display order - not by relying on the
    // physical order rows happen to be stored in. Grouping by Brand
    // (then Model, so it's stable within the same brand) means a newly
    // inserted row lands next to its brand-mates instead of at the end.
    public async Task<List<VehicleResponse>> GetAsync(bool isNew)
    {
        return await _db.Vehicles
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
    }

    // Powers the autocomplete suggestions on the "Add vehicle" form.
    //
    // We pull the (small) set of vehicle rows into memory first with
    // ToListAsync(), then do the Distinct()/GroupBy() work as plain C#
    // (LINQ to Objects) rather than asking Postgres to do it. With only a
    // few dozen rows that's simpler to read and reason about; a table with
    // millions of rows would instead want this pushed down into SQL.
    public async Task<VehicleOptions> GetOptionsAsync()
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

        return new VehicleOptions(brands, modelsByBrand, bodyTypes, colors, engines, years, tyres);
    }

    public async Task<VehicleResponse> CreateAsync(CreateVehicleRequest request)
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
        // straight from the database. vehicle.Id is only populated *after*
        // SaveChangesAsync() runs. Tyre details are left null here - this
        // response isn't read by the frontend (it just triggers a refetch
        // of GetAsync() above, which does the join), so it's not worth
        // another query.
        return new VehicleResponse(vehicle.Id, vehicle.IsNew, vehicle.Brand, vehicle.Model, vehicle.Year,
            vehicle.BodyType, vehicle.Color, vehicle.Engine, vehicle.Price, vehicle.TyreId, vehicle.TyreQuantity,
            null, null, null);
    }

    public async Task UpdateAsync(int id, CreateVehicleRequest request)
    {
        var vehicle = await _db.Vehicles.FindAsync(id);
        if (vehicle is null)
        {
            throw new NotFoundException($"Vehicle with id {id} was not found.");
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
    }

    // Soft delete - we don't remove the row, just flag it. FindAsync
    // already respects the HasQueryFilter on Vehicle, so an already-
    // deleted (or nonexistent) id comes back null either way.
    public async Task DeleteAsync(int id)
    {
        var vehicle = await _db.Vehicles.FindAsync(id);
        if (vehicle is null)
        {
            throw new NotFoundException($"Vehicle with id {id} was not found.");
        }

        vehicle.IsDeleted = true;
        await _db.SaveChangesAsync();
    }
}
