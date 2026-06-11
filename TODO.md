# NESKA Bs As — Estado del proyecto y próximos pasos

> Última actualización: 2026-06-11

---

## ✅ Lo que está completamente hecho

### Infraestructura
- **Next.js 16** (App Router, Turbopack, TypeScript)
- **PostgreSQL en Neon** — tablas creadas con `prisma db push`, seed corrido con productos y admin de prueba
- **Prisma 7** — `prisma.config.ts` en raíz, adapter `@prisma/adapter-pg`, cliente generado en `generated/prisma/`
- **Deploy en Vercel** — repo conectado, build pasa, sitio live en **https://neska-ecommerce.vercel.app**
- **GitHub** — código en https://github.com/ValentinPaz/neska-ecommerce.git (rama `main`)

### Tienda (frontend)
- **Home** (`/`) — hero carousel, "Recién llegados", trust badges, announcement bar, header/navbar/footer
- **Catálogo** (`/catalogo`) — filtros por categoría y precio, buscador de texto, grilla de productos
- **Detalle de producto** (`/catalogo/[slug]`) — galería de imágenes, selector de talle, info con cuotas
- **Carrito** — drawer lateral con Zustand, persistido en localStorage
- **Checkout** (`/checkout`) — formulario de envío con react-hook-form + zod
- **Páginas de resultado MP** — exitoso, error, pendiente

### Checkout y pagos
- **Mercado Pago SDK v3** integrado — `MercadoPagoConfig` + `Preference` + `Payment`
- **`POST /api/checkout/preference`** — crea la Orden en DB + preferencia en MP, devuelve `initPoint`
- **`POST /api/checkout/webhook`** — recibe notificación de MP, actualiza estado de la orden, descuenta stock
- **Credenciales de TEST de MP** ya cargadas en Vercel (env vars activas en producción)

### Panel Admin (`/admin`)
- **Login** — formulario JWT, cookie httpOnly `admin-token`
- **Dashboard** — métricas básicas
- **Productos** — lista, crear (`/admin/productos/nuevo`), editar (`/admin/productos/[id]`), toggle activo/inactivo
- **Subida de imágenes** — migrado de filesystem local a **Cloudinary** (imágenes persistentes en la nube)
- **Categorías** — CRUD completo
- **Órdenes** — lista con filtro por estado + paginación (`/admin/ordenes`), detalle con cambio de estado (`/admin/ordenes/[id]`)
- **Protección** — `src/proxy.ts` protege `/admin/:path*` con JWT

### Credenciales de acceso (local/Vercel)
| Variable | Valor |
|---|---|
| Admin email | admin@neska.com |
| Admin password | Admin1234! |
| URL producción | https://neska-ecommerce.vercel.app |

---

## 🔴 Pendiente para mañana (en orden de prioridad)

### 1. Configurar Cloudinary en Vercel ← CRÍTICO
Sin esto, la subida de imágenes desde el admin **falla en producción**.

**Pasos:**
1. Ir a [cloudinary.com](https://cloudinary.com) → crear cuenta gratis (o usar una existente)
2. En el Dashboard de Cloudinary copiar los 3 valores:
   - `Cloud Name`
   - `API Key`
   - `API Secret`
3. En Vercel → proyecto `neska-ecommerce` → **Settings → Environment Variables** → agregar:
   ```
   CLOUDINARY_CLOUD_NAME = <tu cloud name>
   CLOUDINARY_API_KEY    = <tu api key>
   CLOUDINARY_API_SECRET = <tu api secret>
   ```
4. Redeploy en Vercel (o esperar que lo haga automático al guardar las vars)
5. Probar: ir a `/admin/productos/nuevo`, subir una imagen, verificar que aparece la URL de Cloudinary (empieza con `https://res.cloudinary.com/...`)

### 2. Probar el checkout completo de punta a punta ← IMPORTANTE
El código está listo pero el flujo real no fue verificado en producción con las credenciales de test.

**Pasos:**
1. Agregar un producto al carrito en https://neska-ecommerce.vercel.app
2. Ir al checkout, completar el formulario (dirección de prueba)
3. Hacer clic en "Pagar con Mercado Pago"
4. Usar las **tarjetas de prueba de MP** para simular un pago aprobado:
   - Tarjeta Visa test: `4009 1753 3280 6176` — Vence: cualquiera futura — CVV: `123`
   - Nombre: `APRO` (para aprobar el pago)
5. Verificar que redirige a `/checkout/exitoso` y el carrito se vacía
6. Ir a `/admin/ordenes` y confirmar que la orden aparece con estado **APROBADO**
7. Verificar que el stock del producto disminuyó en `/admin/productos/[id]`

**Si el webhook no llega en producción** (MP no puede llamar a Vercel en algunos contextos de test):
- Ir a [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers) → Tu aplicación → Webhooks → configurar la URL: `https://neska-ecommerce.vercel.app/api/checkout/webhook`

### 3. Verificar imágenes de productos existentes en producción
Los productos del seed apuntan a `/images/products/...` (rutas locales). En Vercel, las imágenes en `public/` sí se sirven (se deployaron con el código). Verificar que se ven correctamente en el catálogo.

Si alguna imagen no carga, hay que subirla a Cloudinary manualmente y actualizar la URL desde el panel admin.

---

## 🟡 Mejoras deseables (próximas sesiones)

- **Emails transaccionales** — confirmación de compra al cliente (Resend o Nodemailer)
- **Dominio personalizado** en Vercel — ej: `neska.com.ar`
- **Imágenes en next/image** — optimización automática con `<Image>` de Next.js (requiere configurar `domains` o `remotePatterns` para Cloudinary)
- **Paginación en el catálogo** — cuando haya muchos productos
- **Panel de analytics básico** — total ventas por período en el dashboard admin
- **Credenciales de producción de MP** — cuando se quiera lanzar para ventas reales (reemplazar TEST- por APP_USR-)

---

## Variables de entorno en Vercel (estado actual)

| Variable | Estado |
|---|---|
| `DATABASE_URL` | ✅ Configurada (Neon PostgreSQL) |
| `JWT_SECRET` | ✅ Configurada |
| `ADMIN_EMAIL` | ✅ Configurada |
| `ADMIN_PASSWORD` | ✅ Configurada |
| `MP_ACCESS_TOKEN` | ✅ Configurada (TEST) |
| `MP_PUBLIC_KEY` | ✅ Configurada (TEST) |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | ✅ Configurada (TEST) |
| `NEXT_PUBLIC_BASE_URL` | ✅ Configurada |
| `CLOUDINARY_CLOUD_NAME` | ❌ **Falta configurar** |
| `CLOUDINARY_API_KEY` | ❌ **Falta configurar** |
| `CLOUDINARY_API_SECRET` | ❌ **Falta configurar** |
