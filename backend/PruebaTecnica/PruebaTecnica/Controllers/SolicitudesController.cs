using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PruebaTecnica.Models;
using PruebaTecnica.DTOs;
using Newtonsoft.Json.Linq;

namespace PruebaTecnica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class SolicitudesController : ControllerBase
    {
        private readonly PruebaTContext _context;

        public SolicitudesController(PruebaTContext context)
        {
            _context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")] // Solo Admin puede crear solicitudes
        public async Task<IActionResult> CrearSolicitud([FromBody] SolicitudCreateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Obtener el ID del empleado logueado desde el claim correcto
            var empleadoIdClaim = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
            if (string.IsNullOrEmpty(empleadoIdClaim))
                return Unauthorized("Token inválido");

            if (!int.TryParse(empleadoIdClaim, out int empleadoId))
                return Unauthorized("Token inválido");

            // Verificar que el empleado exista en la base
            var empleado = await _context.Empleados.FindAsync(empleadoId);
            if (empleado == null)
                return Unauthorized("Empleado no encontrado");

            // Crear la solicitud
            var solicitud = new SolicitudesEquipamiento
            {
                NombreSolicitud = dto.NombreSolicitud,
                Estado = "pendiente",
                CreadoPor = empleadoId,
                Fecha = DateTime.Now
            };

            _context.SolicitudesEquipamientos.Add(solicitud);
            await _context.SaveChangesAsync();

            // Agregar detalles de roles solicitados
            foreach (var rol in dto.RolesSolicitados)
            {
                var detalle = new DetallesSolicitud
                {
                    SolicitudId = solicitud.Id,
                    RolId = rol.RolId,
                    CantidadPuestos = rol.Cantidad
                };
                _context.DetallesSolicituds.Add(detalle);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Solicitud creada correctamente",
                solicitud.Id
            });
        }


        // GET: api/solicitudes
        [HttpGet]
        public async Task<IActionResult> GetSolicitudes()
        {
            var solicitudes = await _context.SolicitudesEquipamientos
                .Include(s => s.DetallesSolicituds)
                .Include(s => s.CreadoPorNavigation)
                .Select(s => new SolicitudResponseDTO
                {
                    Id = s.Id,
                    NombreSolicitud = s.NombreSolicitud,
                    Estado = s.Estado,
                    Fecha = s.Fecha,
                    CreadoPor = s.CreadoPorNavigation!.NombreCompleto,
                    RolesSolicitados = s.DetallesSolicituds.Select(d => new RolCantidadDTO
                    {
                        RolId = d.RolId,
                        Cantidad = d.CantidadPuestos
                    }).ToList()
                })
                .ToListAsync();

            return Ok(solicitudes);
        }

        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSolicitud(int id)
        {
            var solicitud = await _context.SolicitudesEquipamientos
                .Include(s => s.DetallesSolicituds)
                .Include(s => s.CreadoPorNavigation)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (solicitud == null) return NotFound("Solicitud no encontrada");

            var response = new SolicitudResponseDTO
            {
                Id = solicitud.Id,
                NombreSolicitud = solicitud.NombreSolicitud,
                Estado = solicitud.Estado,
                Fecha = solicitud.Fecha,
                CreadoPor = solicitud.CreadoPorNavigation!.NombreCompleto,
                RolesSolicitados = solicitud.DetallesSolicituds.Select(d => new RolCantidadDTO
                {
                    RolId = d.RolId,
                    Cantidad = d.CantidadPuestos
                }).ToList()
            };

            return Ok(response);
        }

        [HttpGet("{id}/propuesta-optima")]
        public async Task<IActionResult> ObtenerPropuestaOptima(int id)
        {
            // 1. Leer solicitud
            var solicitud = await _context.SolicitudesEquipamientos
                .Include(s => s.DetallesSolicituds)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (solicitud == null)
                return NotFound("Solicitud no encontrada");

            // 2. Leer inventario disponible
            var equipos = await _context.Equipos
                .Where(e => e.Estado == "disponible")
                .ToListAsync();

            var propuesta = new List<object>();
            var faltantes = new List<object>();
            decimal costoTotal = 0;

            foreach (var detalle in solicitud.DetallesSolicituds)
            {
                var rol = await _context.Roles.FindAsync(detalle.RolId);

                for (int i = 1; i <= detalle.CantidadPuestos; i++)
                {
                    var requerimientos = _context.PerfilesRequerimientos
                        .Where(p => p.RolId == detalle.RolId)
                        .ToList();

                    var equiposAsignados = new List<object>();

                    foreach (var req in requerimientos)
                    {
                        // Filtrar por tipo de equipo
                        var candidatos = equipos
                            .Where(e => e.TipoEquipo == req.TipoEquipo)
                            .ToList();

                        if (!candidatos.Any())
                        {
                            faltantes.Add(new
                            {
                                rol = rol.NombreRol,
                                tipo = req.TipoEquipo,
                                puesto = i
                            });
                            continue;
                        }

                        // Evaluar score usando especificaciones
                        var mejor = candidatos
                            .OrderByDescending(e => CalcularScore(rol.NombreRol, e))
                            .First();

                        equiposAsignados.Add(new
                        {
                            equipo_id = mejor.Id,
                            tipo_equipo = mejor.TipoEquipo,
                            costo = mejor.Costo
                        });

                        costoTotal += mejor.Costo ?? 0;
                        equipos.Remove(mejor); // evitar duplicado
                    }

                    propuesta.Add(new
                    {
                        rol = rol.NombreRol,
                        puesto = i,
                        equipos = equiposAsignados
                    });
                }
            }

            return Ok(new
            {
                solicitud_id = id,
                asignaciones = propuesta,
                costo_total_estimado = costoTotal,
                faltantes = faltantes,
                mensaje = "Propuesta generada"
            });
        }

        private int CalcularScore(string rol, Equipo equipo)
        {
            if (equipo.Especificaciones == null)
                return 0;

            JObject specs;
            try
            {
                specs = JObject.Parse(equipo.Especificaciones);
            }
            catch
            {
                return 0; // JSON mal formado
            }

            int score = 0;

            // Lectura flexible de atributos
            string cpu = specs["CPU"]?.ToString() ?? "";
            int ram = (int?)specs["RAM_GB"] ?? 0;
            string gpu = specs["GPU"]?.ToString() ?? "";
            int almacenamiento = (int?)specs["Storage_GB"] ?? 0;

            switch (rol.ToLower())
            {
                case "diseno": 
                    if (gpu.Contains("RTX")) score += 50;
                    if (ram >= 16) score += 30;
                    if (cpu.Contains("i7") || cpu.Contains("Ryzen 7")) score += 20;
                    break;

                case "developer": 
                    if (cpu.Contains("i7") || cpu.Contains("Ryzen 7")) score += 40;
                    if (ram >= 16) score += 30;
                    if (almacenamiento >= 512) score += 20;
                    break;

                case "admin": 
                    if (cpu.Contains("i5") || cpu.Contains("Ryzen 5")) score += 20;
                    if (ram >= 8) score += 20;
                    break;

                case "supervisor": 
                    if (cpu.Contains("i5") || cpu.Contains("Ryzen 5")) score += 25;
                    if (ram >= 8) score += 15;
                    break;

                case "empleado":
                case "ingcivil": 
                default:
                    // Rol genérico (incluye Empleado, IngCivil, y cualquier otro sin reglas específicas)
                    if (ram >= 8) score += 10;
                    break;
            }

            string rolLower = rol.ToLower();
            if (rolLower == "admin" || rolLower == "supervisor" || rolLower == "empleado")
            {
               
                decimal costo = equipo.Costo ?? 0;

                if (costo > 2000) // Equipo muy caro
                {
                    score -= 50; // Penalización fuerte para evitarlo si hay alternativas decentes
                }
                else if (costo > 1000) // Equipo caro
                {
                    score -= 20; // Penalización moderada
                }
                else if (costo > 500) // Precio promedio
                {
                    // Sin penalización o bonificación. El score se mantiene por el rendimiento.
                }
                else // Equipo económico
                {
                    score += 10; // Bonificación ligera para priorizar los más económicos (siempre que cumplan el score base)
                }
            }

            return Math.Max(0, score);
        }


    }
}
