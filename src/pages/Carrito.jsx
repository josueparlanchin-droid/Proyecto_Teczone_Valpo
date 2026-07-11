import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";

function Carrito() {
  const navegar = useNavigate();
  const { items, quitar, cambiarCantidad, limpiar, totalPrecio } = useCarrito();

  const formatearPrecio = (n) => "$" + n.toLocaleString("es-CL");

  return (
    <div className="carrito-pagina">
      <header className="carrito-header">
        <h2 className="carrito-logo" onClick={() => navegar("/catalogo")}>Teczone</h2>
        <span className="carrito-titulo-header">🛒 Carrito</span>
      </header>

      <div className="carrito-contenido">
        <div className="carrito-top">
          <h2 className="carrito-titulo">Tu Carrito ({items.length} productos)</h2>
          {items.length > 0 && (
            <button onClick={limpiar} className="carrito-vaciar" aria-label="Vaciar carrito">
              Vaciar carrito
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="carrito-vacio">
            <p className="carrito-vacio-texto">Tu carrito está vacío</p>
            <button className="btn-cyber" onClick={() => navegar("/catalogo")} style={{ width: "auto", padding: "12px 30px" }}>
              Ir al catálogo
            </button>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item._id} className="carrito-item">
                {item.imagen && <img src={item.imagen} alt={item.nombre} className="carrito-item-img" />}
                <div className="carrito-item-info">
                  <h4 className="carrito-item-nombre">{item.nombre}</h4>
                  <p className="carrito-item-cat">{item.categoria}</p>
                  <p className="carrito-item-precio">{item.precio}</p>
                </div>
                <div className="carrito-item-controles">
                  <div className="carrito-item-cantidad">
                    <button onClick={() => cambiarCantidad(item._id, item.cantidad - 1)} className="carrito-cant-btn" aria-label="Reducir cantidad">-</button>
                    <span className="carrito-cant-num">{item.cantidad}</span>
                    <button onClick={() => cambiarCantidad(item._id, item.cantidad + 1)} className="carrito-cant-btn" aria-label="Aumentar cantidad">+</button>
                  </div>
                  <p className="carrito-item-subtotal">
                    {formatearPrecio((parseFloat(item.precio.replace(/[^0-9]/g, "")) || 0) * item.cantidad)}
                  </p>
                  <button onClick={() => quitar(item._id)} className="carrito-item-quitar" aria-label={`Eliminar ${item.nombre} del carrito`}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <div className="carrito-total">
              <p className="carrito-total-texto">Total productos: {items.reduce((s, i) => s + i.cantidad, 0)}</p>
              <h2 className="carrito-total-precio">Total: {formatearPrecio(totalPrecio)}</h2>
              <button className="carrito-pagar" aria-label="Proceder al pago">
                Proceder al pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Carrito;
