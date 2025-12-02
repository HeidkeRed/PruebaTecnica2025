using System;
using System.Collections.Generic;

namespace PruebaTecnica.Models;

public partial class TokensRevocado
{
    public int Id { get; set; }

    public string Token { get; set; } = null!;

    public DateTime FechaRevocado { get; set; }
}
