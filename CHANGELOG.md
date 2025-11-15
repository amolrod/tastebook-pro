# Changelog

Registro cronológico de cambios en Tastebook Pro.

## [15 Nov 2025] - Sprint 1: Setup Inicial

### ✨ Features Añadidas
- Configuración inicial del proyecto con Git
- TypeScript configurado con soporte .jsx y .tsx coexistentes (allowJs: true)
- Instalación de dependencias base: @supabase/supabase-js ^2.81, zod ^4.1, @tanstack/react-query ^5.90
- Cliente Supabase completo con helpers (getCurrentUser, getCurrentSession, isAuthenticated, signOut)
- RecipeService implementado con métodos CRUD completos:
  - fetchRecipes() con filtros avanzados (search, tags, tiempo, dificultad, calorías)
  - fetchRecipeById() con incremento automático de vistas
  - createRecipe() con validación de permisos
  - updateRecipe() con validación de propiedad
  - deleteRecipe() con limpieza de Storage
  - uploadRecipeImage() con validación de tipo y tamaño
- useRecipes hook con React Query:
  - useRecipes() para listar con cache
  - useRecipe() para obtener por ID
  - useCreateRecipe() con optimistic updates
  - useUpdateRecipe() con rollback automático
  - useDeleteRecipe() con optimistic delete
  - useUploadRecipeImage() para subida de imágenes
  - useRecipesActions() hook compuesto
- Tipos TypeScript completos para base de datos (Database, Recipe, User, MealPlan, etc.)
- Query keys para React Query (recipeKeys)

### 📝 Documentación
- README.md completo con features, stack, setup y estructura
- CHANGELOG.md iniciado con formato estructurado
- docs/SETUP.md con guía paso a paso de configuración
- docs/ARCHITECTURE.md con diagrama de arquitectura y patrones
- docs/DATABASE.md con esquema completo de PostgreSQL y RLS
- docs/API.md con documentación de servicios y hooks
- docs/COMPONENTS.md con catálogo de componentes (actual y futuro)
- docs/ROADMAP.md con sprints detallados y tareas

### 🔧 Configuración
- tsconfig.json actualizado para soportar migración gradual JSX → TSX
- package.json con Supabase client y zod añadidos
- .env.example template creado
- client.d.ts con tipos para import.meta.env

### 🔗 Git & GitHub
- Repositorio inicializado localmente
- Remoto configurado: https://github.com/amolrod/tastebook-pro
- Commit inicial y push a main exitoso
- Merge con LICENSE del repositorio remoto

### 📋 Próximos Pasos
- Crear cliente Supabase en /src/lib/supabase.ts
- Implementar useRecipes() hook con CRUD completo
- Conectar biblioteca de recetas con datos reales
- Crear RecipeService con operaciones API

---

## Formato de Entradas Futuras

### ✨ Features Añadidas
- Nuevas funcionalidades implementadas

### 🐛 Bugs Corregidos
- Fixes aplicados

### 🔨 Refactorizaciones
- Mejoras de código sin cambiar funcionalidad

### 📝 Documentación
- Actualizaciones de docs

### 🧪 Tests
- Tests añadidos o modificados

### 🚀 Deployment
- Cambios relacionados con producción
