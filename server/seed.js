import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import User from "./models/User.js";

const usuariosBase = [
  { nombre: process.env.SEED_ADMIN_NAME || "Admin", apellido: "", correo: process.env.SEED_ADMIN_EMAIL || "admin@techzone.cl", clave: process.env.SEED_ADMIN_PASS || "CHANGE_ME", rol: "administrador" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      tlsAllowInvalidCertificates: true,
    });
    console.log("✅ Conectado a MongoDB Atlas");

    for (const u of usuariosBase) {
      const existe = await User.findOne({ correo: u.correo });
      if (existe) {
        existe.clave = u.clave;
        existe.rol = u.rol;
        await existe.save();
        console.log(`   Actualizado: ${u.correo} (${u.rol})`);
      } else {
        const user = new User(u);
        await user.save();
        console.log(`   Creado: ${u.correo} (${u.rol})`);
      }
    }

    const userCount = await User.countDocuments();
    console.log(`\n👤 Total usuarios: ${userCount}`);
    console.log("📦 Los usuarios se gestionan desde el panel admin");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado");
  }
}

seed();
