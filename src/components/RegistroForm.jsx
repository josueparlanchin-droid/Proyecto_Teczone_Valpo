import { useState } from "react";

function RegistroForm({ onGuardar }) {
  const [form, setForm] = useState({ correo: "", clave: "" });
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    // Validación: 1 Mayúscula, 1 Número, mín 6 caracteres
    const regexSeguridad = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    
    if (!regexSeguridad.test(form.clave)) {
      setError("Requiere 6 caracteres, 1 mayúscula y 1 número.");
      return; 
    }
    onGuardar(form);
  };

  return (
    <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <h3 style={{ color: "white", textAlign: "center", margin: "0 0 10px 0" }}>Registro de Sistema</h3>
      <input 
        className="input-cyber" 
        name="correo" 
        type="email" 
        placeholder="Nuevo Correo" 
        onChange={manejarCambio} 
        required 
      />
      <input 
        className="input-cyber" 
        name="clave" 
        type="password" 
        placeholder="Contraseña Segura" 
        onChange={manejarCambio} 
        required 
      />
      
      {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: "0", textAlign: "center" }}>{error}</p>}
      
      <button className="btn-cyber" type="submit">Registrar</button>
    </form>
  );
}

export default RegistroForm;