using System;
using System.Collections.Generic;

namespace PruebaTecnica.Models;

public partial class Role
{
    public int Id { get; set; }

    public string NombreRol { get; set; } = null!;

    public virtual ICollection<DetallesSolicitud> DetallesSolicituds { get; set; } = new List<DetallesSolicitud>();

    public virtual ICollection<Empleado> Empleados { get; set; } = new List<Empleado>();

    public virtual ICollection<PerfilesRequerimiento> PerfilesRequerimientos { get; set; } = new List<PerfilesRequerimiento>();
}
