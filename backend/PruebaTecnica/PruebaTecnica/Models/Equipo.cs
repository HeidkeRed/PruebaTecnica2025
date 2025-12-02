using System;
using System.Collections.Generic;

namespace PruebaTecnica.Models;

public partial class Equipo
{
    public int Id { get; set; }

    public string TipoEquipo { get; set; } = null!;

    public string Modelo { get; set; } = null!;

    public string NumeroSerie { get; set; } = null!;

    public string Estado { get; set; } = null!;

    public decimal? Costo { get; set; }

    public string? Especificaciones { get; set; }

    public virtual ICollection<HistorialAsignacione> HistorialAsignaciones { get; set; } = new List<HistorialAsignacione>();
}
