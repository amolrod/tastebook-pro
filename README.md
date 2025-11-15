# Tastebook Pro

Plataforma web de gestión de recetas con planificación inteligente de comidas, lista de compra automática y modo cocina fullscreen. Proyecto full-stack con Next.js, Supabase y React Query.

## 🚀 Features

### ✅ Implementadas
- ✅ Configuración TypeScript con soporte .jsx y .tsx coexistentes
- ✅ Cliente Supabase configurado con helpers de autenticación
- ✅ Dependencias instaladas: @supabase/supabase-js, zod, @tanstack/react-query
- ✅ RecipeService completo con CRUD y subida de imágenes
- ✅ useRecipes hook con React Query y optimistic updates
- ✅ Documentación completa (README, SETUP, ARCHITECTURE, DATABASE, API, COMPONENTS, ROADMAP)
- ✅ Tipos TypeScript para toda la base de datos
- ✅ Template .env.example
- ✅ Repositorio Git inicializado y sincronizado con GitHub

### ⏳ En Progreso
- ⏳ CRUD completo de recetas
- ⏳ Sistema de autenticación

### ❌ Pendientes
- ❌ Editor de recetas con subida de imágenes
- ❌ Planificador semanal con drag & drop
- ❌ Lista de compra inteligente con sincronización tiempo real
- ❌ Modo cocina fullscreen con timers
- ❌ Sistema de gamificación y logros
- ❌ Búsqueda avanzada con filtros
- ❌ Importación desde URLs
- ❌ Colecciones personalizadas
- ❌ Sistema de reviews y ratings
- ❌ PWA con modo offline

## 🛠️ Stack Tecnológico

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **Row Level Security (RLS)** para seguridad de datos

### Frontend & Hosting
- **React Router 7.9+** (App Router)
- **TypeScript 5.9+** (strict mode)
- **Tailwind CSS 3.4+** para estilos
- **Vercel** para hosting

### Librerías Principales
- `@supabase/supabase-js` ^2.81 - Cliente de Supabase
- `@tanstack/react-query` ^5.90 - Gestión de estado servidor
- `@dnd-kit/core` ^6.3 - Drag & drop
- `zod` ^4.1 - Validación de esquemas
- `date-fns` ^4.1 - Manejo de fechas
- `lucide-react` ^0.358 - Iconografía
- `react-hook-form` ^7.66 - Formularios
- `motion` ^12.23 - Animaciones

## 📋 Setup Instructions

### 1. Clonar el repositorio
```bash
git clone https://github.com/amolrod/tastebook-pro.git
cd tastebook-pro
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# Supabase
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key

# Opcional: para features avanzadas
STRIPE_SECRET_KEY=tu_stripe_key
```

### 4. Ejecutar migraciones de base de datos
```bash
# Ejecutar en Supabase Dashboard SQL Editor
# Ver archivos en /docs/DATABASE.md
```

### 5. Crear bucket de Storage en Supabase
```bash
# Bucket: recipe-images
# Políticas: public read, authenticated write
```

### 6. Iniciar servidor de desarrollo
```bash
cd apps/web
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar servidor desarrollo

# Type checking
pnpm typecheck        # Verificar tipos TypeScript

# Build (próximamente)
# pnpm build          # Build producción
# pnpm lint           # Ejecutar linter
# pnpm test           # Ejecutar tests
```

## 📁 Estructura del Proyecto

```
tastebook-pro/
├── apps/
│   ├── web/                    # Aplicación web principal
│   │   ├── src/
│   │   │   ├── app/           # Rutas y páginas
│   │   │   ├── components/    # Componentes React
│   │   │   ├── lib/           # Utilidades y servicios
│   │   │   │   ├── supabase.ts      # Cliente Supabase
│   │   │   │   └── api/             # Servicios API
│   │   │   ├── hooks/         # Custom hooks
│   │   │   └── utils/         # Funciones helper
│   │   ├── public/            # Assets estáticos
│   │   └── package.json
│   └── mobile/                 # App móvil (futuro)
├── docs/                       # Documentación técnica
├── README.md
└── CHANGELOG.md
```

## 📖 Documentación Adicional

- [SETUP.md](./docs/SETUP.md) - Guía detallada de configuración
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Arquitectura del proyecto
- [DATABASE.md](./docs/DATABASE.md) - Esquema de base de datos
- [API.md](./docs/API.md) - Documentación de servicios
- [COMPONENTS.md](./docs/COMPONENTS.md) - Catálogo de componentes
- [ROADMAP.md](./docs/ROADMAP.md) - Roadmap y próximos pasos

## 🔗 Enlaces

- **Repositorio:** https://github.com/amolrod/tastebook-pro
- **Supabase Dashboard:** [Tu proyecto Supabase]
- **Deployment:** [URL cuando esté deployado]

## 📝 Workflow de Desarrollo

### Commits
Seguimos **Conventional Commits**:
```bash
feat(scope): descripción corta
fix(scope): corrección de bug
refactor(scope): refactorización
docs: actualización documentación
test: añadir tests
chore: tareas mantenimiento
```

### Branches
- `main` - Branch principal estable
- `feature/*` - Features grandes

## 🤝 Contribución

Este es un proyecto personal en desarrollo activo. Pull requests y sugerencias son bienvenidas.

## 📄 Licencia

MIT License - ver LICENSE para más detalles

---

**Última actualización:** 15 de noviembre de 2025  
**Versión:** 0.1.0 (Sprint 1 - Setup inicial)
