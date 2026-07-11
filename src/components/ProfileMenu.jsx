import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProfileMenu() {
  const navegar = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem("userAvatar") || "");
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("La imagen debe ser menor a 500KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setAvatar(base64);
      localStorage.setItem("userAvatar", base64);
    };
    reader.readAsDataURL(file);
    setAbierto(false);
  };

  const quitarFoto = () => {
    setAvatar("");
    localStorage.removeItem("userAvatar");
    setAbierto(false);
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navegar("/login");
  };

  const iniciales = (usuario.nombre || "U").charAt(0).toUpperCase();

  return (
    <div className="profile-menu" ref={menuRef}>
      <button className="profile-avatar-btn" onClick={() => setAbierto(!abierto)} aria-label="Menú de perfil">
        {avatar ? (
          <img src={avatar} alt="Perfil" className="profile-avatar-img" />
        ) : (
          <span className="profile-avatar-inicial">{iniciales}</span>
        )}
      </button>

      {abierto && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            {avatar ? (
              <img src={avatar} alt="Perfil" className="profile-dropdown-avatar" />
            ) : (
              <span className="profile-dropdown-inicial">{iniciales}</span>
            )}
            <div>
              <p className="profile-dropdown-nombre">{usuario.nombre} {usuario.apellido}</p>
              <p className="profile-dropdown-rol">{usuario.rol}</p>
            </div>
          </div>

          <hr className="profile-dropdown-divider" />

          <button className="profile-dropdown-item" onClick={() => { navegar("/mis-pedidos"); setAbierto(false); }}>
            Mis Compras
          </button>

          <button className="profile-dropdown-item" onClick={() => inputRef.current.click()}>
            {avatar ? "Cambiar foto" : "Subir foto"}
          </button>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleImagen} style={{ display: "none" }} />

          {avatar && (
            <button className="profile-dropdown-item profile-dropdown-quitar" onClick={quitarFoto}>
              Quitar foto
            </button>
          )}

          <button className="profile-dropdown-item" onClick={() => { navegar("/dashboard"); setAbierto(false); }}>
            Panel de control
          </button>

          <hr className="profile-dropdown-divider" />

          <button className="profile-dropdown-item profile-dropdown-logout" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
