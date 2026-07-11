import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API TecZone Valpo",
      version: "1.0.0",
      description: "API REST para la tienda de tecnología TecZone Valpo. Gestión de productos, usuarios y autenticación.",
      contact: {
        name: "TecZone Valpo",
      },
    },
    servers: [
      {
        url: "https://proyecto-teczone-valpo.onrender.com",
        description: "Servidor de producción (Render)",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingresa el token JWT obtenido en /api/login",
        },
      },
      schemas: {
        Usuario: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único del usuario" },
            nombre: { type: "string", description: "Nombre" },
            apellido: { type: "string", description: "Apellido" },
            correo: { type: "string", format: "email", description: "Correo electrónico" },
            rol: { type: "string", enum: ["visita", "cliente", "botiquero", "administrador"], description: "Rol del usuario" },
            activo: { type: "boolean", description: "Estado del usuario" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Producto: {
          type: "object",
          properties: {
            _id: { type: "string", description: "ID único del producto" },
            nombre: { type: "string", description: "Nombre del producto" },
            precio: { type: "string", description: "Precio (ej: $150.000)" },
            categoria: { type: "string", enum: ["Computadoras", "Teclados", "Mouse", "Componentes", "Monitores", "Audio", "Accesorios", "Smartphones", "Wearables", "Audifonos", "Cargadores"], description: "Categoría" },
            descripcion: { type: "string", description: "Descripción del producto" },
            imagen: { type: "string", description: "URL de la imagen" },
            stock: { type: "number", description: "Cantidad en stock" },
            activo: { type: "boolean", description: "Estado del producto" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            mensaje: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./server/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
