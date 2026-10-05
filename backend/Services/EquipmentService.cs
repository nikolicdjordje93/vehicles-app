using Microsoft.EntityFrameworkCore;
using Vehicles.Api.Data;
using Vehicles.Api.Models;

namespace Vehicles.Api.Services;

public class EquipmentService : IEquipmentService
{
    private readonly AppDbContext _db;

    public EquipmentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<EquipmentResponse>> GetAsync()
    {
        return await _db.Equipment
            .OrderBy(e => e.Name)
            .Select(e => new EquipmentResponse(e.Id, e.Name, e.Code))
            .ToListAsync();
    }
}
