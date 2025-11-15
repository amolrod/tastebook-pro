# Roadmap - Tastebook Pro

Planificación detallada del desarrollo por sprints con tareas específicas y checkpoints.

## Estado Actual

**Sprint:** 1 - Setup Inicial  
**Última actualización:** 15 Nov 2025  
**Progreso general:** 15%

---

## Sprint 1 - Conectividad Backend (Semana 1)

**Objetivo:** Configurar infraestructura base y conectar Supabase con CRUD completo de recetas.

### ✅ Completado

- [x] Configurar TypeScript con soporte .jsx y .tsx
- [x] Instalar dependencias: @supabase/supabase-js, zod, react-query
- [x] Crear documentación inicial (README, CHANGELOG, docs/)

### ⏳ En Progreso

- [ ] Configurar cliente Supabase en `/src/lib/supabase.ts`
- [ ] Crear custom hooks en `/src/hooks/`:
  - [ ] `useRecipes()` - CRUD completo con React Query
  - [ ] `useAuth()` - wrapper Supabase Auth
  - [ ] `useMealPlan()` - gestión plan semanal
  - [ ] `useShoppingList()` - sincronización tiempo real
- [ ] Implementar RecipeService en `/src/lib/api/recipes.ts`
- [ ] Conectar Biblioteca de Recetas con datos reales
- [ ] Eliminar datos mock/hardcodeados

### Checkpoint Sprint 1
```bash
git add .
git commit -m "feat(backend): connect Supabase and implement recipe CRUD"
git push origin main
```

---

## Sprint 2 - Editor de Recetas (Semana 1-2)

**Objetivo:** Crear editor completo de recetas con validación y subida de imágenes.

### Tareas

- [ ] Crear esquema Zod de validación en `/src/lib/validations/recipe.ts`
- [ ] Crear RecipeEditor component en `/src/components/recipes/RecipeEditor.tsx`
  - [ ] Formulario con react-hook-form + zod
  - [ ] Campo título (min 3, max 100 caracteres)
  - [ ] Ingredientes: array dinámico con nombre, cantidad, unidad, categoría
  - [ ] Pasos: array dinámico de strings numerados automáticamente
  - [ ] Campos: tiempo prep, tiempo cocción, porciones, dificultad
  - [ ] Tags: multi-select con sugerencias
  - [ ] Subida de imagen con preview
  - [ ] Compresión automática de imágenes (max 800x800px, 80% quality)
  - [ ] Botones: Guardar como privado, Guardar como público, Cancelar
- [ ] Crear componente IngredientInput con autocompletado
- [ ] Crear componente StepInput con drag & drop para reordenar
- [ ] Crear ruta `/recipe/new` para crear recetas
- [ ] Crear ruta `/recipe/[id]/edit` para editar recetas
- [ ] Implementar `uploadRecipeImage()` en RecipeService
- [ ] Añadir loading states y error handling
- [ ] Añadir confirmación al cancelar con cambios sin guardar

### Checkpoint Sprint 2
```bash
git add .
git commit -m "feat(recipes): add full recipe editor with image upload and validation"
git push origin main
```

---

## Sprint 3 - Planificador Funcional (Semana 2)

**Objetivo:** Implementar planificador semanal con drag & drop y lista de compra inteligente.

### Tareas

#### Planificador Semanal
- [ ] Instalar y configurar @dnd-kit/core
- [ ] Crear componente WeeklyPlanner en `/src/components/planner/WeeklyPlanner.tsx`
- [ ] Crear componente DayColumn con 4 slots (desayuno/comida/cena/snack)
- [ ] Implementar RecipeSidebar con lista arrastrable de recetas
- [ ] Implementar drag & drop:
  - [ ] Arrastrar desde sidebar a calendario
  - [ ] Arrastrar dentro del calendario para mover
  - [ ] Arrastrar fuera para eliminar
- [ ] Código de colores por tipo de comida
- [ ] Persistir cambios en Supabase `meal_plans` tabla
- [ ] Añadir selector de semana (prev/next)
- [ ] Mostrar totales: calorías, tiempo de cocción por día

#### Lista de Compra Inteligente
- [ ] Crear componente ShoppingList en `/src/components/shopping/ShoppingList.tsx`
- [ ] Implementar lógica de agregación de ingredientes:
  - [ ] Extraer de todas las recetas del plan semanal
  - [ ] Detectar duplicados por nombre (normalizado)
  - [ ] Sumar cantidades de misma unidad
  - [ ] Convertir unidades compatibles (g ↔ kg, ml ↔ L)
- [ ] Agrupar por categorías: Verduras, Carnes, Lácteos, Despensa, Otros
- [ ] Implementar checkboxes para marcar como comprado
- [ ] Sincronización tiempo real con Supabase Realtime
- [ ] Permitir añadir items manuales
- [ ] Botón "Compartir lista" (copiar al portapapeles)
- [ ] Persistir estado de checkboxes

### Checkpoint Sprint 3
```bash
git add .
git commit -m "feat(planner): implement drag-drop weekly calendar and smart shopping list with realtime sync"
git push origin main
```

---

## Sprint 4 - Modo Cocina (Semana 3)

**Objetivo:** Crear experiencia de cocina fullscreen con timers y escalado de porciones.

### Tareas

#### Página de Detalle
- [ ] Crear ruta `/recipe/[id]` con RecipeDetail component
- [ ] Galería de imágenes (si hay múltiples)
- [ ] Sección ingredientes con checkbox para marcar usados
- [ ] Sección pasos numerados
- [ ] Info nutricional (calorías, proteína, carbohidratos, grasas)
- [ ] Sistema de rating (estrellas) con average
- [ ] Reviews de otros usuarios
- [ ] Botones acción:
  - [ ] "Añadir a plan" → Modal para seleccionar día/comida
  - [ ] "Modo cocina" → Navegar a `/recipe/[id]/cook`
  - [ ] "Editar" (si es dueño)
  - [ ] "Compartir" → Copiar link
  - [ ] "Guardar en colección" → Modal con colecciones

#### Modo Cocina
- [ ] Crear ruta `/recipe/[id]/cook` con CookingMode component
- [ ] Diseño fullscreen con fondo oscuro
- [ ] Vista paso a paso (un paso a la vez)
- [ ] Texto extra grande y legible (min 24px)
- [ ] Botones gigantes de navegación: "Anterior" / "Siguiente"
- [ ] Indicador de progreso: "Paso 3 de 8"
- [ ] Timer integrado por paso (si el paso menciona tiempo)
- [ ] Botón "Pausar/Reanudar timer"
- [ ] Mantener pantalla encendida (wake lock API)
- [ ] Botón "Salir de modo cocina" con confirmación
- [ ] Soporte para comandos de voz (opcional, futuro)

#### Escalador de Porciones
- [ ] Añadir selector de porciones en RecipeDetail
- [ ] Recalcular cantidades de ingredientes proporcionalmente
- [ ] Actualizar info nutricional proporcionalmente
- [ ] Mostrar conversión visual: "Original: 4 → Ajustado: 6"

### Checkpoint Sprint 4
```bash
git add .
git commit -m "feat(cooking): add fullscreen cooking mode with timers and dynamic portion scaler"
git push origin main
```

---

## Sprint 5 - Gamificación y Social (Semana 4)

**Objetivo:** Añadir sistema de logros y perfiles de usuario.

### Tareas

#### Sistema de Logros
- [ ] Crear tabla `achievements` y `user_achievements` en DB
- [ ] Insertar logros predefinidos (ver DATABASE.md)
- [ ] Implementar AchievementService en `/src/lib/api/achievements.ts`
- [ ] Crear hook `useAchievements()`
- [ ] Implementar lógica de desbloqueo automático:
  - [ ] Trigger después de crear receta
  - [ ] Trigger después de completar plan semanal
  - [ ] Trigger después de recibir likes
- [ ] Crear componente AchievementToast (notificación al desbloquear)
- [ ] Crear componente AchievementBadge (mostrar badge)
- [ ] Crear página `/achievements` con grid de todos los logros

#### Perfiles de Usuario
- [ ] Crear ruta `/profile` con UserProfile component
- [ ] Mostrar stats: recetas creadas, recetas cocinadas, logros
- [ ] Grid de logros desbloqueados
- [ ] Lista de recetas públicas del usuario
- [ ] Permitir editar perfil (nombre, bio, avatar)
- [ ] Crear ruta `/profile/[userId]` para perfiles públicos

#### Sistema de Reviews
- [ ] Crear componente ReviewForm en RecipeDetail
- [ ] Permitir rating (1-5 estrellas) y comentario
- [ ] Subir fotos del resultado (opcional)
- [ ] Listar reviews con paginación
- [ ] Calcular average rating automáticamente (trigger DB)
- [ ] Permitir editar/eliminar review propia

### Checkpoint Sprint 5
```bash
git add .
git commit -m "feat(social): add achievements system, user profiles and recipe reviews"
git push origin main
```

---

## Sprint 6 - Búsqueda Avanzada (Semana 5)

**Objetivo:** Mejorar búsqueda y añadir widget "¿Qué puedo cocinar hoy?".

### Tareas

#### Búsqueda Avanzada
- [ ] Crear componente RecipeFilters con:
  - [ ] Búsqueda por texto (título, ingredientes)
  - [ ] Filtro por tags (multi-select)
  - [ ] Filtro por tiempo total (slider: 0-120 min)
  - [ ] Filtro por dificultad (checkbox: fácil/media/difícil)
  - [ ] Filtro por calorías (slider: 0-1000 kcal)
  - [ ] Ordenar por: más reciente, más popular, mejor rating
- [ ] Implementar full-text search en PostgreSQL (ya creado en DB)
- [ ] Añadir debouncing a búsqueda por texto (300ms)
- [ ] Paginación infinita con React Query
- [ ] Mostrar contador de resultados
- [ ] Guardar filtros en URL query params

#### Widget "¿Qué puedo cocinar hoy?"
- [ ] Crear componente IngredientMatcher
- [ ] Input multi-select para ingredientes disponibles
- [ ] Usar función SQL `search_recipes_by_ingredients()`
- [ ] Mostrar recetas ordenadas por % de coincidencia
- [ ] Mostrar ingredientes faltantes por receta
- [ ] Botón "Añadir faltantes a lista de compra"

### Checkpoint Sprint 6
```bash
git add .
git commit -m "feat(search): add advanced filters and ingredient matcher widget"
git push origin main
```

---

## Sprint 7 - Importación y PWA (Semana 5-6)

**Objetivo:** Añadir importación de recetas desde URLs y mejorar PWA.

### Tareas

#### Importación de Recetas
- [ ] Crear componente RecipeImporter
- [ ] Implementar parser de texto plano:
  - [ ] Detectar estructura (título, ingredientes, pasos)
  - [ ] Usar regex para extraer cantidades y unidades
  - [ ] Preview de receta parseada antes de guardar
- [ ] Implementar scraper de URLs (server-side):
  - [ ] Detectar sitios populares (Cookpad, Recetas Gratis, etc.)
  - [ ] Extraer metadatos y contenido
  - [ ] Parsear HTML con cheerio
  - [ ] Fallback a OpenGraph tags
- [ ] Botón "Importar desde URL" en página de crear receta
- [ ] Botón "Pegar texto" en página de crear receta

#### Mejoras PWA
- [ ] Actualizar manifest.json con iconos correctos
- [ ] Mejorar service worker para cache agresivo
- [ ] Implementar estrategia cache-first para recetas
- [ ] Implementar network-first para listas y planes
- [ ] Añadir página offline `/offline`
- [ ] Sincronizar cambios offline cuando vuelva conexión
- [ ] Añadir botón "Instalar app" en header

#### Colecciones Personalizadas
- [ ] Crear página `/collections` con grid de colecciones
- [ ] Implementar drag & drop para añadir recetas a colecciones
- [ ] Permitir crear colecciones con nombre, icon y color
- [ ] Colecciones predeterminadas: Favoritos, Para probar
- [ ] Botón "Añadir a colección" en RecipeCard

### Checkpoint Sprint 7
```bash
git add .
git commit -m "feat(import): add URL scraper and text parser, improve PWA offline mode"
git push origin main
```

---

## Sprints Futuros (Backlog)

### Sprint 8 - Integración con Stripe
- [ ] Configurar Stripe account
- [ ] Implementar tier premium
- [ ] Features premium: recetas ilimitadas, almacenamiento extra, analytics
- [ ] Crear página de pricing

### Sprint 9 - Modo Oscuro y Accesibilidad
- [ ] Implementar dark mode con preferencia del sistema
- [ ] Auditoría de accesibilidad (WCAG AA)
- [ ] Añadir landmarks ARIA
- [ ] Mejorar navegación por teclado
- [ ] Añadir skip links

### Sprint 10 - Analytics y Dashboard
- [ ] Integrar Vercel Analytics
- [ ] Crear dashboard personal con estadísticas
- [ ] Gráficos: recetas por mes, comidas planificadas, logros
- [ ] Top 5 recetas más cocinadas

### Sprint 11 - Optimizaciones de Performance
- [ ] Code splitting avanzado
- [ ] Lazy loading de imágenes
- [ ] Preload de rutas críticas
- [ ] Optimizar bundle size
- [ ] Alcanzar Lighthouse score > 95

### Sprint 12 - Testing
- [ ] Configurar Vitest
- [ ] Tests unitarios para services y hooks
- [ ] Tests de integración para flujos principales
- [ ] E2E con Playwright
- [ ] Alcanzar > 80% code coverage

---

## Métricas de Éxito

### KPIs Técnicos
- ✅ TypeScript strict mode sin errores
- ⏳ Lighthouse Performance > 90
- ⏳ Lighthouse Accessibility > 95
- ⏳ Test coverage > 80%
- ⏳ Zero critical bugs en producción

### KPIs de Producto
- ⏳ 50+ recetas creadas (propias + importadas)
- ⏳ 10+ planes semanales completados
- ⏳ 20+ listas de compra generadas
- ⏳ 100% de features del MVP implementadas

---

**Última actualización:** 15 Nov 2025  
**Próxima revisión:** Al completar Sprint 1
