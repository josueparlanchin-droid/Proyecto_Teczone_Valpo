import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  precio: { type: String, required: true },
  categoria: { type: String, required: true },
  descripcion: { type: String, default: "" },
  imagen: { type: String, default: "" },
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
