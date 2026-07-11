import { useState } from "react";

function RegistroForm({ onGuardar }) {
  const [form, setForm] = useState({ nombre: "", apellido: "", correo: "", clave: "" });
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    if (!form.apellido.trim()) {
      setError("El apellido es obligatorio");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      setError("Formato de correo inválido");
      return;
    }
    if (form.clave.length < 8) {
      setError("La clave debe tener al menos 8 caracteres");
      return;
    }

    onGuardar(form);
  };

  return (
    <form onSubmit={manejarEnvio} className="auth-form" aria-label="Formulario de registro">
      <h3 className="auth-form-titulo">Registro de Sistema</h3>
      <div className="auth-form-fila">
        <input
          className="input-cyber"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={manejarCambio}
          required
          aria-label="Nombre"
        />
        <input
          className="input-cyber"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={manejarCambio}
          required
          aria-label="Apellido"
        />
      </div>
      <input
        className="input-cyber"
        name="correo"
        type="email"
        placeholder="Correo electrónico"
        value={form.correo}
        onChange={manejarCambio}
        required
        aria-label="Correo electrónico"
        autoComplete="email"
      />
      <input
        className="input-cyber"
        name="clave"
        type="password"
        placeholder="Contraseña (mín 8 caracteres)"
        value={form.clave}
        onChange={manejarCambio}
        required
        aria-label="Contraseña"
        autoComplete="new-password"
      />

      {error && <p className="form-error">{error}</p>}

      <button className="btn-cyber" type="submit">Registrar</button>
    </form>
  );
}

export default RegistroForm;
