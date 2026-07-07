import { useState } from "react";

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ correo: "", clave: "" });

  const manejarCambio = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const manejarEnvio = (e) => {
    e.preventDefault();
    onLogin(form);
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h3>Iniciar Sesión</h3>
      <input name="correo" type="email" placeholder="Correo" onChange={manejarCambio} required />
      <input name="clave" type="password" placeholder="Contraseña" onChange={manejarCambio} required />
      <button type="submit">Entrar a Teczone</button>
    </form>
  );
}

export default LoginForm;