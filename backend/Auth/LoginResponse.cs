namespace Vehicles.Api.Models;

// Token - JWT koji front čuva i šalje uz svaki sledeći zahtev (u
// Authorization headeru). Id/Email/Role su tu kao zgodan "usput" podatak -
// front bi inače morao da sam dekodira JWT samo da bi znao ko je ulogovan.
public record LoginResponse(string Token, int Id, string Email, Role Role);
