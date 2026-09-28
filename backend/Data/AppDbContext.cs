using Microsoft.EntityFrameworkCore;
using Vehicles.Api.Models;

namespace Vehicles.Api.Data;

// Shared DbContext for the whole app - one DbSet<T> per table.
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Vehicle> Vehicles => Set<Vehicle>();
    public DbSet<Tyre> Tyres => Set<Tyre>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.Tyre)
            .WithMany()
            .HasForeignKey(v => v.TyreId)
            .OnDelete(DeleteBehavior.SetNull);

        // Auto-applies !IsDeleted to every query against these DbSets.
        modelBuilder.Entity<Vehicle>().HasQueryFilter(v => !v.IsDeleted);
        modelBuilder.Entity<Tyre>().HasQueryFilter(t => !t.IsDeleted);
    }
}
