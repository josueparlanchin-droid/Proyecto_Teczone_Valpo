import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verificarToken, generarToken, generarRefreshToken } from "../middleware/auth.js";

const router = Router();
const SECRETO = process.env.JWT_SECRET || "techzone_valpo_secret_2026";

router.post("/registro", async (req, res) => {
  try {
    const { correo, clave } = req.body;

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return res.status(400).json({ mensaje: "Formato de correo inválido" });
    }
    if (!clave || clave.length < 8) {
      return res.status(400).json({ mensaje: "La clave debe tener al menos 8 caracteres" });
    }

    const existe = await User.findOne({ correo });
    if (existe) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const usuario = new User({ correo, clave, rol: "cliente" });
    await usuario.save();

    const token = generarToken(usuario);
    const refreshToken = generarRefreshToken(usuario);

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      token,
      refreshToken,
      usuario: { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { correo, clave } = req.body;

    const usuario = await User.findOne({ correo, activo: true });
    if (!usuario) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const coincide = await usuario.compararClave(clave);
    if (!coincide) {
      return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
    }

    const token = generarToken(usuario);
    const refreshToken = generarRefreshToken(usuario);

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      refreshToken,
      usuario: { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ mensaje: "Refresh token requerido" });
    }

    const decoded = jwt.verify(refreshToken, SECRETO + "_refresh");
    const usuario = await User.findById(decoded.id);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    const nuevoToken = generarToken(usuario);
    const nuevoRefresh = generarRefreshToken(usuario);

    res.json({ token: nuevoToken, refreshToken: nuevoRefresh });
  } catch (error) {
    res.status(401).json({ mensaje: "Refresh token inválido o expirado" });
  }
});

router.get("/perfil", verificarToken, async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario.id).select("-clave");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener perfil", error: error.message });
  }
});

export default router;
