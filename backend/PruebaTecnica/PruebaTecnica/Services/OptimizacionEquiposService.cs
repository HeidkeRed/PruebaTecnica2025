using PruebaTecnica.Models;
using Newtonsoft.Json.Linq;

public class OptimizacionEquiposService
{
    public int CalcularScore(Equipo equipo, string rol)
    {
        var specs = JObject.Parse(equipo.Especificaciones);

        int ram = specs["ram"]?.Value<int>() ?? 0;
        string cpu = specs["cpu"]?.Value<string>() ?? "";
        string gpu = specs["gpu"]?.Value<string>() ?? "";
        int almacenamiento = specs["almacenamiento"]?.Value<int>() ?? 0;

        int score = 0;

        if (rol == "Diseno")
        {
            if (ram >= 16) score += 3;
            if (!string.IsNullOrEmpty(gpu) && gpu.Contains("RTX")) score += 5;
            if (almacenamiento >= 512) score += 2;
        }
        else if (rol == "Dev")
        {
            if (ram >= 16) score += 3;
            if (cpu.Contains("i7") || cpu.Contains("Ryzen 7")) score += 4;
            if (almacenamiento >= 512) score += 2;
        }
        else if (rol == "IngCivil")
        {
            if (ram >= 8) score += 2;
            if (cpu.Contains("i5") || cpu.Contains("Ryzen 5")) score += 2;
            if (!string.IsNullOrEmpty(gpu) && gpu.Contains("RTX")) score += 3;
        }
        else if (rol == "Admin" || rol == "Supervisor" || rol == "Empleado")
        {
            if (ram >= 8) score += 2;
            if (almacenamiento >= 256) score += 1;
        }

        return score;
    }

}
