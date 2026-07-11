import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { conectarDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import usuarioRoutes from "./routes/usuarios.js";
import swaggerSpec from "./config/swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    mensaje: "API TechZone Valpo",
    version: "1.0.0",
    documentacion: "/api/docs",
    endpoints: [
      "GET  /api/health",
      "POST /api/registro",
      "POST /api/login",
      "POST /api/refresh",
      "GET  /api/perfil",
      "GET  /api/productos",
      "GET  /api/productos/:id",
      "POST /api/productos (botiquero/admin)",
      "PUT  /api/productos/:id (admin)",
      "DELETE /api/productos/:id (admin soft delete)",
      "GET  /api/productos/admin (admin)",
      "GET  /api/usuarios (admin)",
      "PATCH /api/usuarios/:id/rol (admin)",
      "PATCH /api/usuarios/:id/activo (admin)",
    ],
  });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", authRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/usuarios", usuarioRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ estado: "ok", timestamp: new Date().toISOString() });
});

await conectarDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
