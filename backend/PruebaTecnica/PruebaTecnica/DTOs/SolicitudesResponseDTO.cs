namespace PruebaTecnica.DTOs
{
    public class SolicitudCreateDTO
    {
        public string NombreSolicitud { get; set; } = null!;
        public List<RolCantidadDTO> RolesSolicitados { get; set; } = new();
    }

    public class RolCantidadDTO
    {
        public int RolId { get; set; }
        public int Cantidad { get; set; }
    }

    public class SolicitudResponseDTO
    {
        public int Id { get; set; }
        public string NombreSolicitud { get; set; } = null!;
        public string Estado { get; set; } = null!;
        public DateTime Fecha { get; set; }
        public string CreadoPor { get; set; } = null!;
        public List<RolCantidadDTO> RolesSolicitados { get; set; } = new();
    }
}
