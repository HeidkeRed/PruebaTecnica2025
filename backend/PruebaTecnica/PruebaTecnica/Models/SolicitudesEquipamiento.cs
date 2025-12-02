using System;
using System.Collections.Generic;

namespace PruebaTecnica.Models;

public partial class SolicitudesEquipamiento
{
    public int Id { get; set; }

    public string NombreSolicitud { get; set; } = null!;

    public DateTime Fecha { get; set; }

    public string Estado { get; set; } = null!;

    public int CreadoPor { get; set; }

    public virtual Empleado CreadoPorNavigation { get; set; } = null!;

    public virtual ICollection<DetallesSolicitud> DetallesSolicituds { get; set; } = new List<DetallesSolicitud>();
}
