using System;
using System.Collections.Generic;

namespace PruebaTecnica.Models;

public partial class DetallesSolicitud
{
    public int Id { get; set; }

    public int SolicitudId { get; set; }

    public int RolId { get; set; }

    public int CantidadPuestos { get; set; }

    public virtual Role Rol { get; set; } = null!;

    public virtual SolicitudesEquipamiento Solicitud { get; set; } = null!;
}
