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
    <div className="gestion-pagina">
      <div className="gestion-top">
        <h2 className="gestion-titulo">{editando ? "Editar Producto" : "Agregar Producto"}</h2>
        <button onClick={() => navegar("/dashboard")} className="gestion-volver">Volver</button>
      </div>

      <form onSubmit={guardar} className="gestion-form">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambio} required className="input-cyber" />
        <input name="precio" placeholder="Precio (ej: $150.000)" value={form.precio} onChange={manejarCambio} required className="input-cyber" />
        <select name="categoria" value={form.categoria} onChange={manejarCambio} className="input-cyber">
          {["Computadoras", "Teclados", "Componentes"].map(c => <option key={c}>{c}</option>)}
        </select>
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={manejarCambio} className="input-cyber" />
        <input name="imagen" placeholder="URL de la imagen" value={form.imagen} onChange={manejarCambio} className="input-cyber" />
        <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={manejarCambio} className="input-cyber" />
        <div className="gestion-form-botones">
          <button type="submit" className="btn-cyber" style={{ width: "auto", padding: "12px 25px" }}>{editando ? "Actualizar" : "Guardar"}</button>
          {editando && <button type="button" onClick={cancelar} className="btn-fantasma" style={{ width: "auto", padding: "12px 25px", marginTop: 0 }}>Cancelar</button>}
        </div>
      </form>

      {error && <p className="gestion-error">{error}</p>}

      <h3 className="gestion-lista-titulo">Productos</h3>
      <div className="gestion-grid">
        {productos.map((p) => (
          <div key={p._id} className={`gestion-card ${p.activo === false ? "inactiva" : ""}`}>
            {p.imagen && <img src={p.imagen} alt={p.nombre} className="gestion-card-img" />}
            <h4 className="gestion-card-nombre">{p.nombre}</h4>
            <p className="gestion-card-meta">{p.categoria} · {p.precio}</p>
            {p.descripcion && <p className="gestion-card-desc">{p.descripcion}</p>}
            <p className="gestion-card-stock">Stock: {p.stock}</p>
            <div className="gestion-card-acciones">
              {esAdmin && (
                <>
                  <button onClick={() => editar(p)} className="gestion-btn-editar" aria-label={`Editar ${p.nombre}`}>Editar</button>
                  {p.activo !== false ? (
                    <button onClick={() => eliminar(p._id)} className="gestion-btn-desactivar" aria-label={`Desactivar ${p.nombre}`}>Desactivar</button>
                  ) : (
                    <button onClick={() => reactivar(p._id)} className="gestion-btn-reactivar" aria-label={`Reactivar ${p.nombre}`}>Reactivar</button>
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
