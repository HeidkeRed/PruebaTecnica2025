using System;
using System.Collections.Generic;

namespace PruebaTecnica.Models;

public partial class PerfilesRequerimiento
{
    public int Id { get; set; }

    public int RolId { get; set; }

    public string TipoEquipo { get; set; } = null!;

    public int CantidadRequerida { get; set; }

    public virtual Role Rol { get; set; } = null!;
}
