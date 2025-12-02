import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PerfilPage from "./pages/PerfilPage";
import Dashboard from "./pages/Dashboard";
import SolicitudesPage from "./pages/SolicitudesPage";
import PropuestaPage from "./pages/PropuestaPage";
import EquiposPage from "./pages/EquiposPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/solicitudes" element={<SolicitudesPage />} />
        <Route path="/solicitudes/:id/propuesta" element={<PropuestaPage />} />
        <Route path="/equipos" element={<EquiposPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
