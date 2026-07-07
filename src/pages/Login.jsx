import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";

function Login() {
  const navegar = useNavigate();

  const iniciarSesion = async (datos) => {
    console.log("Iniciando sesión:", datos);
    navegar("/catalogo"); 
  };

  return (
    <div className="fondo-tecnico">
      <h1 className="titulo-neon">Teczone Valpo</h1>
      <div className="caja-cyber">
        <LoginForm onLogin={iniciarSesion} />
        <button className="btn-fantasma" onClick={() => navegar("/registro")}>
          Crear cuenta nueva
        </button>
      </div>
    </div>
  );
}

export default Login;