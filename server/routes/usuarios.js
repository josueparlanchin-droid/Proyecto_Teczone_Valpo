import { Router } from "express";
import User from "../models/User.js";
import { verificarToken, autorizar } from "../middleware/auth.js";

const router = Router();
const rolesPermitidos = ["visita", "cliente", "botiquero", "administrador"];

// GET /api/usuarios — solo admin
router.get("/", verificarToken, autorizar("administrador"), async (req, res) => {
  try {
    const usuarios = await User.find()
      .select("-clave")
      .sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error: error.message });
  }
});

// PATCH /api/usuarios/:id/rol — solo admin
router.patch("/:id/rol", verificarToken, autorizar("administrador"), async (req, res) => {
  try {
    const { rol } = req.body;
    if (!rol || !rolesPermitidos.includes(rol)) {
      return res.status(400).json({ mensaje: `Rol inválido. Opciones: ${rolesPermitidos.join(", ")}` });
    }

    if (req.params.id === req.usuario.id) {
      return res.status(400).json({ mensaje: "No puedes cambiar tu propio rol" });
    }

    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true }
    ).select("-clave");

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: `Rol actualizado a "${rol}"`, usuario });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar rol", error: error.message });
  }
});

// PATCH /api/usuarios/:id/activo — solo admin
router.patch("/:id/activo", verificarToken, autorizar("administrador"), async (req, res) => {
  try {
    if (req.params.id === req.usuario.id) {
      return res.status(400).json({ mensaje: "No puedes desactivarte a ti mismo" });
    }

    const usuario = await User.findById(req.params.id).select("-clave");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.activo = !usuario.activo;
    await usuario.save();

    res.json({
      mensaje: usuario.activo ? "Usuario activado" : "Usuario desactivado",
      usuario,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cambiar estado", error: error.message });
  }
});

export default router;
