import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import Product from "./models/Product.js";
import User from "./models/User.js";

const productosBase = [
  { nombre: "Notebook Gamer ASUS ROG", precio: "$850.000", categoria: "Computadoras", descripcion: "RTX 4070, 32GB RAM, 1TB SSD", stock: 5 },
  { nombre: "Teclado Mecánico Redragon", precio: "$45.000", categoria: "Teclados", descripcion: "Switches Cherry MX, RGB", stock: 20 },
  { nombre: "Tarjeta Gráfica RTX 4060", precio: "$350.000", categoria: "Componentes", descripcion: "8GB GDDR6, DLSS 3", stock: 8 },
  { nombre: "PC Armado Intel i7", precio: "$600.000", categoria: "Computadoras", descripcion: "i7-13700, 16GB RAM, 1TB SSD", stock: 3 },
  { nombre: "Teclado Keychron K2", precio: "$90.000", categoria: "Teclados", descripcion: "Inalámbrico, retroiluminado", stock: 15 },
  { nombre: "Monitor Samsung 27\" 4K", precio: "$280.000", categoria: "Computadoras", descripcion: "IPS, 60Hz, HDR10", stock: 7 },
  { nombre: "Mouse Logitech G Pro", precio: "$65.000", categoria: "Componentes", descripcion: "Hero 25K, inalámbrico", stock: 12 },
  { nombre: "Audífonos HyperX Cloud II", precio: "$80.000", categoria: "Componentes", descripcion: "7.1 surround, USB", stock: 10 },
  { nombre: "SSD NVMe 1TB", precio: "$120.000", categoria: "Componentes", descripcion: "Lectura 7000MB/s", stock: 25 },
  { nombre: "Memoria RAM DDR5 32GB", precio: "$150.000", categoria: "Componentes", descripcion: "5600MHz, 2x16GB", stock: 18 },
];

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

    await Product.deleteMany({});
    await Product.insertMany(productosBase);
    console.log(`✅ ${productosBase.length} productos insertados`);

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

    const prodCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    console.log(`\n📦 Total productos: ${prodCount}`);
    console.log(`👤 Total usuarios: ${userCount}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado");
  }
}

seed();
