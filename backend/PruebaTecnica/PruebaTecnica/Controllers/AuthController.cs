using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PruebaTecnica.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using PruebaTecnica.DTOs;
using PruebaTecnica.Services;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly PruebaTContext _context;
    private readonly IConfiguration _config;
    private readonly PasswordService _passwordService;

    public AuthController(
        PruebaTContext context,
        IConfiguration config,
        PasswordService passwordService)
    {
        _context = context;
        _config = config;
        _passwordService = passwordService;
    }

    // =====================
    // LOGIN
    // =====================
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Verificar si el token ya está revocado
        var incomingToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

        if (!string.IsNullOrEmpty(incomingToken))
        {
            bool revocado = _context.TokensRevocados.Any(t => t.Token == incomingToken);

            if (revocado)
                return Unauthorized("Este token ya fue cerrado y no puede usarse");
        }

        var user = await _context.Empleados
            .Include(e => e.RolActual)
            .FirstOrDefaultAsync(e => e.Email == request.Email);

        if (user == null)
            return Unauthorized("Usuario no encontrado");

        if (!_passwordService.VerifyPassword(request.Password, user.PasswordHash, user.PasswordSalt))
            return Unauthorized("Contraseña incorrecta");

        var token = GenerateJwtToken(user);

        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.NombreCompleto,
                user.Email,
                Rol = user.RolActual?.NombreRol
            }
        });
    }

    // =====================
    // REGISTER
    // =====================
    [HttpPost("register")]
    public IActionResult Register(EmpleadoRegisterDTO dto)
    {
        if (_context.Empleados.Any(e => e.Email == dto.Email))
            return BadRequest("El correo ya está registrado");

        _passwordService.CreatePasswordHash(dto.Password, out string hash, out string salt);

        var empleado = new Empleado
        {
            NombreCompleto = dto.NombreCompleto,
            Email = dto.Email,
            RolActualId = dto.RolActualId,
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
            empleado.Email
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

        if (string.IsNullOrEmpty(token))
            return BadRequest("No se envió token");

        await _context.TokensRevocados.AddAsync(new TokensRevocado
        {
            Token = token,
            FechaRevocado = DateTime.UtcNow
        });

        await _context.SaveChangesAsync();

        return Ok(new { mensaje = "Sesión cerrada correctamente" });
    }



    private string GenerateJwtToken(Empleado user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("rol", user.RolActual?.NombreRol ?? "Empleado")
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(3),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
