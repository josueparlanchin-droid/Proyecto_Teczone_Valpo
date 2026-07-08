import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const menus = {
  administrador: [
    { label: "Catálogo", path: "/catalogo" },
    { label: "Gestionar Productos", path: "/gestion-productos" },
    { label: "Usuarios", path: "/usuarios" },
  ],
  botiquero: [
    { label: "Catálogo", path: "/catalogo" },
    { label: "Agregar Producto", path: "/gestion-productos" },
  ],
  cliente: [
    { label: "Catálogo", path: "/catalogo" },
  ],
  visita: [
    { label: "Catálogo", path: "/catalogo" },
  ],
};

function Dashboard() {
  const navegar = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (!stored) {
      navegar("/login");
      return;
    }
    setUsuario(JSON.parse(stored));
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    navegar("/login");
  };

  if (!usuario) return null;

  const rol = usuario.rol;
  const opciones = menus[rol] || menus.visita;

  return (
    <div className="fondo-tecnico" style={{ justifyContent: "flex-start", paddingTop: "60px" }}>
      <h1 className="titulo-neon" style={{ fontSize: "2rem" }}>Panel de Control</h1>
      <div className="caja-cyber" style={{ maxWidth: "450px" }}>
        <p style={{ color: "#38bdf8", textAlign: "center", margin: 0 }}>
          {usuario.correo} · <span style={{ color: "#4ade80", textTransform: "uppercase" }}>{rol}</span>
        </p>
        <hr style={{ borderColor: "#0ea5e9", width: "100%" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {opciones.map((op) => (
            <button key={op.path} className="btn-cyber" onClick={() => navegar(op.path)}>
              {op.label}
            </button>
          ))}
        </div>
        <button className="btn-fantasma" onClick={cerrarSesion}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
