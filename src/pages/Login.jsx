import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import api from "../api/axios.js";

function Login() {
  const navegar = useNavigate();
  const [error, setError] = useState("");

  const iniciarSesion = async (datos) => {
    try {
      setError("");
      const { data } = await api.post("/login", datos);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      if (data.usuario.rol === "administrador" || data.usuario.rol === "botiquero") {
        navegar("/dashboard");
      } else {
        navegar("/catalogo");
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al iniciar sesión");
    }
  };

  return (
    <div className="fondo-tecnico">
      <h1 className="titulo-neon">Teczone Valpo</h1>
      <div className="caja-cyber">
        <LoginForm onLogin={iniciarSesion} />
        {error && <p className="form-error">{error}</p>}
        <button className="btn-fantasma" onClick={() => navegar("/registro")}>
          Crear cuenta nueva
        </button>
      </div>
    </div>
  );
}

export default Login;
