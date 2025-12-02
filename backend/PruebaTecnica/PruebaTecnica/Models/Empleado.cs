using System;
using System.Collections.Generic;

namespace PruebaTecnica.Models;

public partial class Empleado
{
    public int Id { get; set; }

    public string NombreCompleto { get; set; } = null!;

    public int? RolActualId { get; set; }

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? PasswordSalt { get; set; }

    public bool Activo { get; set; }

    public virtual ICollection<HistorialAsignacione> HistorialAsignacioneEmpleados { get; set; } = new List<HistorialAsignacione>();

    public virtual ICollection<HistorialAsignacione> HistorialAsignacioneResponsableNavigations { get; set; } = new List<HistorialAsignacione>();

    public virtual Role? RolActual { get; set; }

    public virtual ICollection<SolicitudesEquipamiento> SolicitudesEquipamientos { get; set; } = new List<SolicitudesEquipamiento>();
}
