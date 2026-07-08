import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SECRETO = process.env.JWT_SECRET || "techzone_valpo_secret_2026";

export function verificarToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Token requerido" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, SECRETO);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
}

export function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ mensaje: "No autenticado" });
    }
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: "No tienes permisos para esta acción" });
    }
    next();
  };
}

export function generarToken(usuario) {
  return jwt.sign(
    { id: usuario._id, correo: usuario.correo, rol: usuario.rol },
    SECRETO,
    { expiresIn: "24h" }
  );
}

export function generarRefreshToken(usuario) {
  return jwt.sign(
    { id: usuario._id },
    SECRETO + "_refresh",
    { expiresIn: "7d" }
  );
}
