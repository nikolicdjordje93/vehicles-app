using Microsoft.EntityFrameworkCore;
using Vehicles.Api.Models;

namespace Vehicles.Api.Data;

// One DbContext for the whole application's database - not one per entity
// or per controller. As we add more tables later (e.g. Tyres), they get
// their own DbSet<T> property right here, not a separate DbContext class.
//
// This used to also have an OnModelCreating override with HasData() seed
// data for the first 30 vehicles. That seed data already did its one-time
// job - the rows it described were generated into the InitialCreate
// migration and applied to Postgres a while ago, so they exist permanently
// in the database now, independent of this C# code. Since new vehicles
// are added through the app itself (POST /api/vehicles) rather than
// through migrations from here on, there's no need to keep declaring that
// seed data as part of the model.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
}
