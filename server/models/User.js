import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const roles = ["visita", "cliente", "botiquero", "administrador"];

const userSchema = new mongoose.Schema({
  nombre: { type: String, default: "" },
  apellido: { type: String, default: "" },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  clave: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: roles,
    default: "cliente",
  },
  activo: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

userSchema.pre("save", async function () {
  if (!this.isModified("clave")) return;
  const salt = await bcrypt.genSalt(10);
  this.clave = await bcrypt.hash(this.clave, salt);
});

userSchema.methods.compararClave = async function (claveIngresada) {
  return await bcrypt.compare(claveIngresada, this.clave);
};

export default mongoose.model("User", userSchema);
export { roles };
