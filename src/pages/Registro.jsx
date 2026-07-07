import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import RegistroForm from "../components/RegistroForm.jsx";

function Registro() {
  const navegar = useNavigate();

  const guardarUsuario = async (datos) => {
    try {
      // Aquí enviaremos los datos al backend más adelante
      console.log("Datos a enviar:", datos);
      alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
      navegar("/login"); // Te manda a la pantalla de login
    } catch (error) {
      alert("Error al registrar");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Bienvenidos a Teczone Valpo</h1>
      <RegistroForm onGuardar={guardarUsuario} />
      <button onClick={() => navegar("/login")}>Ya tengo cuenta</button>
    </div>
  );
}

export default Registro;