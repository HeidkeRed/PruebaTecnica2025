import { useState, useEffect } from "react";
import { obtenerEquipos, crearEquipo } from "../api/EquipoApi";

const estilos = {
  container: {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    marginBottom: "30px",
  },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s",
  },
  primaryButton: {
    backgroundColor: "#007bff",
    color: "white",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#f2f2f2",
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    color: "#333",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    color: "#555",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
};

export default function EquiposPage() {
  const [equipos, setEquipos] = useState([]);
  const [form, setForm] = useState({
    tipoEquipo: "",
    modelo: "",
    numeroSerie: "",
    estado: "disponible",
    costo: 0,
    especificaciones: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const data = await obtenerEquipos();
        setEquipos(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEquipos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevoEquipo = await crearEquipo(form);
      setEquipos([...equipos, nuevoEquipo]);
      setForm({
        tipoEquipo: "",
        modelo: "",
        numeroSerie: "",
        estado: "disponible",
        costo: 0,
        especificaciones: "",
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={estilos.container}>
      <h1>⚙️ Equipos</h1>
      {error && <p style={estilos.error}>{error}</p>}

      <div style={estilos.card}>
        <h2>➕ Crear Nuevo Equipo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="tipoEquipo"
            placeholder="Tipo de equipo"
            value={form.tipoEquipo}
            onChange={handleChange}
            style={estilos.input}
            required
          />
          <input
            type="text"
            name="modelo"
            placeholder="Modelo"
            value={form.modelo}
            onChange={handleChange}
            style={estilos.input}
            required
          />
          <input
            type="text"
            name="numeroSerie"
            placeholder="Número de serie"
            value={form.numeroSerie}
            onChange={handleChange}
            style={estilos.input}
            required
          />
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            style={estilos.select}
          >
            <option value="disponible">disponible</option>
            <option value="asignado">asignado</option>
            <option value="baja">baja</option>
          </select>
          <input
            type="number"
            name="costo"
            placeholder="Costo"
            value={form.costo}
            onChange={handleChange}
            style={estilos.input}
          />
          <input
            type="text"
            name="especificaciones"
            placeholder="Especificaciones"
            value={form.especificaciones}
            onChange={handleChange}
            style={estilos.input}
          />
          <button type="submit" style={{ ...estilos.button, ...estilos.primaryButton, width: "100%" }}>
            🚀 Crear Equipo
          </button>
        </form>
      </div>

      <h2>📄 Lista de Equipos</h2>
      {equipos.length === 0 ? (
        <p>No hay equipos registrados.</p>
      ) : (
        <table style={estilos.table}>
          <thead>
            <tr>
              <th style={estilos.th}>Tipo</th>
              <th style={estilos.th}>Modelo</th>
              <th style={estilos.th}>Serie</th>
              <th style={estilos.th}>Estado</th>
              <th style={estilos.th}>Costo</th>
              <th style={estilos.th}>Especificaciones</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((e) => (
              <tr key={e.id}>
                <td style={estilos.td}>{e.tipoEquipo}</td>
                <td style={estilos.td}>{e.modelo}</td>
                <td style={estilos.td}>{e.numeroSerie}</td>
                <td style={estilos.td}>{e.estado}</td>
                <td style={estilos.td}>${e.costo}</td>
                <td style={estilos.td}>{e.especificaciones}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
