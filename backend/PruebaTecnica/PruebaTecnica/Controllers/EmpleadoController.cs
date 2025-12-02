using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PruebaTecnica.Models;
using PruebaTecnica.DTOs;
using PruebaTecnica.Services;
using Microsoft.AspNetCore.Authorization;

namespace PruebaTecnica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EmpleadoController : ControllerBase
    {
        private readonly PruebaTContext _context;
        private readonly PasswordService _passwordService;

        public EmpleadoController(PruebaTContext context, PasswordService passwordService)
        {
            _context = context;
            _passwordService = passwordService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var empleados = await _context.Empleados
                .Select(e => new
                {
                    e.Id,
                    e.NombreCompleto,
                    e.Email,
                    Rol = e.RolActual != null ? e.RolActual.NombreRol : null,
                    e.Activo
                })
                .ToListAsync();

            return Ok(empleados);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("register")]
        public IActionResult Register(EmpleadoRegisterDTO dto)
        {
            if (_context.Empleados.Any(x => x.Email == dto.Email))
                return BadRequest("El correo ya está registrado");

            _passwordService.CreatePasswordHash(dto.Password, out string hash, out string salt);

            var empleado = new Empleado
            {
                NombreCompleto = dto.NombreCompleto,
                RolActualId = dto.RolActualId,
                Email = dto.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                Activo = true
            };

            _context.Empleados.Add(empleado);
            _context.SaveChanges();

            return Ok(new
            {
                mensaje = "Empleado registrado correctamente",
                empleado.Id,
                empleado.NombreCompleto,
                empleado.Email,
                empleado.RolActualId
            });
        }


    }
}
