import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function GestionProductos() {
  const navegar = useNavigate();
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({ nombre: "", precio: "", categoria: "Computadoras", descripcion: "", imagen: "", stock: 0 });
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const esAdmin = usuario.rol === "administrador";

  useEffect(() => {
    if (!usuario.rol) return navegar("/login");
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const url = esAdmin ? "/productos/admin" : "/productos";
      const { data } = await api.get(url);
      setProductos(data.productos || data);
    } catch (err) {
      setError("Error al cargar productos");
    }
  };

  const manejarCambio = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editando) {
        await api.put(`/productos/${editando}`, form);
      } else {
        await api.post("/productos", form);
      }
      setForm({ nombre: "", precio: "", categoria: "Computadoras", descripcion: "", imagen: "", stock: 0 });
      setEditando(null);
      cargarProductos();
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al guardar");
    }
  };

  const editar = (p) => {
    setForm({ nombre: p.nombre, precio: p.precio, categoria: p.categoria, descripcion: p.descripcion || "", imagen: p.imagen || "", stock: p.stock || 0 });
    setEditando(p._id);
  };

  const eliminar = async (id) => {
    if (!confirm("¿Desactivar este producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      cargarProductos();
    } catch (err) {
      setError("Error al eliminar");
    }
  };

  const reactivar = async (id) => {
    try {
      await api.patch(`/productos/${id}/reactivar`);
      cargarProductos();
    } catch (err) {
      setError("Error al reactivar");
    }
  };

  const cancelar = () => {
    setForm({ nombre: "", precio: "", categoria: "Computadoras", descripcion: "", imagen: "", stock: 0 });
    setEditando(null);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", backgroundColor: "#0f172a", minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#4ade80" }}>{editando ? "Editar Producto" : "Agregar Producto"}</h2>
        <button onClick={() => navegar("/dashboard")} className="btn-fantasma" style={{ width: "auto", padding: "8px 20px" }}>Volver</button>
      </div>

      <form onSubmit={guardar} style={{ display: "flex", gap: "10px", flexWrap: "wrap", margin: "20px 0", padding: "20px", backgroundColor: "#1e293b", borderRadius: "8px" }}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambio} required className="input-cyber" style={{ flex: 1, minWidth: "200px" }} />
        <input name="precio" placeholder="Precio (ej: $150.000)" value={form.precio} onChange={manejarCambio} required className="input-cyber" style={{ width: "150px" }} />
        <select name="categoria" value={form.categoria} onChange={manejarCambio} className="input-cyber" style={{ width: "180px" }}>
          {["Computadoras", "Teclados", "Componentes"].map(c => <option key={c}>{c}</option>)}
        </select>
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={manejarCambio} className="input-cyber" style={{ flex: 1, minWidth: "200px" }} />
        <input name="imagen" placeholder="URL de la imagen" value={form.imagen} onChange={manejarCambio} className="input-cyber" style={{ flex: 1, minWidth: "200px" }} />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={manejarCambio} className="input-cyber" style={{ width: "100px" }} />
        <button type="submit" className="btn-cyber" style={{ width: "auto", padding: "12px 25px" }}>{editando ? "Actualizar" : "Guardar"}</button>
        {editando && <button type="button" onClick={cancelar} className="btn-fantasma" style={{ width: "auto", padding: "12px 25px" }}>Cancelar</button>}
      </form>

      {error && <p style={{ color: "#ef4444" }}>{error}</p>}

      <h3 style={{ color: "#38bdf8" }}>Productos</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "15px" }}>
        {productos.map((p) => (
          <div key={p._id} style={{
            backgroundColor: p.activo === false ? "#2d1b1b" : "#1e293b",
            padding: "15px", borderRadius: "8px",
            border: p.activo === false ? "1px solid #ef4444" : "1px solid #0ea5e9",
            opacity: p.activo === false ? 0.6 : 1,
          }}>
            {p.imagen && <img src={p.imagen} alt={p.nombre} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "4px", marginBottom: "10px" }} />}
            <h4 style={{ margin: "0 0 5px", color: "#4ade80" }}>{p.nombre}</h4>
            <p style={{ margin: "3px 0", fontSize: "14px", color: "#94a3b8" }}>{p.categoria} · {p.precio}</p>
            {p.descripcion && <p style={{ margin: "3px 0", fontSize: "13px", color: "#cbd5e1" }}>{p.descripcion}</p>}
            <p style={{ margin: "3px 0", fontSize: "13px", color: "#94a3b8" }}>Stock: {p.stock}</p>
            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              {esAdmin && (
                <>
                  <button onClick={() => editar(p)} style={{ padding: "5px 12px", backgroundColor: "#0ea5e9", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}>Editar</button>
                  {p.activo !== false ? (
                    <button onClick={() => eliminar(p._id)} style={{ padding: "5px 12px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}>Desactivar</button>
                  ) : (
                    <button onClick={() => reactivar(p._id)} style={{ padding: "5px 12px", backgroundColor: "#4ade80", color: "#0f172a", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}>Reactivar</button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GestionProductos;
