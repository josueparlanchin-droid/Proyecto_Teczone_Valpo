import { useState } from "react";

function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ correo: "", clave: "" });

  const manejarCambio = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const manejarEnvio = (e) => {
    e.preventDefault();
    onLogin(form);
  };

  return (
    <form onSubmit={manejarEnvio} className="auth-form" aria-label="Formulario de inicio de sesión">
      <h3 className="auth-form-titulo">Iniciar Sesión</h3>
      <input
        className="input-cyber"
        name="correo"
        type="email"
        placeholder="Correo electrónico"
        onChange={manejarCambio}
        required
        aria-label="Correo electrónico"
        autoComplete="email"
      />
      <input
        className="input-cyber"
        name="clave"
        type="password"
        placeholder="Contraseña"
        onChange={manejarCambio}
        required
        aria-label="Contraseña"
        autoComplete="current-password"
      />
      <button className="btn-cyber" type="submit">Autenticar</button>
    </form>
  );
}

export default LoginForm;
