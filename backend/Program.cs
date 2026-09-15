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

var vehicles = new List<Vehicle>
{
    new Vehicle(1, "Volkswagen", "Polo", 2020),
    new Vehicle(2, "Audi", "A4", 2019),
    new Vehicle(3, "Seat", "Ibiza", 2021)
};

app.MapGet("/api/vehicles", () =>
{
    return vehicles;
});

app.MapGet("/api/shirts", () =>
{
    var shirts = new List<Shirts>
    {
        new Shirts(1, "Nike", 42),
        new Shirts(2, "Adidas", 40),
        new Shirts(3, "Puma", 44)
    };

    return shirts;
});

app.MapGet("/api/tyres", () =>
{
    var tyres = new List<Tyres>
    {
        new Tyres(1, "Michelin", 16),
        new Tyres(2, "Bridgestone", 17),
        new Tyres(3, "Goodyear", 18)
    };

    return tyres;
});

app.Run();

record Vehicle(int Id, string Brand, string Model, int Year);
record Shirts(int Id, string Brand, int Size);
record Tyres(int Id, string Brand, int Size);