import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Catalogo() {
  const navegar = useNavigate();
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  const cerrarSesion = () => navegar("/login");

  // Base de datos simulada (luego esto vendrá de MongoDB)
  const productos = [
    { id: 1, nombre: "Notebook Gamer ASUS ROG", precio: "$850.000", categoria: "Computadoras" },
    { id: 2, nombre: "Teclado Mecánico Redragon", precio: "$45.000", categoria: "Teclados" },
    { id: 3, nombre: "Tarjeta Gráfica RTX 4060", precio: "$350.000", categoria: "Componentes" },
    { id: 4, nombre: "PC Armado Intel i7", precio: "$600.000", categoria: "Computadoras" },
    { id: 5, nombre: "Teclado Keychron K2", precio: "$90.000", categoria: "Teclados" },
  ];

  // Lógica de filtrado doble (por categoría y por la barra de búsqueda)
  const productosFiltrados = productos.filter(prod => {
    const coincideCategoria = categoriaActiva === "Todas" || prod.categoria === categoriaActiva;
    const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f1f5f9", fontFamily: "sans-serif" }}>
      
      {/* 1. BARRA SUPERIOR (Buscador) */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", backgroundColor: "#0f172a", color: "white" }}>
        <h2 style={{ margin: 0, color: "#4ade80" }}>Teczone</h2>
        <input 
          type="text" 
          placeholder="🔍 Buscar productos..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: "300px", padding: "8px", borderRadius: "5px", border: "none" }}
        />
        <button onClick={cerrarSesion} style={{ padding: "8px 15px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Salir
        </button>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        
        {/* 2. MENÚ LATERAL (Categorías) */}
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

        {/* 3. ZONA PRINCIPAL (Grilla de Productos) */}
        <main style={{ flex: 1, padding: "30px" }}>
          <h2 style={{ color: "#0f172a", marginTop: 0 }}>Catálogo: {categoriaActiva}</h2>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map(prod => (
                <div key={prod.id} style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "250px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b", textTransform: "uppercase" }}>{prod.categoria}</span>
                    <h3 style={{ margin: "10px 0" }}>{prod.nombre}</h3>
                    <p style={{ fontSize: "20px", fontWeight: "bold", color: "#4ade80", margin: "10px 0" }}>{prod.precio}</p>
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