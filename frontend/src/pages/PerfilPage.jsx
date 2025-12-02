import { useEffect, useState } from "react";
import { obtenerEquipos } from "../api/Api";

export default function PerfilPage() {
  const [equipos, setEquipos] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await obtenerEquipos();
        setEquipos(data);

        const userData = localStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));
      } catch (err) {
        console.error(err);
      }
    };

    cargarDatos();
  }, []);

  if (!user) return <p>Cargando usuario...</p>;

  return (
    <div>
      <h1>Perfil de {user.NombreCompleto}</h1>
      <p>Email: {user.Email}</p>
      <p>Rol: {user.Rol}</p>

      <h2>Equipos</h2>
      <ul>
        {equipos.map((e) => (
          <li key={e.id}>
            {e.tipoEquipo} - {e.modelo} - {e.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
