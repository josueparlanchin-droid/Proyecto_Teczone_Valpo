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
    <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
      <h3 style={{ color: "white", textAlign: "center", margin: "0 0 10px 0" }}>Registro de Sistema</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          className="input-cyber"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={manejarCambio}
          required
          style={{ flex: 1 }}
        />
        <input
          className="input-cyber"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={manejarCambio}
          required
          style={{ flex: 1 }}
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
      />
      <input
        className="input-cyber"
        name="clave"
        type="password"
        placeholder="Contraseña (mín 8 caracteres)"
        value={form.clave}
        onChange={manejarCambio}
        required
      />

      {error && <p style={{ color: "#ef4444", fontSize: "13px", margin: "0", textAlign: "center" }}>{error}</p>}

      <button className="btn-cyber" type="submit">Registrar</button>
    </form>
  );
}

export default RegistroForm;
