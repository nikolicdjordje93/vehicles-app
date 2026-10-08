using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Vehicles.Api.Data;
using Vehicles.Api.Exceptions;
using Vehicles.Api.Models;

namespace Vehicles.Api.Services;

public class TyreService : ITyreService
{
    private readonly AppDbContext _db;
    // Samo za brisanje keša - lista guma je deo VehicleOptions (dropdown
    // "Guma" u formi za vozilo), pa svaka promena gume mora da ga poništi.
    private readonly IMemoryCache _cache;

    public TyreService(AppDbContext db, IMemoryCache cache)
    {
        _db = db;
        _cache = cache;
    }

    // CancellationToken samo na čitanjima - isti razlog kao u VehicleService.
    public async Task<List<TyreResponse>> GetAsync(CancellationToken cancellationToken)
    {
        return await _db.Tyres
            .OrderBy(t => t.Brand)
            .Select(t => new TyreResponse(t.Id, t.Brand, t.SizeInches, t.Season, t.Price))
            .ToListAsync(cancellationToken);
    }

    public async Task<TyreOptions> GetOptionsAsync(CancellationToken cancellationToken)
    {
        var tyres = await _db.Tyres
            .Select(t => new { t.Brand, t.SizeInches, t.Season })
            .ToListAsync(cancellationToken);

        var brands = tyres.Select(t => t.Brand).Distinct().OrderBy(b => b).ToList();
        var sizes = tyres.Select(t => t.SizeInches).Distinct().OrderBy(s => s).ToList();
        var seasons = tyres.Select(t => t.Season).Distinct().OrderBy(s => s).ToList();

        return new TyreOptions(brands, sizes, seasons);
    }

    public async Task<TyreResponse> CreateAsync(CreateTyreRequest request)
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
        _cache.Remove(CacheKeys.VehicleOptions);

        return new TyreResponse(tyre.Id, tyre.Brand, tyre.SizeInches, tyre.Season, tyre.Price);
    }

    public async Task UpdateAsync(int id, CreateTyreRequest request)
    {
        var tyre = await _db.Tyres.FindAsync(id);
        if (tyre is null)
        {
            throw new NotFoundException($"Tyre with id {id} was not found.");
        }

        tyre.Brand = request.Brand;
        tyre.SizeInches = request.SizeInches;
        tyre.Season = request.Season;
        tyre.Price = request.Price;

        await _db.SaveChangesAsync();
        _cache.Remove(CacheKeys.VehicleOptions);
    }

    public async Task DeleteAsync(int id)
    {
        var tyre = await _db.Tyres.FindAsync(id);
        if (tyre is null)
        {
            throw new NotFoundException($"Tyre with id {id} was not found.");
        }

        // Refuse to delete a tyre that's still attached to a vehicle -
        // soft-deleting it would hide it from that vehicle (the query
        // filter excludes it), silently breaking the tyre-vehicle link
        // instead of actually removing it.
        var isAttachedToVehicle = await _db.Vehicles.AnyAsync(v => v.TyreId == id);
        if (isAttachedToVehicle)
        {
            throw new ConflictException("This tyre is attached to a vehicle and can't be deleted.");
        }

        tyre.IsDeleted = true;
        await _db.SaveChangesAsync();
        _cache.Remove(CacheKeys.VehicleOptions);
    }
}
