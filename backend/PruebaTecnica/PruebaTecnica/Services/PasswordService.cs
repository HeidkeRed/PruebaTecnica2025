namespace PruebaTecnica.Services
{
    using System.Security.Cryptography;
    using System.Text;

    public class PasswordService
    {
        // 👉 Método para crear hash + salt
        public void CreatePasswordHash(string password, out string hash, out string salt)
        {
            using var hmac = new HMACSHA256();
            salt = Convert.ToBase64String(hmac.Key);
            hash = Convert.ToBase64String(
                hmac.ComputeHash(Encoding.UTF8.GetBytes(password))
            );
        }

        // 👉 Método para verificar contraseña
        public bool VerifyPassword(string password, string storedHash, string storedSalt)
        {
            using var hmac = new HMACSHA256(Convert.FromBase64String(storedSalt));
            var computedHash = Convert.ToBase64String(
                hmac.ComputeHash(Encoding.UTF8.GetBytes(password))
            );

            return computedHash == storedHash;
        }
    }
}
