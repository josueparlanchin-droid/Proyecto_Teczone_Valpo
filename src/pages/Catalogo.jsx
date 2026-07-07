import { useNavigate } from "react-router-dom";

function Catalogo() {
  const navegar = useNavigate();

  const cerrarSesion = () => {
    alert("Sesión cerrada");
    navegar("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Catálogo de Componentes</h1>
        <button onClick={cerrarSesion}>Cerrar Sesión</button>
      </header>
      
      <div>
        {/* Aquí luego cargaremos los productos desde MongoDB */}
        <div style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
          <h3>Teclado Mecánico Redragon</h3>
          <p>Precio: $45.000</p>
          <button>Comprar</button>
        </div>
        <div style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
          <h3>Tarjeta Gráfica RTX 4060</h3>
          <p>Precio: $350.000</p>
          <button>Comprar</button>
        </div>
      </div>
    </div>
  );
}

export default Catalogo;