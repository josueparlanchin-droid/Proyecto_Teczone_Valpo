import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Route path="/" element={<Catalogo />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gestion-productos" element={<GestionProductos />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
