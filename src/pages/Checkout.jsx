import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext.jsx";
import api from "../api/axios.js";

function Checkout() {
  const navegar = useNavigate();
  const { items, totalPrecio, limpiar } = useCarrito();
  const [form, setForm] = useState({ direccion: "", telefono: "", comuna: "", metodoPago: "transferencia" });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
  const [errorRed, setErrorRed] = useState(false);

  const formatearPrecio = (n) => "$" + n.toLocaleString("es-CL");

  const comunas = [
    "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana",
    "Quillota", "San Antonio", "Los Andes", "San Felipe",
    "La Concña", "Limache", "Casablanca", "Juan Fernández",
  ];

  const validar = () => {
    const e = {};
    if (!form.direccion || form.direccion.length < 5) e.direccion = "La dirección debe tener al menos 5 caracteres";
    if (!form.telefono || !/^[0-9]{9}$/.test(form.telefono)) e.telefono = "El teléfono debe tener 9 dígitos";
    if (!form.comuna) e.comuna = "Selecciona una comuna";
    if (!form.metodoPago) e.metodoPago = "Selecciona un método de pago";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor("");
    setErrorRed(false);
    if (!validar()) return;

    setCargando(true);
    try {
      const payload = {
        items: items.map((i) => ({ productoId: i._id, nombre: i.nombre, precio: 0, cantidad: i.cantidad })),
        direccion: form.direccion,
        telefono: form.telefono,
        comuna: form.comuna,
        metodoPago: form.metodoPago,
      };

      const { data } = await api.post("/pedidos", payload);
      limpiar();
      navegar("/pedido-confirmado", { state: { pedido: data.pedido } });
    } catch (err) {
      console.error("Error al crear pedido:", err);
      if (!err.response) {
        setErrorServidor("No se pudo conectar al servidor. Verifica que npm run server esté corriendo.");
        setErrorRed(true);
      } else {
        const msg = err.response?.data?.mensaje || "Error al crear el pedido";
        const detalles = err.response?.data?.errores;
        setErrorServidor(detalles ? `${msg}: ${detalles.join(", ")}` : msg);
      }
    } finally {
      setCargando(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-pagina">
        <header className="checkout-header">
          <h2 className="checkout-logo" onClick={() => navegar("/catalogo")}>Teczone</h2>
          <span className="checkout-titulo-header">Checkout</span>
        </header>
        <div className="checkout-vacio">
          <p>No hay productos en el carrito</p>
          <button className="btn-cyber" onClick={() => navegar("/catalogo")} style={{ width: "auto", padding: "12px 30px" }}>
            Ir al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-pagina">
      <header className="checkout-header">
        <h2 className="checkout-logo" onClick={() => navegar("/catalogo")}>Teczone</h2>
        <span className="checkout-titulo-header">Checkout</span>
      </header>

      <div className="checkout-contenido">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h3 className="checkout-seccion">Datos de envío</h3>

          <div className="checkout-campo">
            <label htmlFor="direccion" className="checkout-label">Dirección *</label>
            <input
              id="direccion"
              type="text"
              className={`checkout-input ${errores.direccion ? "error" : ""}`}
              placeholder="Av. España 1234"
              value={form.direccion}
              onChange={(e) => handleChange("direccion", e.target.value)}
              autoComplete="street-address"
            />
            {errores.direccion && <span className="checkout-error">{errores.direccion}</span>}
          </div>

          <div className="checkout-campo">
            <label htmlFor="telefono" className="checkout-label">Teléfono *</label>
            <input
              id="telefono"
              type="tel"
              className={`checkout-input ${errores.telefono ? "error" : ""}`}
              placeholder="912345678"
              value={form.telefono}
              onChange={(e) => handleChange("telefono", e.target.value)}
              autoComplete="tel"
            />
            {errores.telefono && <span className="checkout-error">{errores.telefono}</span>}
          </div>

          <div className="checkout-campo">
            <label htmlFor="comuna" className="checkout-label">Comuna *</label>
            <select
              id="comuna"
              className={`checkout-select ${errores.comuna ? "error" : ""}`}
              value={form.comuna}
              onChange={(e) => handleChange("comuna", e.target.value)}
            >
              <option value="">Selecciona una comuna</option>
              {comunas.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errores.comuna && <span className="checkout-error">{errores.comuna}</span>}
          </div>

          <h3 className="checkout-seccion">Método de pago</h3>

          <div className="checkout-metodos">
            {[
              { id: "transferencia", label: "Transferencia bancaria", icon: "🏦" },
              { id: "webpay", label: "Webpay", icon: "💳" },
              { id: "efectivo", label: "Efectivo", icon: "💵" },
            ].map((m) => (
              <label key={m.id} className={`checkout-metodo ${form.metodoPago === m.id ? "activo" : ""}`}>
                <input
                  type="radio"
                  name="metodoPago"
                  value={m.id}
                  checked={form.metodoPago === m.id}
                  onChange={(e) => handleChange("metodoPago", e.target.value)}
                  className="checkout-radio"
                />
                <span className="checkout-metodo-icon">{m.icon}</span>
                <span className="checkout-metodo-label">{m.label}</span>
              </label>
            ))}
          </div>
          {errores.metodoPago && <span className="checkout-error">{errores.metodoPago}</span>}

          {errorServidor && (
            <div className="checkout-error-servidor">
              {errorServidor}
              {errorRed && (
                <button type="button" className="checkout-reintentar" onClick={handleSubmit}>
                  Reintentar
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            className="checkout-confirmar-btn"
            disabled={cargando}
          >
            {cargando ? "Procesando..." : "Confirmar compra"}
          </button>
        </form>

        <aside className="checkout-resumen">
          <h3 className="checkout-resumen-titulo">Resumen del pedido</h3>
          <div className="checkout-resumen-items">
            {items.map((item) => (
              <div key={item._id} className="checkout-resumen-item">
                <div>
                  <p className="checkout-resumen-nombre">{item.nombre}</p>
                  <p className="checkout-resumen-cant">x{item.cantidad}</p>
                </div>
                <p className="checkout-resumen-subtotal">
                  {formatearPrecio((parseFloat(item.precio.replace(/[^0-9]/g, "")) || 0) * item.cantidad)}
                </p>
              </div>
            ))}
          </div>
          <div className="checkout-resumen-total">
            <span>Total</span>
            <span>{formatearPrecio(totalPrecio)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
