import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCarrito } from "../context/CarritoContext.jsx";
import ProfileMenu from "../components/ProfileMenu.jsx";

function Catalogo() {
  const navegar = useNavigate();
  const { agregar, totalItems } = useCarrito();
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, [categoriaActiva, busqueda]);

  const cargarProductos = async () => {
    try {
      const params = { limit: 50 };
      if (busqueda) params.search = busqueda;
      if (categoriaActiva !== "Todas") params.categoria = categoriaActiva;
      const { data } = await api.get("/productos", { params });
      setProductos(data.productos || data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setCargando(false);
    }
  };

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const estaLogueado = !!localStorage.getItem("token");

  const seleccionarCategoria = (cat) => {
    setCategoriaActiva(cat);
    setSidebarAbierto(false);
  };

  return (
    <div className="catalogo-layout">

      <header className="catalogo-header">
        <h2 className="catalogo-logo" onClick={() => navegar("/catalogo")}>Teczone</h2>

        <button className="catalogo-menu-btn" onClick={() => setSidebarAbierto(!sidebarAbierto)} aria-label="Abrir categorías">
          ☰
        </button>

        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="catalogo-buscar"
          aria-label="Buscar productos"
        />
        <div className="catalogo-header-acciones">
          <button onClick={() => navegar("/carrito")} className="catalogo-carrito-btn" aria-label="Ver carrito">
            🛒
            {totalItems > 0 && (
              <span className="catalogo-carrito-badge">{totalItems}</span>
            )}
          </button>
          {estaLogueado ? (
            <ProfileMenu />
          ) : (
            <button onClick={() => navegar("/login")} className="catalogo-login-btn">
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      {sidebarAbierto && <div className="catalogo-overlay" onClick={() => setSidebarAbierto(false)} />}

      <div className="catalogo-cuerpo">
        <aside className={`catalogo-sidebar ${sidebarAbierto ? "abierto" : ""}`}>
          <h3 className="catalogo-sidebar-titulo">Categorías</h3>
          <ul className="catalogo-sidebar-lista">
            {["Todas", "Computadoras", "Teclados", "Mouse", "Componentes", "Monitores", "Audio", "Accesorios", "Smartphones", "Wearables", "Audifonos", "Cargadores"].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => seleccionarCategoria(cat)}
                  className={`catalogo-cat-btn ${categoriaActiva === cat ? "activa" : ""}`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="catalogo-main">
          <h2 className="catalogo-titulo">
            Catálogo {categoriaActiva !== "Todas" && `: ${categoriaActiva}`}
          </h2>

          <div className="catalogo-grid">
            {cargando ? (
              <p className="catalogo-vacio">Cargando productos...</p>
            ) : productos.length > 0 ? (
              productos.map(prod => (
                <div key={prod._id} className="catalogo-card">
                  <div>
                    {prod.imagen && <img src={prod.imagen} alt={prod.nombre} className="catalogo-card-img" />}
                    <span className="catalogo-card-cat">{prod.categoria}</span>
                    <h3 className="catalogo-card-nombre">{prod.nombre}</h3>
                    {prod.descripcion && <p className="catalogo-card-desc">{prod.descripcion}</p>}
                    <p className="catalogo-card-precio">{prod.precio}</p>
                    <p className="catalogo-card-stock">Stock: {prod.stock}</p>
                  </div>
                  <button
                    onClick={() => prod.stock > 0 && agregar(prod)}
                    className={`catalogo-card-btn ${prod.stock <= 0 ? "catalogo-card-agotado" : ""}`}
                    disabled={prod.stock <= 0}
                    aria-label={prod.stock > 0 ? `Agregar ${prod.nombre} al carrito` : `${prod.nombre} agotado`}
                  >
                    {prod.stock > 0 ? "Añadir al carrito" : "Agotado"}
                  </button>
                </div>
              ))
            ) : (
              <p className="catalogo-vacio">No se encontraron productos para "{busqueda}".</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Catalogo;
