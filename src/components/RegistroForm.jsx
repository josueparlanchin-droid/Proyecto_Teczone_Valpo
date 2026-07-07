import { useState } from "react";

function RegistroForm({ onGuardar }) {
  const [form, setForm] = useState({ correo: "", clave: "" });
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Limpiamos el error si el usuario vuelve a escribir
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validación de seguridad: 1 Mayúscula, 1 Número, mín 6 caracteres
    const regexSeguridad = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    
    if (!regexSeguridad.test(form.clave)) {
      setError("La contraseña debe tener al menos 6 caracteres, 1 mayúscula y 1 número.");
      return; // Detiene el envío
    }

    onGuardar(form);
  };

  return (
    <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%", maxWidth: "300px" }}>
      <input 
        name="correo" 
        type="email" 
        placeholder="tu@correo.com" 
        onChange={manejarCambio} 
        required 
        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #4ade80", backgroundColor: "#1e293b", color: "white" }}
      />
      <input 
        name="clave" 
        type="password" 
        placeholder="Contraseña segura" 
        onChange={manejarCambio} 
        required 
        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #4ade80", backgroundColor: "#1e293b", color: "white" }}
      />
      
      {/* Mensaje de error dinámico */}
      {error && <p style={{ color: "#ef4444", fontSize: "14px", margin: "0" }}>{error}</p>}
      
      <button type="submit" style={{ padding: "10px", backgroundColor: "#4ade80", color: "#0f172a", fontWeight: "bold", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        Registrarme
      </button>
    </form>
  );
}

export default RegistroForm;