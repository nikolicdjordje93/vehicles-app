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
    public DbSet<BodyType> BodyTypes => Set<BodyType>();
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<VehicleEquipment> VehicleEquipment => Set<VehicleEquipment>();
    public DbSet<Korisnik> Korisnici => Set<Korisnik>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.Tyre)
            .WithMany()
            .HasForeignKey(v => v.TyreId)
            .OnDelete(DeleteBehavior.SetNull);

        // Restrict (not SetNull like Tyre above) - BodyTypeId is required,
        // so a vehicle can never be left without one. This also blocks
        // deleting a BodyType row while any vehicle still references it.
        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.BodyType)
            .WithMany()
            .HasForeignKey(v => v.BodyTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Composite primary key - the (VehicleId, EquipmentId) pair itself
        // is the identity of a row, so there's no separate Id to configure.
        modelBuilder.Entity<VehicleEquipment>()
            .HasKey(ve => new { ve.VehicleId, ve.EquipmentId });

        modelBuilder.Entity<VehicleEquipment>()
            .HasOne(ve => ve.Vehicle)
            .WithMany(v => v.VehicleEquipment)
            .HasForeignKey(ve => ve.VehicleId);

        modelBuilder.Entity<VehicleEquipment>()
            .HasOne(ve => ve.Equipment)
            .WithMany()
            .HasForeignKey(ve => ve.EquipmentId);

        // Auto-applies !IsDeleted to every query against these DbSets.
        modelBuilder.Entity<Vehicle>().HasQueryFilter(v => !v.IsDeleted);
        modelBuilder.Entity<Tyre>().HasQueryFilter(t => !t.IsDeleted);

        // Bez ovoga, EF Core bi Role (enum) čuvao kao integer (0, 1...) -
        // sa HasConversion<string>() se u bazi vidi čitljivo "Admin"/
        // "Operater", lakše za proveru direktno kroz SQL.
        modelBuilder.Entity<Korisnik>().Property(k => k.Role).HasConversion<string>();

        // Dva korisnika ne smeju imati isti email - jedinstven indeks na
        // nivou baze, ne samo provera u kodu (isti princip kao composite
        // key na VehicleEquipment - baza sama odbija duplikat).
        modelBuilder.Entity<Korisnik>().HasIndex(k => k.Email).IsUnique();
    }
}
