import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/Auth";

// --- Objeto de Estilos para el Componente ---
const loginStyles = {
  pageContainer: {
    // Centrar la tarjeta en la pantalla
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f6f9", // Fondo suave
    fontFamily: "Arial, sans-serif",
  },
  loginCard: {
    // Tarjeta contenedora
    width: "100%",
    maxWidth: "400px",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "2em",
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1em",
    boxSizing: "border-box", // Importante para que el padding no afecte el width
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007bff", // Azul primario
    color: "white",
    fontSize: "1.1em",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  errorBox: {
    backgroundColor: "#f8d7da", // Fondo rojo claro
    color: "#721c24", // Texto rojo oscuro
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #f5c6cb",
    fontSize: "0.95em",
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error anterior
    
    // Validación básica
    if (!email || !password) {
        setError("Por favor, ingresa correo y contraseña.");
        return;
    }

    try {
      const data = await login(email, password);
      // Almacenamiento de tokens y datos
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Redirección
      navigate("/dashboard");
    } catch (err) {
      // Manejo de errores de la API
      setError(err.message || "Error desconocido al intentar iniciar sesión.");
    }
  };

  return (
    <div style={loginStyles.pageContainer}>
      <div style={loginStyles.loginCard}>
        <h1 style={loginStyles.title}>Iniciar Sesión</h1>

        {/* Mostrar Error */}
        {error && (
          <div style={loginStyles.errorBox}>
             Error de Autenticación: {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Input de Correo */}
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={loginStyles.input}
            required
          />
          
          {/* Input de Contraseña */}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={loginStyles.input}
            required
          />
          
          {/* Botón de Submit */}
          <button type="submit" style={loginStyles.button}>
            Entrar
          </button>
        </form>
      
      </div>
    </div>
  );
}