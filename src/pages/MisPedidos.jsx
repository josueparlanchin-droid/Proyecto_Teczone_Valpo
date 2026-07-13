import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function MisPedidos() {
  const navegar = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [expandido, setExpandido] = useState(null);

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
      const { data } = await api.get("/pedidos/mis");
      setPedidos(data);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
    } finally {
      setCargando(false);
    }
  };

  const toggleExpandir = (id) => {
    setExpandido(expandido === id ? null : id);
  };

  const cancelarPedido = async (id) => {
    if (!confirm("¿Estás seguro de cancelar este pedido? Se devolverá el stock.")) return;
    try {
      await api.patch(`/pedidos/${id}/cancelar`);
      cargarPedidos();
    } catch (err) {
      console.error("Error al cancelar pedido:", err);
    }
  };

  const fecha = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="pedidos-pagina">
      <header className="pedidos-header">
        <h2 className="pedidos-logo" onClick={() => navegar("/catalogo")}>Teczone</h2>
        <span className="pedidos-titulo-header">Mis Pedidos</span>
      </header>

      <div className="pedidos-contenido">
        <h2 className="pedidos-titulo">Mis Pedidos</h2>

        {cargando ? (
          <p className="pedidos-vacio">Cargando pedidos...</p>
        ) : pedidos.length === 0 ? (
          <div className="pedidos-vacio">
            <p>No tienes pedidos aún</p>
            <button className="btn-cyber" onClick={() => navegar("/catalogo")} style={{ width: "auto", padding: "12px 30px" }}>
              Ir al catálogo
            </button>
          </div>
        ) : (
          <div className="pedidos-lista">
            {pedidos.map((pedido) => (
              <div key={pedido._id} className={`pedidos-card ${expandido === pedido._id ? "expandido" : ""}`}>
                <div className="pedidos-card-header" onClick={() => toggleExpandir(pedido._id)}>
                  <div>
                    <span className="pedidos-id">Pedido #{pedido._id.slice(-8).toUpperCase()}</span>
                    <span className="pedidos-fecha">{fecha(pedido.createdAt)}</span>
                  </div>
                  <div className="pedidos-card-right">
                    <span className={`pedidos-estado pedidos-estado-${pedido.estado}`}>
                      {estadoLabels[pedido.estado]}
                    </span>
                    <span className="pedidos-total">{formatearPrecio(pedido.total)}</span>
                    <span className={`pedidos-flecha ${expandido === pedido._id ? "arriba" : ""}`}>▼</span>
                  </div>
                </div>

                {expandido === pedido._id && (
                  <div className="pedidos-card-detalles">
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

                    {pedido.estado === "pendiente" && (
                      <div className="pedidos-cancelar">
                        <button
                          className="pedidos-btn-cancelar"
                          onClick={() => cancelarPedido(pedido._id)}
                        >
                          Cancelar pedido
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisPedidos;
