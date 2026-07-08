import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegistroForm from "../components/RegistroForm.jsx";
import api from "../api/axios.js";

function Registro() {
  const navegar = useNavigate();
  const [error, setError] = useState("");

  const guardarUsuario = async (datos) => {
    try {
      setError("");
      const { data } = await api.post("/registro", datos);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      alert("¡Registro exitoso!");
      navegar("/dashboard");
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al registrarse");
    }
  };

  return (
    <div className="fondo-tecnico">
      <h1 className="titulo-neon">Nuevo Recluta</h1>
      <div className="caja-cyber">
        <RegistroForm onGuardar={guardarUsuario} />
        {error && <p style={{ color: "#ef4444", fontSize: "13px", textAlign: "center", margin: 0 }}>{error}</p>}
        <button className="btn-fantasma" onClick={() => navegar("/login")}>
          Ya tengo acceso
        </button>
      </div>
    </div>
  );
}

export default Registro;
