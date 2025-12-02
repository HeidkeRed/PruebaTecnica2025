import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerEquipos } from "../api/Api";
import { logout } from "../api/Auth";



const dashboardStyles = {
  container: {
    padding: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Roboto, Arial, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: "#007bff", 
    color: "white",
    transition: "background-color 0.2s",
  },
  filterContainer: {
    display: "flex",
    gap: "15px",
    marginBottom: "30px",
    padding: "15px",
    backgroundColor: "#f8f9fa", 
    borderRadius: "8px",
    border: "1px solid #e9ecef",
    alignItems: "center",
  },
  select: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ced4da",
    minWidth: "180px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    borderRadius: "8px",
    overflow: "hidden", 
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
  },
  th: {
    backgroundColor: "#343a40", 
    color: "white",
    padding: "14px 12px",
    textAlign: "left",
    fontWeight: "600",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #f1f1f1",
    color: "#333",
    verticalAlign: "middle",
  },
};

const EstadoTag = ({ estado }) => {
  const estadoMap = {
    disponible: { text: "Disponible", color: "#28a745" }, 
    asignado: { text: "Asignado", color: "#ffc107" }, 
    baja: { text: "Baja", color: "#dc3545" }, 
    default: { text: estado, color: "#6c757d" },
  };
  const current = estadoMap[estado] || estadoMap.default;

  return (
    <span
      style={{
        backgroundColor: current.color,
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '0.85em',
        fontWeight: 'bold',
        display: 'inline-block',
      }}
    >
      {current.text}
    </span>
  );
};

const handleLogout = async () => {
  try {
    await logout();
  } catch (e) {
    console.error("Error en logout:", e);
  }

  localStorage.removeItem("token");
  navigate("/login");
};


export default function Dashboard() {
  const [equipos, setEquipos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);

  // --- Redirigir si no está logueado ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  // --- Cargar Equipos con Filtros ---
  const cargarEquipos = async () => {
    setCargando(true);
    try {

      const data = await obtenerEquipos(estadoFiltro, tipoFiltro);
      setEquipos(data);
    } catch (err) {
      console.error("Error al cargar equipos:", err.message);
    } finally {
      setCargando(false);
    }
  };


  useEffect(() => {
    cargarEquipos();
  }, [estadoFiltro, tipoFiltro]); 
  

  const formatCosto = (costo) => {
    if (costo === undefined || costo === null) return "N/A";
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN', 
    }).format(costo);
  };

  return (
    <div style={dashboardStyles.container}>
 <div style={dashboardStyles.header}>
  <h1>💻 Inventario de Equipos</h1>

  <div style={{ display: "flex", gap: "10px" }}>
    <button
      style={dashboardStyles.button}
      onClick={() => navigate("/solicitudes")}
    >
       Ir a Solicitudes
    </button>
    <button
    style={dashboardStyles.button}
    onClick={() => navigate("/equipos")} 
  >
     Crear Equipo
  </button>
    {/* Botón de Logout */}
    <button
      style={{
        ...dashboardStyles.button,
        backgroundColor: "#dc3545" 
      }}
      onClick={handleLogout}
    >
       Cerrar Sesión
    </button>
  </div>
</div>


      <hr />

      {/* --- FILTROS --- */}
      <div style={dashboardStyles.filterContainer}>
        <h3 style={{ margin: 0, color: '#555' }}>Filtros Rápidos:</h3>
        
        {/* Filtro de Estado */}
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          style={dashboardStyles.select}
        >
          <option value="">Todos los estados</option>
          <option value="disponible">✅ Disponible</option>
          <option value="Asignado">🟡 Asignado</option>
          <option value="baja">❌ Baja</option>
        </select>

        {/* Filtro de Tipo */}
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          style={dashboardStyles.select}
        >
          <option value="">Todos los tipos</option>
          <option value="Laptop">💻 Laptop</option>
          <option value="Monitor">🖥️ Monitor</option>
          <option value="Dock">🔌 Dock</option>
          <option value="Teclado">⌨️ Teclado</option>
          <option value="Mouse">🖱️ Mouse</option>
        </select>
        
        
      </div>

      {/* --- TABLA / RESULTADOS --- */}
      
      {cargando && (
        <p style={{ padding: '15px', backgroundColor: '#e9f7ef', color: '#007b8b', borderRadius: '5px' }}>
          🔄 Cargando equipos...
        </p>
      )}

      {!cargando && equipos.length === 0 ? (
        <p style={{ padding: '15px', backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', borderRadius: '5px' }}>
          ⚠️ No se encontraron equipos con los filtros seleccionados.
        </p>
      ) : (
        <table style={dashboardStyles.table}>
          <thead>
            <tr>
              <th style={{ ...dashboardStyles.th, borderTopLeftRadius: '8px' }}>ID</th>
              <th style={dashboardStyles.th}>Tipo</th>
              <th style={dashboardStyles.th}>Modelo</th>
              <th style={dashboardStyles.th}># Serie</th>
              <th style={dashboardStyles.th}>Estado</th>
              <th style={dashboardStyles.th}>Costo</th>
              <th style={{ ...dashboardStyles.th, borderTopRightRadius: '8px' }}>Asignado a</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((e, index) => (
              <tr key={e.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                <td style={dashboardStyles.td}>#{e.id}</td>
                <td style={dashboardStyles.td}>{e.tipoEquipo}</td>
                <td style={dashboardStyles.td}>{e.modelo}</td>
                <td style={dashboardStyles.td}>{e.numeroSerie}</td>
                <td style={dashboardStyles.td}>
                  <EstadoTag estado={e.estado} />
                </td>
                <td style={{ ...dashboardStyles.td, fontWeight: 'bold' }}>{formatCosto(e.costo)}</td>
                <td style={dashboardStyles.td}>{e.asignadoA || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}