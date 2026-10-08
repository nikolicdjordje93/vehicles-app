namespace Vehicles.Api.Services;

// Ključevi pod kojima stvari stoje u IMemoryCache. Na jednom mestu, jer isti
// ključ koriste i VehicleService (čita/puni keš) i TyreService (briše ga) -
// da se ne bi desilo da jedan piše "vehicle-options", a drugi "vehicleOptions".
public static class CacheKeys
{
    public const string VehicleOptions = "vehicle-options";
}
