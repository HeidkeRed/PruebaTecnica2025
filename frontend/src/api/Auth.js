const API_URL = "https://localhost:7294/api";

// -------------------------
// GUARDAR TOKEN
// -------------------------
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// -------------------------
// OBTENER TOKEN
// -------------------------
export const getToken = () => localStorage.getItem("token");

// -------------------------
// LOGIN
// -------------------------
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

// -------------------------
// LOGOUT
// -------------------------
export const logout = async () => {
  const token = getToken();
  if (!token) return;

  await fetch(`${API_URL}/Auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  localStorage.removeItem("token"); // limpiar token local
};
