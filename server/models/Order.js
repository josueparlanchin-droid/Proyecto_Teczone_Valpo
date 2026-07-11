import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: { type: [orderItemSchema], required: true, validate: { validator: (v) => v.length > 0, message: "El pedido debe tener al menos un producto" } },
    total: { type: Number, required: true, min: 0 },
    direccion: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    comuna: { type: String, required: true, trim: true },
    metodoPago: {
      type: String,
      required: true,
      enum: ["transferencia", "webpay", "efectivo"],
    },
    estado: {
      type: String,
      enum: ["pendiente", "pagado", "enviado", "entregado", "cancelado"],
      default: "pendiente",
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
