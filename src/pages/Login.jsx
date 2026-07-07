import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import LoginForm from "../components/LoginForm.jsx";

function Login() {
  const navegar = useNavigate();

  const iniciarSesion = async (datos) => {
    try {
      // Simulación de login exitoso
      console.log("Iniciando sesión con:", datos);
      alert("¡Bienvenido a la tienda!");
      navegar("/catalogo"); // Te manda a la tienda de tecnología
    } catch (error) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Acceso Clientes - Teczone</h1>
      <LoginForm onLogin={iniciarSesion} />
      <button onClick={() => navegar("/registro")}>Quiero registrarme</button>
    </div>
  );
}

export default Login;