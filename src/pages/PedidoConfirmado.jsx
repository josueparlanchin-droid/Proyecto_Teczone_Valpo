import { useNavigate, useLocation } from "react-router-dom";

function PedidoConfirmado() {
  const navegar = useNavigate();
  const location = useLocation();
  const pedido = location.state?.pedido;

  const formatearPrecio = (n) => "$" + n.toLocaleString("es-CL");

  if (!pedido) {
    return (
      <div className="confirmado-pagina">
        <header className="confirmado-header">
          <h2 className="confirmado-logo" onClick={() => navegar("/catalogo")}>Teczone</h2>
        </header>
        <div className="confirmado-contenido">
          <p>No hay información del pedido</p>
          <button className="btn-cyber" onClick={() => navegar("/catalogo")} style={{ width: "auto", padding: "12px 30px" }}>
            Ir al catálogo
          </button>
        </div>
      </div>
    );
  }

  const metodoLabels = { transferencia: "Transferencia bancaria", webpay: "Webpay", efectivo: "Efectivo" };

  return (
    <div className="confirmado-pagina">
      <header className="confirmado-header">
        <h2 className="confirmado-logo" onClick={() => navegar("/catalogo")}>Teczone</h2>
      </header>

      <div className="confirmado-contenido">
        <div className="confirmado-icono">✓</div>
        <h2 className="confirmado-titulo">¡Pedido confirmado!</h2>
        <p className="confirmado-subtitulo">Tu pedido ha sido registrado exitosamente</p>

        <div className="confirmado-card">
          <div className="confirmado-card-header">
            <span className="confirmado-id">Pedido #{pedido._id.slice(-8).toUpperCase()}</span>
            <span className={`confirmado-estado confirmado-estado-${pedido.estado}`}>{pedido.estado}</span>
          </div>

          <div className="confirmado-detalles">
            <div className="confirmado-detalle">
              <span className="confirmado-detalle-label">Dirección</span>
              <span>{pedido.direccion}, {pedido.comuna}</span>
            </div>
            <div className="confirmado-detalle">
              <span className="confirmado-detalle-label">Teléfono</span>
              <span>{pedido.telefono}</span>
            </div>
            <div className="confirmado-detalle">
              <span className="confirmado-detalle-label">Pago</span>
              <span>{metodoLabels[pedido.metodoPago]}</span>
            </div>
          </div>

          <div className="confirmado-items">
            {pedido.items.map((item, i) => (
              <div key={i} className="confirmado-item">
                <span>{item.nombre} x{item.cantidad}</span>
                <span>{formatearPrecio(item.precio * item.cantidad)}</span>
              </div>
            ))}
          </div>

          <div className="confirmado-total">
            <span>Total pagado</span>
            <span>{formatearPrecio(pedido.total)}</span>
          </div>
        </div>

        <div className="confirmado-acciones">
          <button className="btn-cyber" onClick={() => navegar("/mis-pedidos")} style={{ width: "auto", padding: "12px 30px" }}>
            Ver mis pedidos
          </button>
          <button className="confirmado-seguir" onClick={() => navegar("/catalogo")}>
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  );
}

export default PedidoConfirmado;
