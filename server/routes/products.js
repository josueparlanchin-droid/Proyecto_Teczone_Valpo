import { Router } from "express";
import Product from "../models/Product.js";
import { verificarToken, autorizar } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /api/productos:
 *   get:
 *     tags: [Productos]
 *     summary: Listar productos (catálogo público)
 *     description: Retorna productos activos con búsqueda, filtro por categoría y paginación.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [Computadoras, Teclados, Mouse, Componentes, Monitores, Audio, Accesorios, Smartphones, Wearables, Audifonos, Cargadores]
 *         description: Filtrar por categoría
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista de productos
 */
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

/**
 * @swagger
 * /api/productos/admin:
 *   get:
 *     tags: [Productos]
 *     summary: Listar todos los productos (solo admin)
 *     description: Retorna todos los productos (activos e inactivos). Requiere rol administrador.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de productos
 *       401:
 *         description: Token requerido
 *       403:
 *         description: No tiene permisos de administrador
 */
router.get("/admin", verificarToken, autorizar("administrador"), async (req, res) => {
  try {
    const productos = await Product.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
  }
});

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
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

/**
 * @swagger
 * /api/productos:
 *   post:
 *     tags: [Productos]
 *     summary: Crear un producto
 *     description: Agrega un nuevo producto al catálogo. Requiere rol vendedor o administrador.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, precio, categoria]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Monitor LG 27"
 *               precio:
 *                 type: string
 *                 example: "$200.000"
 *               categoria:
 *                 type: string
 *                 enum: [Computadoras, Teclados, Mouse, Componentes, Monitores, Audio, Accesorios, Smartphones, Wearables, Audifonos, Cargadores]
 *               descripcion:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 description: URL de la imagen
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Faltan campos obligatorios
 *       403:
 *         description: No tiene permisos
 */
router.post("/", verificarToken, autorizar("vendedor", "administrador"), async (req, res) => {
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

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     tags: [Productos]
 *     summary: Actualizar un producto
 *     description: Actualiza los campos de un producto existente. Solo administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: string
 *               categoria:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               imagen:
 *                 type: string
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 */
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

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     tags: [Productos]
 *     summary: Desactivar producto (soft delete)
 *     description: Marca un producto como inactivo sin eliminarlo. Solo administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto desactivado
 *       404:
 *         description: Producto no encontrado
 */
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

/**
 * @swagger
 * /api/productos/{id}/reactivar:
 *   patch:
 *     tags: [Productos]
 *     summary: Reactivar producto
 *     description: Marca un producto desactivado como activo. Solo administradores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto reactivado
 *       404:
 *         description: Producto no encontrado
 */
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
