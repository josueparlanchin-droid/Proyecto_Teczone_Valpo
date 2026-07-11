import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verificarToken, generarToken, generarRefreshToken } from "../middleware/auth.js";

const router = Router();
const SECRETO = process.env.JWT_SECRET || "techzone_valpo_secret_2026";

/**
 * @swagger
 * /api/registro:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registrar un nuevo usuario
 *     description: Crea una cuenta nueva con rol "cliente" por defecto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, clave]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               apellido:
 *                 type: string
 *                 example: "Pérez"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "juan@correo.cl"
 *               clave:
 *                 type: string
 *                 minLength: 8
 *                 example: "MiClave123"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Correo inválido, clave muy corta o correo ya registrado
 */
router.post("/registro", async (req, res) => {
  try {
    const { nombre, apellido, correo, clave } = req.body;

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

    const usuario = new User({ nombre, apellido, correo, clave, rol: "cliente" });
    await usuario.save();

    const token = generarToken(usuario);
    const refreshToken = generarRefreshToken(usuario);

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      token,
      refreshToken,
      usuario: { id: usuario._id, nombre: usuario.nombre, apellido: usuario.apellido, correo: usuario.correo, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar", error: error.message });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Iniciar sesión
 *     description: Valida correo y contraseña, devuelve token JWT y refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, clave]
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: "juan@correo.cl"
 *               clave:
 *                 type: string
 *                 example: "MiClave123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales incorrectas
 */
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
      usuario: { id: usuario._id, nombre: usuario.nombre, apellido: usuario.apellido, correo: usuario.correo, rol: usuario.rol },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
  }
});

/**
 * @swagger
 * /api/refresh:
 *   post:
 *     tags: [Autenticación]
 *     summary: Renovar token de acceso
 *     description: Emite un nuevo par de tokens (access + refresh) usando un refresh token válido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresco obtenido al iniciar sesión
 *     responses:
 *       200:
 *         description: Tokens renovados exitosamente
 *       401:
 *         description: Refresh token inválido o expirado
 */
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

/**
 * @swagger
 * /api/perfil:
 *   get:
 *     tags: [Autenticación]
 *     summary: Obtener perfil del usuario autenticado
 *     description: Retorna los datos del usuario actual (sin contraseña).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *       401:
 *         description: Token requerido o inválido
 */
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
