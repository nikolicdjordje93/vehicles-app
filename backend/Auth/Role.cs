namespace Vehicles.Api.Models;

// Fiksan, mali skup rola - enum, ne šifarnik u bazi (za razliku od
// BodyType-a). Dodavanje nove role (npr. "SuperAdmin") realno nije samo
// podatak - zahteva i novi kod koji zna šta ta rola sme/ne sme da radi,
// pa ionako ide uz redeploy. Baš taj slučaj gde enum ima više smisla.
public enum Role
{
    Admin,
    Operater
}
