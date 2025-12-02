namespace PruebaTecnica.DTOs
{
    public class EmpleadoRegisterDTO
    {
        public string NombreCompleto { get; set; } = null!;
        public int RolActualId { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
