import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";

function Carrito() {
  const navegar = useNavigate();
  const { items, quitar, cambiarCantidad, limpiar, totalPrecio } = useCarrito();

  const formatearPrecio = (n) => "$" + n.toLocaleString("es-CL");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", backgroundColor: "#0f172a", color: "white" }}>
        <h2 style={{ margin: 0, color: "#4ade80", cursor: "pointer" }} onClick={() => navegar("/catalogo")}>Teczone</h2>
        <span style={{ color: "#38bdf8" }}>🛒 Carrito</span>
      </header>

      <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#0f172a" }}>Tu Carrito ({items.length} productos)</h2>
          {items.length > 0 && (
            <button onClick={limpiar} style={{ padding: "8px 15px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Vaciar carrito
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "18px", color: "#64748b" }}>Tu carrito está vacío</p>
            <button className="btn-cyber" onClick={() => navegar("/catalogo")} style={{ width: "auto", padding: "12px 30px", marginTop: "10px" }}>
              Ir al catálogo
            </button>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={item._id} style={{ display: "flex", gap: "15px", alignItems: "center", backgroundColor: "white", padding: "15px", borderRadius: "8px", marginBottom: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                {item.imagen && <img src={item.imagen} alt={item.nombre} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }} />}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px", color: "#0f172a" }}>{item.nombre}</h4>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{item.categoria}</p>
                  <p style={{ margin: "5px 0 0", fontWeight: "bold", color: "#4ade80" }}>{item.precio}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button onClick={() => cambiarCantidad(item._id, item.cantidad - 1)} style={{ padding: "5px 10px", backgroundColor: "#e2e8f0", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>-</button>
                  <span style={{ fontWeight: "bold", minWidth: "30px", textAlign: "center" }}>{item.cantidad}</span>
                  <button onClick={() => cambiarCantidad(item._id, item.cantidad + 1)} style={{ padding: "5px 10px", backgroundColor: "#e2e8f0", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>+</button>
                </div>
                <p style={{ fontWeight: "bold", minWidth: "100px", textAlign: "right", color: "#0f172a" }}>
                  {formatearPrecio((parseFloat(item.precio.replace(/[^0-9]/g, "")) || 0) * item.cantidad)}
                </p>
                <button onClick={() => quitar(item._id)} style={{ padding: "5px 10px", backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}>
                  ✕
                </button>
              </div>
            ))}
            <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", marginTop: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "right" }}>
              <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>Total productos: {items.reduce((s, i) => s + i.cantidad, 0)}</p>
              <h2 style={{ color: "#0f172a", margin: "10px 0" }}>Total: {formatearPrecio(totalPrecio)}</h2>
              <button style={{ padding: "12px 30px", backgroundColor: "#4ade80", color: "#0f172a", fontWeight: "bold", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
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
