import { useState } from "react";
import { useNavigate } from "react-router-dom";

const menus = {
  administrador: [
    { label: "Catálogo", path: "/catalogo" },
    { label: "Gestionar Productos", path: "/gestion-productos" },
    { label: "Gestionar Pedidos", path: "/gestion-pedidos" },
    { label: "Usuarios", path: "/usuarios" },
  ],
  vendedor: [
    { label: "Catálogo", path: "/catalogo" },
    { label: "Gestionar Productos", path: "/gestion-productos" },
    { label: "Gestionar Pedidos", path: "/gestion-pedidos" },
  ],
  cliente: [
    { label: "Catálogo", path: "/catalogo" },
    { label: "Mis Pedidos", path: "/mis-pedidos" },
  ],
  visita: [
    { label: "Catálogo", path: "/catalogo" },
  ],
};

function Dashboard() {
  const navegar = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const cerrarSesion = () => {
    localStorage.clear();
    navegar("/login");
  };

  const rol = usuario.rol;
  const opciones = menus[rol] || menus.visita;

  return (
    <div className="fondo-tecnico" style={{ justifyContent: "flex-start", paddingTop: "60px" }}>
      <h1 className="titulo-neon" style={{ fontSize: "2rem" }}>Panel de Control</h1>
      <div className="caja-cyber" style={{ maxWidth: "450px" }}>
        <p className="dashboard-rol">
          {usuario.correo} · <span className="dashboard-rol-badge">{rol}</span>
        </p>
        <hr className="dashboard-divider" />
        <div className="dashboard-botones">
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
