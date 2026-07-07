import { useState } from "react";

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ correo: "", clave: "" });

  const manejarCambio = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const manejarEnvio = (e) => {
    e.preventDefault();
    onLogin(form);
  };

  return (
    <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <h3 style={{ color: "white", textAlign: "center", margin: "0 0 10px 0" }}>Iniciar Sesión</h3>
      <input 
        className="input-cyber" 
        name="correo" 
        type="email" 
        placeholder="Usuario / Correo" 
        onChange={manejarCambio} 
        required 
      />
      <input 
        className="input-cyber" 
        name="clave" 
        type="password" 
        placeholder="Contraseña" 
        onChange={manejarCambio} 
        required 
      />
      <button className="btn-cyber" type="submit">Autenticar</button>
    </form>
  );
}

export default LoginForm;