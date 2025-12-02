import { getToken } from "./Auth";

const API_URL = "https://localhost:7294/api";

export const obtenerEquipos = async (estado = "", tipo = "") => {
  const token = getToken();

  const url = new URL(`${API_URL}/Equipos/equipos`);

  if (estado) url.searchParams.append("estado", estado);
  if (tipo) url.searchParams.append("tipo_equipo", tipo);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    }
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
