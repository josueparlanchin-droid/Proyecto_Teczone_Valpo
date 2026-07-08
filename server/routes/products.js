import { Router } from "express";
import Product from "../models/Product.js";
import { verificarToken, autorizar } from "../middleware/auth.js";

const router = Router();

// GET /api/productos — público (solo activos, con búsqueda y filtro)
router.get("/", async (req, res) => {
  try {
    const { search, categoria, page = 1, limit = 20 } = req.query;
    const filtro = { activo: true };

    if (search) {
      filtro.nombre = { $regex: search, $options: "i" };
    }
    if (categoria && categoria !== "Todas") {
      filtro.categoria = categoria;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filtro);
    const productos = await Product.find(filtro)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({ productos, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
  }
});

// GET /api/productos/admin — todos (activos e inactivos) solo admin
router.get("/admin", verificarToken, autorizar("administrador"), async (req, res) => {
  try {
    const productos = await Product.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
  }
});

// GET /api/productos/:id
router.get("/:id", async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto || !producto.activo) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener producto", error: error.message });
  }
});

// POST /api/productos — botiquero o admin
router.post("/", verificarToken, autorizar("botiquero", "administrador"), async (req, res) => {
  try {
    const { nombre, precio, categoria, descripcion, stock } = req.body;
    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ mensaje: "nombre, precio y categoria son obligatorios" });
    }

    const producto = new Product({ nombre, precio, categoria, descripcion, stock });
    await producto.save();
    res.status(201).json({ mensaje: "Producto creado", producto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
  }
});

// PUT /api/productos/:id — admin
router.put("/:id", verificarToken, autorizar("administrador"), async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar producto", error: error.message });
  }
});

// DELETE /api/productos/:id — soft delete (admin)
router.delete("/:id", verificarToken, autorizar("administrador"), async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto desactivado (soft delete)", producto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar producto", error: error.message });
  }
});

// PATCH /api/productos/:id/reactivar — solo admin
router.patch("/:id/reactivar", verificarToken, autorizar("administrador"), async (req, res) => {
  try {
    const producto = await Product.findByIdAndUpdate(
      req.params.id,
      { activo: true },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto reactivado", producto });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al reactivar producto", error: error.message });
  }
});

export default router;
