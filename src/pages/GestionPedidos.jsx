import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function GestionPedidos() {
  const navegar = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [expandido, setExpandido] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const formatearPrecio = (n) => "$" + n.toLocaleString("es-CL");

  const estadoLabels = {
    pendiente: "Pendiente",
    pagado: "Pagado",
    enviado: "Enviado",
    entregado: "Entregado",
    cancelado: "Cancelado",
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const url = filtroEstado ? `/pedidos/admin?estado=${filtroEstado}` : "/pedidos/admin";
      const { data } = await api.get(url);
      setPedidos(data);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, [filtroEstado]);

  const cambiarEstado = async (id, nuevoEstado) => {
    setMensaje("");
    setError("");
    try {
      const { data } = await api.patch(`/pedidos/${id}/estado`, { estado: nuevoEstado });
      setMensaje(data.mensaje);
      cargarPedidos();
      setTimeout(() => setMensaje(""), 3000);
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al actualizar estado");
      setTimeout(() => setError(""), 3000);
    }
  };

  const toggleExpandir = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  const fecha = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="gestion-pagina">
      <div className="gestion-top">
        <h2 className="gestion-titulo">Gestionar Pedidos</h2>
        <button onClick={() => navegar("/dashboard")} className="gestion-volver">Volver</button>
      </div>

      {mensaje && <p className="gestion-exito">{mensaje}</p>}
      {error && <p className="gestion-error">{error}</p>}

      <div className="gestion-filtros">
        <label className="gestion-filtros-label">Filtrar por estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="input-cyber"
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pagado</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {cargando ? (
        <p className="gestion-cargando">Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <div className="gestion-vacio">
          <p>No hay pedidos{filtroEstado ? ` con estado "${filtroEstado}"` : ""}</p>
        </div>
      ) : (
        <div className="gestion-pedidos-lista">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className={`gestion-pedido-card ${expandido === pedido._id ? "expandido" : ""}`}>
              <div className="gestion-pedido-header" onClick={() => toggleExpandir(pedido._id)}>
                <div className="gestion-pedido-info">
                  <span className="gestion-pedido-id">Pedido #{pedido._id.slice(-8).toUpperCase()}</span>
                  <span className="gestion-pedido-fecha">{fecha(pedido.createdAt)}</span>
                  <span className="gestion-pedido-cliente">
                    {pedido.usuario?.nombre} {pedido.usuario?.apellido} — {pedido.usuario?.correo}
                  </span>
                </div>
                <div className="gestion-pedido-derecha">
                  <span className={`pedidos-estado pedidos-estado-${pedido.estado}`}>
                    {estadoLabels[pedido.estado]}
                  </span>
                  <span className="gestion-pedido-total">{formatearPrecio(pedido.total)}</span>
                  <span className={`pedidos-flecha ${expandido === pedido._id ? "arriba" : ""}`}>▼</span>
                </div>
              </div>

              {expandido === pedido._id && (
                <div className="gestion-pedido-detalles">
                  <div className="pedidos-info-grid">
                    <div className="pedidos-info-item">
                      <span className="pedidos-info-label">Dirección</span>
                      <span>{pedido.direccion}, {pedido.comuna}</span>
                    </div>
                    <div className="pedidos-info-item">
                      <span className="pedidos-info-label">Teléfono</span>
                      <span>{pedido.telefono}</span>
                    </div>
                    <div className="pedidos-info-item">
                      <span className="pedidos-info-label">Método de pago</span>
                      <span>{pedido.metodoPago}</span>
                    </div>
                  </div>

                  <div className="pedidos-items">
                    {pedido.items.map((item, i) => (
                      <div key={i} className="pedidos-item">
                        <span>{item.nombre} x{item.cantidad}</span>
                        <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="gestion-pedido-acciones">
                    <span className="gestion-pedido-acciones-label">Cambiar estado:</span>
                    <select
                      value={pedido.estado}
                      onChange={(e) => cambiarEstado(pedido._id, e.target.value)}
                      className="input-cyber"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="pagado">Pagado</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GestionPedidos;
