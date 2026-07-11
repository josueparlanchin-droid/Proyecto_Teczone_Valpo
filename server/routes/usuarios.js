import { Router } from "express";
import User from "../models/User.js";
import { verificarToken, autorizar } from "../middleware/auth.js";

const router = Router();
const rolesPermitidos = ["visita", "cliente", "botiquero", "administrador"];

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar todos los usuarios
 *     description: Retorna la lista de usuarios sin contraseñas. Solo administradores.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Token requerido
 *       403:
 *         description: No tiene permisos de administrador
 */
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

/**
 * @swagger
 * /api/usuarios/{id}/rol:
 *   patch:
 *     tags: [Usuarios]
 *     summary: Cambiar rol de un usuario
 *     description: Actualiza el rol de un usuario. No permite cambiar el propio rol. Solo administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rol]
 *             properties:
 *               rol:
 *                 type: string
 *                 enum: [visita, cliente, botiquero, administrador]
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       400:
 *         description: Rol inválido o intento de cambiar propio rol
 *       404:
 *         description: Usuario no encontrado
 */
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

/**
 * @swagger
 * /api/usuarios/{id}/activo:
 *   patch:
 *     tags: [Usuarios]
 *     summary: Activar/desactivar usuario
 *     description: Alterna el estado activo/inactivo de un usuario. No permite desactivarse a uno mismo. Solo administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Estado del usuario cambiado
 *       400:
 *         description: Intento de desactivarse a uno mismo
 *       404:
 *         description: Usuario no encontrado
 */
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
