import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import User from "./models/User.js";

const usuariosBase = [
  { correo: "josue.durand@gmail.com", clave: "Josue2026", rol: "administrador" },
  { correo: "vendedor@techzone.cl", clave: "Vendedor1", rol: "botiquero" },
  { correo: "cliente@techzone.cl", clave: "Cliente1", rol: "cliente" },
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
    console.log("📦 Catálogo vacío — el admin agregará productos desde la UI");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado");
  }
}

seed();
