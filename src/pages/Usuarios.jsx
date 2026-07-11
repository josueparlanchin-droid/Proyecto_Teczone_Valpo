import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const roles = ["visita", "cliente", "botiquero", "administrador"];

function Usuarios() {
  const navegar = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const usuarioActual = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const { data } = await api.get("/usuarios");
      setUsuarios(data);
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al cargar usuarios");
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    setError("");
    setExito("");
    try {
      const { data } = await api.patch(`/usuarios/${id}/rol`, { rol: nuevoRol });
      setExito(data.mensaje);
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al cambiar rol");
    }
  };

  const toggleActivo = async (id) => {
    setError("");
    setExito("");
    try {
      const { data } = await api.patch(`/usuarios/${id}/activo`);
      setExito(data.mensaje);
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al cambiar estado");
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const colorRol = (rol) => {
    const colores = {
      administrador: "#ef4444",
      botiquero: "#f59e0b",
      cliente: "#4ade80",
      visita: "#94a3b8",
    };
    return colores[rol] || "#94a3b8";
  };

  return (
    <div className="gestion-pagina">
      <div className="gestion-top">
        <h2 className="gestion-titulo">Gestión de Usuarios</h2>
        <button onClick={() => navegar("/dashboard")} className="gestion-volver">Volver</button>
      </div>

      {error && <p className="gestion-error">{error}</p>}
      {exito && <p style={{ color: "#4ade80", margin: "10px 0" }}>{exito}</p>}

      <p style={{ color: "#94a3b8", margin: "0 0 20px 0", fontSize: "14px" }}>
        Total: {usuarios.length} usuarios registrados
      </p>

      <div className="gestion-grid">
        {usuarios.map((u) => (
          <div key={u._id} className={`gestion-card ${u.activo === false ? "inactiva" : ""}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h4 className="gestion-card-nombre">
                  {u.nombre || "Sin nombre"} {u.apellido || ""}
                </h4>
                <p className="gestion-card-meta">{u.correo}</p>
              </div>
              <span style={{
                padding: "3px 10px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: "bold",
                color: "white",
                backgroundColor: colorRol(u.rol),
                textTransform: "uppercase",
              }}>
                {u.rol}
              </span>
            </div>

            <p className="gestion-card-stock">
              Registrado: {formatearFecha(u.createdAt)}
            </p>

            <div className="gestion-card-acciones" style={{ flexDirection: "column", gap: "8px" }}>
              {u._id !== usuarioActual.id && (
                <>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <label style={{ color: "#94a3b8", fontSize: "13px" }}>Rol:</label>
                    <select
                      value={u.rol}
                      onChange={(e) => cambiarRol(u._id, e.target.value)}
                      className="input-cyber"
                      style={{ flex: 1, padding: "6px 8px", fontSize: "13px" }}
                      aria-label={`Cambiar rol de ${u.nombre}`}
                    >
                      {roles.map((r) => (
                        <option key={r} value={r} style={{ backgroundColor: "#1e293b" }}>
                          {r.charAt(0).toUpperCase() + r.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => toggleActivo(u._id)}
                    className={u.activo !== false ? "gestion-btn-desactivar" : "gestion-btn-reactivar"}
                    style={{ width: "100%" }}
                    aria-label={u.activo !== false ? `Desactivar ${u.nombre}` : `Activar ${u.nombre}`}
                  >
                    {u.activo !== false ? "Desactivar" : "Activar"}
                  </button>
                </>
              )}
              {u._id === usuarioActual.id && (
                <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>Tú (este usuario)</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Usuarios;
