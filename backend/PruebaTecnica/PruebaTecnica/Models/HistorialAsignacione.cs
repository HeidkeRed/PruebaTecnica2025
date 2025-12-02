using System;
using System.Collections.Generic;

namespace PruebaTecnica.Models;

public partial class HistorialAsignacione
{
    public int Id { get; set; }

    public int EquipoId { get; set; }

    public int? EmpleadoId { get; set; }

    public string Accion { get; set; } = null!;

    public DateTime Fecha { get; set; }

    public int Responsable { get; set; }

    public virtual Empleado? Empleado { get; set; }

    public virtual Equipo Equipo { get; set; } = null!;

    public virtual Empleado ResponsableNavigation { get; set; } = null!;
}
