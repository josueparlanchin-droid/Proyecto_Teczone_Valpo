import { BrowserRouter, Routes, Route } from "react-router-dom";
import Registro from "./pages/Registro.jsx";
import Login from "./pages/Login.jsx";
import Catalogo from "./pages/Catalogo.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Definimos las URLs de nuestra app */}
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
        
        {/* Si entra a la raíz, lo mandamos directo al login por ahora */}
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;