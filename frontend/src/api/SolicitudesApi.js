import { getToken } from "./Auth";

const API_URL = "https://localhost:7294/api";

export const obtenerSolicitudes = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/Solicitudes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const crearSolicitud = async (data) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/Solicitudes`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const obtenerRoles = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/Roles/roles`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export const obtenerPropuestaOptima = async (id) => {
  const token = getToken();
  const res = await fetch(`${API_URL}/Solicitudes/${id}/propuesta-optima`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};
