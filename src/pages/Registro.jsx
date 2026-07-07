import { useNavigate } from "react-router-dom";
import RegistroForm from "../components/RegistroForm.jsx";

function Registro() {
  const navegar = useNavigate();

  const guardarUsuario = async (datos) => {
    alert("¡Cuenta segura creada con éxito!");
    navegar("/login"); 
  };

  const techBackground = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    backgroundImage: "radial-gradient(#334155 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    color: "#f8fafc",
    fontFamily: "sans-serif"
  };

  return (
    <div style={techBackground}>
      <h1 style={{ color: "#4ade80", textShadow: "0 0 10px #4ade80" }}>Nuevo Recluta - Teczone</h1>
      <div style={{ backgroundColor: "#1e293b", padding: "40px", borderRadius: "10px", border: "1px solid #334155", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
        <RegistroForm onGuardar={guardarUsuario} />
        <button 
          onClick={() => navegar("/login")}
          style={{ marginTop: "15px", width: "100%", padding: "10px", background: "none", border: "1px solid #94a3b8", color: "#94a3b8", borderRadius: "5px", cursor: "pointer" }}
        >
          Ya tengo cuenta
        </button>
      </div>
    </div>
  );
}

export default Registro;