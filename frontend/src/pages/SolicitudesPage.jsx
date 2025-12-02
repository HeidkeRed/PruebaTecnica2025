import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerSolicitudes, crearSolicitud, obtenerRoles } from "../api/SolicitudesApi";

const baseStyles = {
  container: {
    padding: "40px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "30px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    backgroundColor: "white",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
    marginBottom: "15px",
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
  secondaryButton: {
    backgroundColor: "#6c757d",
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
};


export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [nombreSolicitud, setNombreSolicitud] = useState("");
  const [roles, setRoles] = useState([{ rolId: "", cantidad: 1 }]);
  const [listaRoles, setListaRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarSolicitudes();
    cargarRoles();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const data = await obtenerSolicitudes();
      setSolicitudes(data);
    } catch (err) {
      console.error("Error al cargar solicitudes:", err.message);
    }
  };

  const cargarRoles = async () => {
    try {
      const data = await obtenerRoles();
      setListaRoles(data);
    } catch (err) {
      console.error("Error al cargar roles:", err.message);
    }
  };

  const handleAgregarRol = () => {
    // Solo permitir agregar un nuevo rol si el último ya tiene un rolId seleccionado
    if (roles.length > 0 && roles[roles.length - 1].rolId === "") {
        alert("Por favor, selecciona un rol para la fila actual antes de agregar uno nuevo.");
        return;
    }
    setRoles([...roles, { rolId: "", cantidad: 1 }]);
  };

  const handleEliminarRol = (index) => {
    const nuevosRoles = roles.filter((_, i) => i !== index);
    setRoles(nuevosRoles);
  };

  const handleCambiarRol = (index, campo, valor) => {
    const nuevosRoles = [...roles];
    nuevosRoles[index][campo] = valor;
    setRoles(nuevosRoles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreSolicitud.trim()) {
        alert("El nombre de la solicitud no puede estar vacío.");
        return;
    }
    // Validación: asegurar que todos los roles seleccionados tengan un rolId y cantidad > 0
    const rolesValidos = roles.filter(r => r.rolId !== "" && r.cantidad > 0);
    if (rolesValidos.length === 0) {
        alert("Debes seleccionar al menos un rol válido con cantidad mayor a cero.");
        return;
    }

    try {
      await crearSolicitud({ nombreSolicitud, rolesSolicitados: rolesValidos });
      setNombreSolicitud("");
      setRoles([{ rolId: "", cantidad: 1 }]);
      cargarSolicitudes();
      alert("✅ Solicitud creada correctamente");
    } catch (err) {
      alert(`❌ Error al crear solicitud: ${err.message}`);
    }
  };

  const navegarPropuesta = (id) => {
    navigate(`/solicitudes/${id}/propuesta`);
  };

  return (
    <div style={baseStyles.container}>
      <h1>⚙️ Solicitudes de Equipamiento</h1>
      
      <hr style={{margin: "20px 0"}} />

      {/* --- SECCIÓN CREAR SOLICITUD --- */}
      <div style={baseStyles.card}>
        <h2>➕ Crear nueva solicitud</h2>
        <form onSubmit={handleSubmit}>
          
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
            Nombre de la Solicitud:
          </label>
          <input
            type="text"
            placeholder="Ej: Proyecto 'Alpha' - Tarea 3"
            value={nombreSolicitud}
            onChange={(e) => setNombreSolicitud(e.target.value)}
            style={baseStyles.input}
            required
          />

          <h3>👥 Roles solicitados</h3>
          <div style={{ border: "1px dashed #ddd", padding: "15px", borderRadius: "5px", marginBottom: "15px" }}>
            {roles.map((r, idx) => (
              <div key={idx} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                
                {/* Selector de Rol */}
                <select
                  value={r.rolId}
                  onChange={(e) => handleCambiarRol(idx, "rolId", e.target.value)}
                  style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", flexGrow: 1 }}
                >
                  <option value="">-- Selecciona un rol --</option>
                  {listaRoles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombreRol}
                    </option>
                  ))}
                </select>

                {/* Input de Cantidad */}
                <input
                  type="number"
                  placeholder="Cant."
                  value={r.cantidad}
                  min={1}
                  onChange={(e) => handleCambiarRol(idx, "cantidad", parseInt(e.target.value) || 1)}
                  style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "80px", textAlign: "center" }}
                />

                {/* Botón de Eliminar */}
                {roles.length > 1 && (
                    <button 
                        type="button" 
                        onClick={() => handleEliminarRol(idx)}
                        style={{ ...baseStyles.button, backgroundColor: "#dc3545", padding: "8px 10px" }}
                        title="Eliminar este rol"
                    >
                        🗑️
                    </button>
                )}
              </div>
            ))}

            {/* Botón Agregar Rol */}
            <button 
                type="button" 
                onClick={handleAgregarRol}
                style={{ ...baseStyles.button, ...baseStyles.secondaryButton, marginTop: "10px" }}
            >
                + Agregar otro rol
            </button>
          </div>


          {/* Botón Principal de Submit */}
          <button 
            type="submit" 
            style={{ ...baseStyles.button, ...baseStyles.primaryButton, width: "100%", marginTop: "20px" }}
          >
             Crear Solicitud
          </button>
        </form>
      </div>

      <hr style={{margin: "20px 0"}} />

      {/* --- SECCIÓN SOLICITUDES EXISTENTES --- */}
      <h2>📄 Solicitudes existentes</h2>
      {solicitudes.length === 0 ? (
          <p style={{padding: "15px", backgroundColor: "#fff3cd", border: "1px solid #ffeeba", borderRadius: "5px"}}>
            No hay solicitudes creadas. ¡Empieza creando una arriba!
          </p>
      ) : (
        <table style={baseStyles.table}>
          <thead>
            <tr>
              <th style={{ ...baseStyles.th, width: "30%" }}>Nombre</th>
              <th style={{ ...baseStyles.th, width: "20%" }}>Fecha</th>
              <th style={{ ...baseStyles.th, width: "15%" }}>Estado</th>
              <th style={{ ...baseStyles.th, width: "15%" }}>Creado por</th>
              <th style={{ ...baseStyles.th, width: "20%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((s) => (
              <tr key={s.id}>
                <td style={baseStyles.td}>{s.nombreSolicitud}</td>
                <td style={baseStyles.td}>{new Date(s.fecha).toLocaleDateString()}</td>
                <td style={{ ...baseStyles.td, fontWeight: 'bold', color: s.estado === 'pendiente' ? '#ffc107' : '#28a745' }}>
                    {s.estado.toUpperCase()}
                </td>
                <td style={baseStyles.td}>{s.creadoPor}</td>
                <td style={baseStyles.td}>
                  {s.estado === "pendiente" ? (
                    <button 
                        onClick={() => navegarPropuesta(s.id)}
                        style={{ ...baseStyles.button, backgroundColor: "#17a2b8", color: 'white', padding: "8px 10px" }}
                    >
                      🔍 Ver propuesta
                    </button>
                  ) : (
                    <span style={{color: '#6c757d'}}>Completada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}