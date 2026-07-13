import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { verificarToken, autorizar } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     tags: [Pedidos]
 *     summary: Crear un nuevo pedido
 *     description: Crea un pedido desde el carrito. Valida stock y decrementa cantidades. Requiere autenticación.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, direccion, telefono, comuna, metodoPago]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productoId, nombre, precio, cantidad]
 *                   properties:
 *                     productoId:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     precio:
 *                       type: number
 *                     cantidad:
 *                       type: number
 *               direccion:
 *                 type: string
 *                 example: "Av. España 1234"
 *               telefono:
 *                 type: string
 *                 example: "912345678"
 *               comuna:
 *                 type: string
 *                 example: "Valparaíso"
 *               metodoPago:
 *                 type: string
 *                 enum: [transferencia, webpay, efectivo]
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *       400:
 *         description: Datos inválidos o sin stock
 *       401:
 *         description: Token requerido
 */
router.post("/", verificarToken, async (req, res) => {
  try {
    const { items, direccion, telefono, comuna, metodoPago } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: "El pedido debe tener al menos un producto" });
    }
    if (!direccion || !telefono || !comuna || !metodoPago) {
      return res.status(400).json({ mensaje: "direccion, telefono, comuna y metodoPago son obligatorios" });
    }
    if (!["transferencia", "webpay", "efectivo"].includes(metodoPago)) {
      return res.status(400).json({ mensaje: "metodoPago inválido. Opciones: transferencia, webpay, efectivo" });
    }

    const stockErrors = [];
    const orderItems = [];

    for (const item of items) {
      const producto = await Product.findById(item.productoId);
      if (!producto || !producto.activo) {
        stockErrors.push(`${item.nombre || "Producto"} no encontrado`);
        continue;
      }
      if (producto.stock < item.cantidad) {
        stockErrors.push(`${producto.nombre}: stock insuficiente (${producto.stock} disponible, ${item.cantidad} solicitado)`);
        continue;
      }
      orderItems.push({
        producto: producto._id,
        nombre: producto.nombre,
        precio: parseInt(producto.precio.replace(/[^0-9]/g, "")) || 0,
        cantidad: item.cantidad,
      });
    }

    if (stockErrors.length > 0) {
      return res.status(400).json({ mensaje: "Error de stock", errores: stockErrors });
    }

    const total = orderItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

    const pedido = new Order({
      usuario: req.usuario.id,
      items: orderItems,
      total,
      direccion,
      telefono,
      comuna,
      metodoPago,
    });

    await pedido.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.producto, { $inc: { stock: -item.cantidad } });
    }

    res.status(201).json({ mensaje: "Pedido creado exitosamente", pedido });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ mensaje: "Error al crear pedido", error: error.message });
  }
});

/**
 * @swagger
 * /api/pedidos/mis:
 *   get:
 *     tags: [Pedidos]
 *     summary: Ver mis pedidos
 *     description: Retorna todos los pedidos del usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 *       401:
 *         description: Token requerido
 */
router.get("/mis", verificarToken, async (req, res) => {
  try {
    const pedidos = await Order.find({ usuario: req.usuario.id, activo: true })
      .sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pedidos", error: error.message });
  }
});

/**
 * @swagger
 * /api/pedidos/admin:
 *   get:
 *     tags: [Pedidos]
 *     summary: Listar todos los pedidos
 *     description: Retorna todos los pedidos del sistema. Solo administradores y vendedores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [pendiente, pagado, enviado, entregado, cancelado]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de todos los pedidos
 *       403:
 *         description: No tiene permisos suficientes
 */
router.get("/admin", verificarToken, autorizar("administrador", "vendedor"), async (req, res) => {
  try {
    const { estado } = req.query;
    const filtro = {};
    if (estado) filtro.estado = estado;

    const pedidos = await Order.find(filtro)
      .populate("usuario", "nombre apellido correo")
      .sort({ createdAt: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pedidos", error: error.message });
  }
});

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     tags: [Pedidos]
 *     summary: Ver detalle de un pedido
 *     description: Retorna el detalle de un pedido específico. El cliente solo puede ver sus propios pedidos.
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
 *         description: Detalle del pedido
 *       403:
 *         description: No tiene acceso a este pedido
 *       404:
 *         description: Pedido no encontrado
 */
router.get("/:id", verificarToken, async (req, res) => {
  try {
    const pedido = await Order.findById(req.params.id).populate("usuario", "nombre apellido correo");
    if (!pedido || !pedido.activo) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    if (req.usuario.rol !== "administrador" && pedido.usuario._id.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: "No tienes acceso a este pedido" });
    }

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pedido", error: error.message });
  }
});

/**
 * @swagger
 * /api/pedidos/{id}/estado:
 *   patch:
 *     tags: [Pedidos]
 *     summary: Cambiar estado de un pedido
 *     description: Actualiza el estado de un pedido. Solo administradores y vendedores.
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
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, pagado, enviado, entregado, cancelado]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Pedido no encontrado
 */
router.patch("/:id/estado", verificarToken, autorizar("administrador", "vendedor"), async (req, res) => {
  try {
    const { estado } = req.body;
    const estados = ["pendiente", "pagado", "enviado", "entregado", "cancelado"];
    if (!estado || !estados.includes(estado)) {
      return res.status(400).json({ mensaje: `Estado inválido. Opciones: ${estados.join(", ")}` });
    }

    const pedido = await Order.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    ).populate("usuario", "nombre apellido correo");

    if (!pedido) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    res.json({ mensaje: `Estado actualizado a "${estado}"`, pedido });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar estado", error: error.message });
  }
});

/**
 * @swagger
 * /api/pedidos/{id}/cancelar:
 *   patch:
 *     tags: [Pedidos]
 *     summary: Cancelar un pedido (cliente)
 *     description: Permite al cliente cancelar su propio pedido si está en estado pendiente. Restaura el stock y desactiva el pedido.
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
 *         description: Pedido cancelado exitosamente
 *       400:
 *         description: El pedido no está en estado pendiente
 *       403:
 *         description: No es tu pedido
 *       404:
 *         description: Pedido no encontrado
 */
router.patch("/:id/cancelar", verificarToken, async (req, res) => {
  try {
    const pedido = await Order.findById(req.params.id);
    if (!pedido || !pedido.activo) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }

    if (pedido.usuario.toString() !== req.usuario.id) {
      return res.status(403).json({ mensaje: "No tienes acceso a este pedido" });
    }

    if (pedido.estado !== "pendiente") {
      return res.status(400).json({ mensaje: "Solo se pueden cancelar pedidos en estado pendiente" });
    }

    for (const item of pedido.items) {
      await Product.findByIdAndUpdate(item.producto, { $inc: { stock: item.cantidad } });
    }

    pedido.activo = false;
    await pedido.save();

    res.json({ mensaje: "Pedido cancelado exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al cancelar pedido", error: error.message });
  }
});

export default router;
