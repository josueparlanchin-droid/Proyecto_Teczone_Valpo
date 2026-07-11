import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Registro from "./pages/Registro.jsx";
import Login from "./pages/Login.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GestionProductos from "./pages/GestionProductos.jsx";
import Carrito from "./pages/Carrito.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/catalogo" element={<ProtectedRoute><Catalogo /></ProtectedRoute>} />
        <Route path="/carrito" element={<ProtectedRoute><Carrito /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/gestion-productos" element={<ProtectedRoute><GestionProductos /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
