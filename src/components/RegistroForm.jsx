import { useState } from "react";

function RegistroForm({ onGuardar }) {
  const [form, setForm] = useState({ correo: "", clave: "" });

  const manejarCambio = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const manejarEnvio = (e) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <form onSubmit={manejarEnvio}>
      <h3>Crear Cuenta Nueva</h3>
      <input name="correo" type="email" placeholder="Correo" onChange={manejarCambio} required />
      <input name="clave" type="password" placeholder="Contraseña" onChange={manejarCambio} required />
      <button type="submit">Registrarme</button>
    </form>
  );
}

export default RegistroForm;