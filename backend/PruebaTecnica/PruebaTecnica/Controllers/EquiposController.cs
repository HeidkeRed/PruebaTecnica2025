using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PruebaTecnica.DTOs;
using PruebaTecnica.Models;

namespace PruebaTecnica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EquiposController : ControllerBase
    {
        private readonly PruebaTContext _context;

        public EquiposController(PruebaTContext context)
        {
            _context = context;
        }

        [HttpGet("equipos")]
        public async Task<IActionResult> GetEquipos(
            [FromQuery] string? estado,
            [FromQuery] string? tipo_equipo)
        {
            var query = _context.Equipos.AsQueryable();

            if (!string.IsNullOrEmpty(estado))
            {
                string estadoNorm = estado.Trim().ToLower();
                query = query.Where(e => e.Estado.ToLower() == estadoNorm);
            }

            if (!string.IsNullOrEmpty(tipo_equipo))
            {
                string tipoNorm = tipo_equipo.Trim().ToLower();
                query = query.Where(e => e.TipoEquipo.ToLower() == tipoNorm);
            }

            var equipos = await query
                .Select(e => new
                {
                    e.Id,
                    e.TipoEquipo,
                    e.Modelo,
                    e.NumeroSerie,
                    e.Estado,
                    e.Costo,
                    e.Especificaciones,
                    AsignadoA = _context.HistorialAsignaciones
                        .Where(h => h.EquipoId == e.Id && h.Accion == "asignado")
                        .OrderByDescending(h => h.Fecha)
                        .Select(h => h.Empleado != null ? h.Empleado.NombreCompleto : null)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(equipos);
        }

        [HttpPost]
        public async Task<IActionResult> CrearEquipo([FromBody] Equipo nuevo)
        {
            if (nuevo == null) return BadRequest("El objeto recibido es nulo.");

            if (string.IsNullOrWhiteSpace(nuevo.TipoEquipo)) return BadRequest("El campo 'tipo_equipo' es obligatorio.");
            if (string.IsNullOrWhiteSpace(nuevo.Modelo)) return BadRequest("El campo 'modelo' es obligatorio.");
            if (string.IsNullOrWhiteSpace(nuevo.NumeroSerie)) return BadRequest("El campo 'numero_serie' es obligatorio.");
            if (string.IsNullOrWhiteSpace(nuevo.Estado)) return BadRequest("El campo 'estado' es obligatorio.");

            bool existeSerie = await _context.Equipos.AnyAsync(e => e.NumeroSerie == nuevo.NumeroSerie);
            if (existeSerie) return BadRequest("Ya existe un equipo con ese número de serie.");

            _context.Equipos.Add(nuevo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEquipos), new { id = nuevo.Id }, nuevo);
        }

       
        [HttpPost("{equipoId}/asignar")]
        public async Task<IActionResult> AsignarEquipo(int equipoId, [FromBody] AsignarEquipoRequest request)
        {
            var equipo = await _context.Equipos.FindAsync(equipoId);
            if (equipo == null) return NotFound("Equipo no encontrado");

            var empleado = await _context.Empleados.FindAsync(request.EmpleadoId);
            if (empleado == null) return NotFound("Empleado no encontrado");

          
            equipo.Estado = "asignado";
            _context.Equipos.Update(equipo);

            // Crear registro en historial
            var historial = new HistorialAsignacione
            {
                EquipoId = equipo.Id,
                EmpleadoId = empleado.Id,
                Fecha = DateTime.Now,
                Accion = "Asignado"
            };
            _context.HistorialAsignaciones.Add(historial);

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = $"Equipo {equipo.NumeroSerie} asignado a {empleado.NombreCompleto}" });
        }
    }
}
