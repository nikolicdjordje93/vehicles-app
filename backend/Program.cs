var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors("FrontendPolicy");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var newVehicles = new List<NewVehicle>
{
    new NewVehicle(1, "Volkswagen", "Polo", "Hatchback", "White", "1.0 TSI", 18500m),
    new NewVehicle(2, "Volkswagen", "Golf", "Hatchback", "Black", "1.5 TSI", 24500m),
    new NewVehicle(3, "Volkswagen", "Tiguan", "SUV", "Grey", "2.0 TDI", 34500m),
    new NewVehicle(4, "Volkswagen", "Passat", "Sedan", "Blue", "2.0 TDI", 33500m),
    new NewVehicle(5, "Audi", "A3", "Hatchback", "Blue", "1.5 TFSI", 28000m),
    new NewVehicle(6, "Audi", "A4", "Sedan", "Black", "2.0 TDI", 42000m),
    new NewVehicle(7, "Audi", "A6", "Sedan", "Grey", "2.0 TDI", 55000m),
    new NewVehicle(8, "Audi", "Q3", "SUV", "White", "1.5 TFSI", 38000m),
    new NewVehicle(9, "Audi", "Q5", "SUV", "White", "2.0 TFSI", 52000m),
    new NewVehicle(10, "Seat", "Ibiza", "Hatchback", "Red", "1.0 MPI", 16500m),
    new NewVehicle(11, "Seat", "Leon", "Hatchback", "Silver", "1.5 TSI", 23000m),
    new NewVehicle(12, "Seat", "Arona", "SUV", "Orange", "1.0 TSI", 21000m),
    new NewVehicle(13, "Skoda", "Octavia", "Sedan", "Blue", "2.0 TDI", 27500m),
    new NewVehicle(14, "Skoda", "Fabia", "Hatchback", "White", "1.0 TSI", 17500m),
    new NewVehicle(15, "Skoda", "Kodiaq", "SUV", "Black", "2.0 TDI", 39500m)
};

app.MapGet("/api/newvehicles", () =>
{
    return newVehicles;
});

app.MapGet("/api/tyres", () =>
{
    var tyres = new List<Tyres>
    {
        new Tyres(1, "Michelin", 16, "Summer", 85m),
        new Tyres(2, "Bridgestone", 17, "Winter", 95m),
        new Tyres(3, "Goodyear", 18, "All-season", 105m),
        new Tyres(4, "Continental", 16, "Summer", 80m),
        new Tyres(5, "Pirelli", 17, "Winter", 98m),
        new Tyres(6, "Dunlop", 18, "All-season", 100m),
        new Tyres(7, "Hankook", 15, "Summer", 65m),
        new Tyres(8, "Yokohama", 16, "Winter", 78m),
        new Tyres(9, "Kumho", 17, "All-season", 82m),
        new Tyres(10, "Michelin", 18, "Winter", 115m),
        new Tyres(11, "Continental", 17, "All-season", 92m),
        new Tyres(12, "Bridgestone", 15, "Summer", 70m),
        new Tyres(13, "Pirelli", 18, "Summer", 108m),
        new Tyres(14, "Goodyear", 16, "Winter", 88m),
        new Tyres(15, "Hankook", 17, "All-season", 90m)
    };

    return tyres;
});

app.MapGet("/api/usedvehicles", () =>
{
    var usedVehicles = new List<UsedVehicle>
    {
        new UsedVehicle(1, "Volkswagen", "Golf", 2015, "Hatchback", "Blue", "1.6 TDI", 8500m),
        new UsedVehicle(2, "Skoda", "Octavia", 2017, "Wagon", "Silver", "2.0 TDI", 9800m),
        new UsedVehicle(3, "Volkswagen", "Passat", 2016, "Sedan", "Black", "2.0 TDI", 10500m),
        new UsedVehicle(4, "Audi", "A4", 2014, "Sedan", "Grey", "2.0 TDI", 9200m),
        new UsedVehicle(5, "Seat", "Leon", 2013, "Hatchback", "Red", "1.6 TDI", 6500m),
        new UsedVehicle(6, "Volkswagen", "Polo", 2018, "Hatchback", "White", "1.0 TSI", 9700m),
        new UsedVehicle(7, "Skoda", "Fabia", 2016, "Hatchback", "Blue", "1.2 TSI", 6200m),
        new UsedVehicle(8, "Audi", "Q3", 2015, "SUV", "Black", "2.0 TDI", 13500m),
        new UsedVehicle(9, "Seat", "Ibiza", 2019, "Hatchback", "Yellow", "1.0 MPI", 8900m),
        new UsedVehicle(10, "Volkswagen", "Tiguan", 2017, "SUV", "Grey", "2.0 TDI", 15500m),
        new UsedVehicle(11, "Audi", "A3", 2016, "Hatchback", "Blue", "1.4 TFSI", 11500m),
        new UsedVehicle(12, "Skoda", "Superb", 2015, "Sedan", "Black", "2.0 TDI", 12500m),
        new UsedVehicle(13, "Seat", "Arona", 2020, "SUV", "Orange", "1.0 TSI", 14500m),
        new UsedVehicle(14, "Volkswagen", "Passat", 2013, "Wagon", "White", "1.6 TDI", 7200m),
        new UsedVehicle(15, "Audi", "A6", 2012, "Sedan", "Silver", "2.0 TDI", 8900m)
    };

    return usedVehicles;
});

app.Run();

record NewVehicle(int Id, string Brand, string Model, string BodyType, string Color, string Engine, decimal Price);
record Tyres(int Id, string Brand, int SizeInches, string Season, decimal Price);
record UsedVehicle(int Id, string Manufacturer, string Model, int Year, string BodyType, string Color, string Engine, decimal Price);
