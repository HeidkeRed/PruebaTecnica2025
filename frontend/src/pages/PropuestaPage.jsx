import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { obtenerPropuestaOptima } from "../api/SolicitudesApi";


const baseStyles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    backgroundColor: "white",
  },
  rolHeader: {
    borderBottom: "2px solid #007bff",
    paddingBottom: "10px",
    marginBottom: "15px",
    color: "#007bff",
  },
  costoTotal: {
    fontSize: "2em",
    fontWeight: "bold",
    color: "#28a745", 
  },
  alerta: {
    padding: "15px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  alertaError: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
  },
  alertaFaltante: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    border: "1px solid #ffeeba",
  },
};

// --- Componente de Asignación de Rol
function AsignacionCard({ asignacion, index }) {
  const { rol, puesto, equipos } = asignacion;

  return (
    <div key={index} style={baseStyles.card}>
      <h3 style={baseStyles.rolHeader}>
        Rol: {rol} — Puesto #{puesto}
      </h3>

      {equipos.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>Tipo de Equipo</th>
              <th style={{ textAlign: "left", padding: "8px" }}>ID de Equipo</th>
              <th style={{ textAlign: "right", padding: "8px" }}>Costo</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((eq) => (
              <tr key={eq.equipo_id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "8px" }}>{eq.tipo_equipo}</td>
                <td style={{ padding: "8px" }}>#{eq.equipo_id}</td>
                <td style={{ textAlign: "right", padding: "8px" }}>
                  ${new Intl.NumberFormat('es-MX').format(eq.costo)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={{ ...baseStyles.alerta, ...baseStyles.alertaFaltante }}>
          ❌ No hay equipos asignados para este puesto.
        </div>
      )}
    </div>
  );
}

export default function PropuestaPage() {
  const { id } = useParams();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const data = await obtenerPropuestaOptima(id);
        setDatos(data);
        setError("");
      } catch (err) {
        setError(err.message || "Ocurrió un error al cargar la propuesta.");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]); 


  const costoFormateado = useMemo(() => {
    if (datos && datos.costo_total_estimado) {

      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN', 
        minimumFractionDigits: 2,
      }).format(datos.costo_total_estimado);
    }
    return "$0.00";
  }, [datos]);

  // --- Renderizado de estados ---
  if (cargando) {
    return (
      <div style={baseStyles.container}>
        <div style={{ ...baseStyles.alerta, backgroundColor: "#e9ecef" }}>
          🔄 Cargando propuesta para Solicitud **#{id}**...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={baseStyles.container}>
        <div style={{ ...baseStyles.alerta, ...baseStyles.alertaError }}>
           Error: {error}
        </div>
      </div>
    );
  }

  if (!datos) {
    return (
        <div style={baseStyles.container}>
          <div style={{ ...baseStyles.alerta, ...baseStyles.alertaFaltante }}>
            ⚠️ No se encontraron datos para la Solicitud **#{id}**.
          </div>
        </div>
      );
  }

  // --- Renderizado de datos ---
  return (
    <div style={baseStyles.container}>
      <h1>✅ Propuesta Óptima — Solicitud #{id}</h1>
      <hr />

      {/* --- Costo Total --- */}
      <div style={baseStyles.card}>
        <h2>Resumen de Costo</h2>
        <p style={baseStyles.costoTotal}>
          Costo Total Estimado: {costoFormateado}
        </p>
      </div>

      {/* --- Asignaciones por Rol --- */}
      <h2>Asignaciones de Equipos por Rol</h2>
      {datos.asignaciones.map((a, index) => (
        <AsignacionCard key={index} asignacion={a} />
      ))}

      {/* --- Faltantes --- */}
      {datos.faltantes.length > 0 && (
        <div style={{ ...baseStyles.card, ...baseStyles.alertaError }}>
          <h2 style={{ color: "#721c24" }}>🚨 Detalles de Faltantes</h2>
          <p>
            La propuesta tiene los siguientes **{datos.faltantes.length} faltantes**
            que no pudieron ser cubiertos:
          </p>
          <ul>
            {datos.faltantes.map((f, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                Rol {f.rol} (Puesto #{f.puesto}) — Falta: {f.tipo}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}