import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";

function Login() {
  const navegar = useNavigate();

  const iniciarSesion = async (datos) => {
    console.log("Iniciando sesión con:", datos);
    navegar("/catalogo"); 
  };

  // Estilo de fondo tecnológico oscuro con cuadrícula
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
      <h1 style={{ color: "#4ade80", textShadow: "0 0 10px #4ade80" }}>Acceso - Teczone Valpo</h1>
      <div style={{ backgroundColor: "#1e293b", padding: "40px", borderRadius: "10px", border: "1px solid #334155", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
        <LoginForm onLogin={iniciarSesion} />
        <button 
          onClick={() => navegar("/registro")}
          style={{ marginTop: "15px", width: "100%", padding: "10px", background: "none", border: "1px solid #94a3b8", color: "#94a3b8", borderRadius: "5px", cursor: "pointer" }}
        >
          Crear cuenta nueva
        </button>
      </div>
    </div>
  );
}

export default Login;