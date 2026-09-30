using Microsoft.EntityFrameworkCore;
using Vehicles.Api.Data;
using Vehicles.Api.ErrorHandling;
using Vehicles.Api.Services;

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

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("VehiclesDb")));

// One instance per request (matches AppDbContext's own lifetime) - each
// service just wraps DB calls, so there's no reason to keep it around
// longer than that.
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<ITyreService, TyreService>();

// GlobalExceptionHandler is what actually converts an exception into a
// response; AddProblemDetails() makes the built-in 400 (validation) and
// 404/500 (ours) responses share the same JSON shape.
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseCors("FrontendPolicy");

// Needs to run before anything that might throw - i.e. as early in the
// pipeline as possible.
app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
