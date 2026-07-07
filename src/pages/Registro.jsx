import { useNavigate } from "react-router-dom";
import RegistroForm from "../components/RegistroForm.jsx";

function Registro() {
  const navegar = useNavigate();

  const guardarUsuario = async (datos) => {
    alert("¡Protocolo de registro exitoso!");
    navegar("/login"); 
  };

  return (
    <div className="fondo-tecnico">
      <h1 className="titulo-neon">Nuevo Recluta</h1>
      <div className="caja-cyber">
        <RegistroForm onGuardar={guardarUsuario} />
        <button className="btn-fantasma" onClick={() => navegar("/login")}>
          Ya tengo acceso
        </button>
      </div>
    </div>
  );
}

export default Registro;