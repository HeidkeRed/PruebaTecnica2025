namespace PruebaTecnica.Services
{
    public interface IJwtService
    {
        string GenerateToken(string email, int empleadoId, int rolId);
    }
}
