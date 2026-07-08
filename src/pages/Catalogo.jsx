import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

function Catalogo() {
  const navegar = useNavigate();
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

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

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "sans-serif" }}>

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", backgroundColor: "#0f172a", color: "white" }}>
        <h2 style={{ margin: 0, color: "#4ade80", cursor: "pointer" }} onClick={() => navegar("/dashboard")}>Teczone</h2>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: "300px", padding: "8px", borderRadius: "5px", border: "none" }}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          {estaLogueado ? (
            <button onClick={() => navegar("/dashboard")} style={{ padding: "8px 15px", backgroundColor: "#4ade80", color: "#0f172a", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
              Panel
            </button>
          ) : (
            <button onClick={() => navegar("/login")} style={{ padding: "8px 15px", backgroundColor: "#0ea5e9", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        <aside style={{ width: "200px", backgroundColor: "#1e293b", color: "white", padding: "20px" }}>
          <h3 style={{ borderBottom: "1px solid #334155", paddingBottom: "10px" }}>Categorías</h3>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            {["Todas", "Computadoras", "Teclados", "Componentes"].map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setCategoriaActiva(cat)}
                  style={{ width: "100%", textAlign: "left", padding: "10px", background: categoriaActiva === cat ? "#4ade80" : "transparent", color: categoriaActiva === cat ? "#0f172a" : "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main style={{ flex: 1, padding: "30px" }}>
          <h2 style={{ color: "#0f172a", marginTop: 0 }}>Catálogo {categoriaActiva !== "Todas" && `: ${categoriaActiva}`}</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {cargando ? (
              <p>Cargando productos...</p>
            ) : productos.length > 0 ? (
              productos.map(prod => (
                <div key={prod._id} style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "250px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>{prod.categoria}</span>
                    <h3 style={{ margin: "10px 0" }}>{prod.nombre}</h3>
                    {prod.descripcion && <p style={{ fontSize: "13px", color: "#64748b", margin: "5px 0" }}>{prod.descripcion}</p>}
                    <p style={{ fontSize: "20px", fontWeight: "bold", color: "#4ade80", margin: "10px 0" }}>{prod.precio}</p>
                    <p style={{ fontSize: "12px", color: "#94a3b8" }}>Stock: {prod.stock}</p>
                  </div>
                  <button style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Añadir al carrito
                  </button>
                </div>
              ))
            ) : (
              <p>No se encontraron productos para "{busqueda}".</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Catalogo;
