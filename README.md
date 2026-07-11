# TecZone Valpo - Tienda de Tecnología

Aplicación web full-stack de comercio electrónico para la venta de productos tecnológicos en Valparaíso, Chile.

## Descripción

TecZone Valpo es una tienda online que permite a los usuarios explorar un catálogo de productos tecnológicos (computadoras, periféricos, componentes, etc.), agregar productos al carrito y gestionar pedóc. El sistema cuenta con cuatro roles de usuario: visita, cliente, botiquero y administrador, cada uno con permisos diferenciados.

## Arquitectura

```
┌─────────────────────────────────┐
│         Frontend (Vercel)       │
│   React 19 + Vite + Axios      │
│   SPA con React Router v7      │
└──────────────┬──────────────────┘
               │ HTTP/JSON
┌──────────────▼──────────────────┐
│       Backend (Render)          │
│   Express 5 + JWT + bcrypt     │
│   Swagger UI en /api/docs       │
└──────────────┬──────────────────┘
               │ Mongoose
┌──────────────▼──────────────────┐
│       MongoDB Atlas             │
│   Cluster valpo.cz5in6s         │
└─────────────────────────────────┘
```

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Vite, React Router v7, Axios |
| Backend | Node.js, Express 5, Mongoose 9 |
| Auth | JWT (access + refresh tokens), bcryptjs |
| DB | MongoDB Atlas (Mongoose ODM) |
| API Docs | Swagger UI + swagger-jsdoc (OpenAPI 3.0) |
| Deploy | Vercel (frontend), Render (backend) |
| CORS | Configurado para aceptar todos los orígenes |

## Modelos de Datos

### Usuario

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | String | Nombre del usuario |
| apellido | String | Apellido del usuario |
| correo | String | Correo electrónico (único) |
| clave | String | Contraseña hasheada con bcrypt |
| rol | Enum | `visita`, `cliente`, `botiquero`, `administrador` |
| activo | Boolean | Estado de la cuenta |
| createdAt | Date | Fecha de creación |
| updatedAt | Date | Fecha de última actualización |

### Producto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| nombre | String | Nombre del producto |
| precio | String | Precio (ej: "$150.000") |
| categoria | Enum | `Computadoras`, `Teclados`, `Mouse`, `Audio`, `Componentes`, `Accesorios`, `Monitores` |
| descripcion | String | Descripción del producto |
| imagen | String | URL de la imagen |
| stock | Number | Cantidad disponible |
| activo | Boolean | Estado del producto (soft delete) |
| createdAt | Date | Fecha de creación |
| updatedAt | Date | Fecha de última actualización |

## Endpoints API

### Autenticación

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| POST | `/api/registro` | Registrar usuario | Público |
| POST | `/api/login` | Iniciar sesión | Público |
| POST | `/api/refresh` | Renovar token | Público |
| GET | `/api/perfil` | Ver perfil | Autenticado |

### Productos

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/productos` | Listar productos (paginado) | Público |
| GET | `/api/productos/:id` | Obtener producto | Público |
| GET | `/api/productos/admin` | Listar todos (con inactivos) | Admin |
| POST | `/api/productos` | Crear producto | Botiquero/Admin |
| PUT | `/api/productos/:id` | Actualizar producto | Admin |
| DELETE | `/api/productos/:id` | Desactivar producto | Admin |
| PATCH | `/api/productos/:id/reactivar` | Reactivar producto | Admin |

### Usuarios

| Método | Ruta | Descripción | Acceso |
|--------|------|-------------|--------|
| GET | `/api/usuarios` | Listar usuarios | Admin |
| PATCH | `/api/usuarios/:id/rol` | Cambiar rol | Admin |
| PATCH | `/api/usuarios/:id/activo` | Activar/desactivar | Admin |

### Otros

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Info de la API |
| GET | `/api/health` | Health check |
| GET | `/api/docs` | Swagger UI |

## Variables de Entorno

El archivo `.env` (no incluido en el repositorio) debe contener:

```
VITE_API_URL=https://proyecto-teczone-valpo.onrender.com/api
JWT_SECRET=<tu_secreto_jwt>
MONGODB_URI=<uri_de_mongodb_atlas>
```

## Instalación

```bash
# Clonar repositorio
git clone <url-del-repositorio>
cd teczone_valpo

# Instalar dependencias
npm install

# Crear archivo .env con las variables de entorno necesarias

# Poblar base de datos (opcional)
npm run seed

# Ejecutar en desarrollo
npm run dev          # Frontend (Vite, puerto 5173)
npm run server       # Backend (Express, puerto 3000)

# Build para producción
npm run build
```

## Despliegue

### Frontend (Vercel)
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrites configurados en `vercel.json`

### Backend (Render)
- Start command: `node server/index.js`
- Blueprint disponible en `render.yaml`
- Puerto: 3000 (asignado por Render)

## Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **visita** | Ver catálogo de productos |
| **cliente** | Ver catálogo, agregar al carrito, ver perfil |
| **botiquero** | Crear productos, gestionar inventario |
| **administrador** | Todos los permisos: CRUD completo, gestión de usuarios, activar/desactivar productos |

## Documentación API

Swagger UI disponible en: `GET /api/docs`

Especificación OpenAPI 3.0 generada con `swagger-jsdoc` a partir de anotaciones JSDoc en los archivos de rutas.
