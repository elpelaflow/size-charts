<div align="center">

# Size Charts

**Gestión de tablas de tallas de código abierto para e-commerce**

[![Demo en vivo](https://img.shields.io/badge/demo-en_vivo-brightgreen)](https://www.sizecharts.dev)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](LICENSE)
[![Estrellas en GitHub](https://img.shields.io/github/stars/mattdecrevel/size-charts?style=social)](https://github.com/mattdecrevel/size-charts)

[Demo en vivo](https://www.sizecharts.dev) · [Documentación](https://www.sizecharts.dev/docs) · [Reportar un error](https://github.com/mattdecrevel/size-charts/issues)

[English](README.en.md) · **Español**

</div>

---

Un sistema de tablas de tallas listo para producción con panel de administración, API REST y widget integrable. Diseñado para plataformas de e-commerce que necesitan gestionar tallas de ropa, calzado y accesorios.

<div align="center">

![Página principal de Size Charts](docs/images/homepage.png)

</div>

## Características

| Característica | Descripción |
|----------------|-------------|
| **Editor tipo hoja de cálculo** | Edición estilo Excel con navegación por teclado |
| **Multicategoría** | Una tabla puede aparecer en múltiples categorías |
| **Unidades duales** | Todas las medidas en pulgadas + centímetros |
| **API REST** | CRUD completo con documentación OpenAPI |
| **Widget integrable** | Un solo script tag, cero dependencias |
| **Claves de API** | Autenticación con alcance y límite de peticiones |
| **Modo oscuro** | Soporte completo de modo oscuro |
| **Plantillas** | Tablas prediseñadas para casos de uso comunes |

<div align="center">

<img src="docs/images/admin-editor.png" alt="Editor de administración" width="80%">

*Editor estilo hoja de cálculo con edición en línea y navegación por teclado*

</div>

## Inicio rápido

### Opción 1: Desplegar en Vercel (Recomendado)

[![Desplegar con Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mattdecrevel/size-charts&env=DATABASE_URL&envDescription=Cadena%20de%20conexi%C3%B3n%20PostgreSQL&envLink=https://github.com/mattdecrevel/size-charts%23environment-variables)

1. Haz clic en el botón de arriba
2. Conecta una base de datos PostgreSQL ([Neon](https://neon.tech), [Supabase](https://supabase.com) o [Railway](https://railway.app))
3. Configura la variable de entorno `DATABASE_URL`
4. ¡Despliega!

### Opción 2: Desarrollo local

```bash
# Clonar e instalar
git clone https://github.com/mattdecrevel/size-charts.git
cd size-charts
npm install

# Configurar base de datos
cp .env.example .env
# Edita .env con tu DATABASE_URL

# Inicializar y poblar datos
npm run db:push
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Uso

### Widget integrable

Agrega tablas de tallas a cualquier sitio web con un solo script tag:

```html
<div data-chart="mens-tops"></div>
<script src="https://www.sizecharts.dev/embed/size-charts.js"
        data-api="https://www.sizecharts.dev">
</script>
```

### API REST

```bash
# Obtener todas las tablas de tallas
curl https://www.sizecharts.dev/api/v1/size-charts

# Obtener una tabla específica
curl https://www.sizecharts.dev/api/v1/size-charts?slug=mens-tops

# Con autenticación (cuando está habilitada)
curl -H "X-API-Key: sc_live_xxxx" \
  https://www.sizecharts.dev/api/v1/size-charts
```

Consulta la [Documentación de la API](https://www.sizecharts.dev/docs/api) para ver todos los endpoints.

## Stack tecnológico

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript 5](https://www.typescriptlang.org/)
- **Base de datos**: [PostgreSQL](https://www.postgresql.org/) + [Prisma 7](https://www.prisma.io/)
- **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Estado**: [TanStack Query](https://tanstack.com/query)

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | Sí | Cadena de conexión PostgreSQL |
| `DEMO_MODE` | No | Habilitar modo demo público (`true`/`false`) |
| `ADMIN_USERNAME` | No | Nombre de usuario del panel de administración (si no está en modo demo) |
| `ADMIN_PASSWORD` | No | Contraseña del panel de administración (si no está en modo demo) |
| `API_AUTH_REQUIRED` | No | Requerir autenticación con clave de API |
| `CORS_ALLOWED_ORIGINS` | No | Orígenes CORS permitidos (separados por comas) |

Consulta [.env.example](.env.example) para ver todas las opciones.

## Estructura del proyecto

```
app/
├── (marketing)/     # Página de inicio, documentación, ejemplos
├── (app)/
│   ├── admin/       # Panel de administración
│   └── size-guide/  # Guía de tallas pública
└── api/
    ├── v1/          # API REST pública
    └── admin/       # Endpoints de administración

components/
├── admin/           # Componentes de UI del admin
├── public/          # Componentes públicos
└── ui/              # Componentes de shadcn/ui

prisma/
├── schema.prisma    # Esquema de base de datos
├── seed.ts          # Datos de ejemplo
└── templates/       # Plantillas de tablas
```

## Desarrollo

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilación para producción
npm run lint         # Ejecutar linter
npm run typecheck    # Verificación de tipos
npm run test:run     # Ejecutar pruebas
npm run test:e2e     # Ejecutar pruebas E2E
npm run db:studio    # Abrir Prisma Studio
npm run build:analyze # Analizar tamaño del bundle
```

## Autoalojamiento

Este proyecto está diseñado para ser autoalojable. Para ejecutarlo como un servicio independiente:

1. **Eliminar contenido de marketing** (opcional):
   - Elimina `app/(marketing)/` para una instalación mínima
   - El panel de administración, la API y la guía de tallas seguirán funcionando

2. **Configurar autenticación**:
   - Establece `DEMO_MODE=false`
   - Establece `ADMIN_USERNAME` y `ADMIN_PASSWORD`
   - Opcionalmente habilita `API_AUTH_REQUIRED=true`

3. **Desplegar**:
   - Docker: `docker build -t size-charts . && docker run -p 3000:3000 size-charts`
   - Node: `npm run build && npm start`

## Contribuciones

¡Las contribuciones son bienvenidas! Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para ver las directrices.

1. Haz un fork del repositorio
2. Crea una rama de funcionalidad: `git checkout -b feature/mi-funcionalidad`
3. Realiza tus cambios
4. Ejecuta las pruebas: `npm run test:run && npm run lint`
5. Envía un pull request

## Licencia

Licencia MIT - consulta [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**[Sitio web](https://www.sizecharts.dev)** · **[Documentación](https://www.sizecharts.dev/docs)** · **[GitHub](https://github.com/mattdecrevel/size-charts)**

Hecho con [Next.js](https://nextjs.org/) · UI por [shadcn/ui](https://ui.shadcn.com/) · Base de datos por [Prisma](https://www.prisma.io/)

</div>
