# Planificador Semanal - TasteBook Pro

## Descripción General

El planificador semanal es una funcionalidad completa que permite a los usuarios organizar sus comidas semanalmente, seleccionando recetas de su colección o del catálogo público.

## Características Implementadas

### ✅ Funcionalidades Principales

1. **Navegación por Semanas**
   - Vista de calendario con fechas reales
   - Navegar entre semanas (anterior/siguiente)
   - Botón para volver a la semana actual
   - Muestra rango de fechas y número de semana

2. **Gestión de Comidas**
   - 4 tipos de comidas: Desayuno, Comida, Cena, Snack
   - Agregar recetas a cualquier día y comida
   - Eliminar recetas del plan
   - Vista previa de recetas con imagen y detalles

3. **Selector de Recetas**
   - Modal con todas las recetas disponibles
   - Búsqueda en tiempo real por título/descripción
   - Filtro por dificultad
   - Selector de porciones
   - Muestra recetas propias y públicas

4. **Persistencia de Datos**
   - Datos almacenados en Supabase (tabla `meal_plans`)
   - Auto-creación de planes si no existen
   - Actualización en tiempo real
   - Cache optimizado con React Query

5. **UX Mejorada**
   - Loading states durante operaciones
   - Toasts de confirmación/error
   - Hover effects y transiciones
   - Responsive design (móvil y escritorio)
   - Diseño consistente con el resto de la app

## Estructura de Archivos

```
apps/web/src/
├── lib/api/
│   └── meal-plans.ts          # Servicio API para meal plans
├── hooks/
│   └── useMealPlans.ts        # Hooks de React Query
├── components/planner/
│   ├── MealSlot.tsx           # Componente de slot de comida
│   └── RecipeSelectorModal.tsx # Modal de selección de recetas
└── app/planner/
    └── page.tsx               # Página principal del planificador
```

## Componentes

### MealPlanService (`lib/api/meal-plans.ts`)

Servicio para interactuar con la API de Supabase:

- `getMealPlan(userId, weekStartDate)` - Obtener plan de una semana
- `createMealPlan(userId, weekStartDate)` - Crear nuevo plan
- `getOrCreateMealPlan(userId, weekStartDate)` - Obtener o crear
- `updateMealPlan(planId, meals, notes)` - Actualizar plan completo
- `addRecipeToMealPlan(...)` - Agregar receta a un slot
- `removeRecipeFromMealPlan(...)` - Eliminar receta de un slot
- `deleteMealPlan(planId)` - Eliminar plan completo
- `getUserMealPlans(userId)` - Obtener todos los planes de un usuario

**Helpers:**
- `getMonday(date)` - Obtener el lunes de una semana
- `formatWeekStart(date)` - Formatear fecha para week_start_date
- `getWeekRange(weekStart)` - Obtener rango de fechas de una semana

### Hooks de React Query (`hooks/useMealPlans.ts`)

- `useMealPlan(userId, weekStartDate)` - Hook para obtener/crear plan
- `useUserMealPlans(userId)` - Hook para todos los planes del usuario
- `useAddRecipeToMealPlan()` - Mutation para agregar receta
- `useRemoveRecipeFromMealPlan()` - Mutation para eliminar receta
- `useUpdateMealPlan()` - Mutation para actualizar plan
- `useDeleteMealPlan()` - Mutation para eliminar plan

**Características:**
- Optimistic updates
- Cache management
- Toast notifications
- Error handling
- Invalidación automática de queries

### MealSlot Component (`components/planner/MealSlot.tsx`)

Componente que representa un slot de comida en el calendario.

**Props:**
- `day` - Día de la semana (monday, tuesday, etc.)
- `mealType` - Tipo de comida (desayuno, comida, cena, snack)
- `mealLabel` - Etiqueta visible del tipo de comida
- `mealColor` - Color del tipo de comida
- `meal` - Datos de la comida (opcional)
- `onAddRecipe` - Callback para agregar receta
- `onRemoveRecipe` - Callback para eliminar receta
- `isLoading` - Estado de carga

**Estados:**
- **Vacío**: Muestra botón "+ Agregar receta"
- **Con receta**: Muestra preview con imagen, título, tiempo y porciones
- **Loading**: Muestra spinner

### RecipeSelectorModal Component (`components/planner/RecipeSelectorModal.tsx`)

Modal para seleccionar recetas del catálogo.

**Props:**
- `isOpen` - Control de visibilidad
- `onClose` - Callback al cerrar
- `onSelectRecipe(recipeId, servings)` - Callback al seleccionar
- `title` - Título del modal (opcional)

**Características:**
- Búsqueda en tiempo real
- Filtro por dificultad
- Selector de porciones
- Grid responsive de recetas
- Preview con imagen, rating, tiempo y porciones
- Loading state

### PlannerPage (`app/planner/page.tsx`)

Página principal del planificador semanal.

**Funcionalidades:**
- Navegación por semanas (anterior/siguiente/actual)
- Grid de calendario 7x4 (días x comidas)
- Integración con MealSlot y RecipeSelectorModal
- Loading y error states
- Formato de fechas localizado en español
- Cálculo de número de semana

## Modelo de Datos

### Tabla: meal_plans

```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  meals JSONB NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);
```

### Estructura de meals (JSONB)

```typescript
{
  monday: {
    desayuno?: { recipe_id: string, servings: number },
    comida?: { recipe_id: string, servings: number },
    cena?: { recipe_id: string, servings: number },
    snack?: { recipe_id: string, servings: number }
  },
  tuesday: { ... },
  wednesday: { ... },
  thursday: { ... },
  friday: { ... },
  saturday: { ... },
  sunday: { ... }
}
```

## Flujo de Usuario

1. Usuario accede a `/planner`
2. Sistema carga o crea el plan de la semana actual
3. Usuario puede:
   - Navegar a otras semanas
   - Click en "Agregar receta" en cualquier slot vacío
   - Modal abre con todas las recetas disponibles
   - Usuario busca, filtra y selecciona receta
   - Selecciona número de porciones
   - Receta se agrega al plan (toast de confirmación)
4. Para eliminar:
   - Hover sobre receta asignada
   - Click en botón X
   - Receta se elimina (toast de confirmación)

## Consideraciones Técnicas

### Cache Strategy

React Query gestiona el cache con las siguientes configuraciones:
- `staleTime`: 5 minutos
- Optimistic updates para mejor UX
- Invalidación automática en mutaciones
- Cache por usuario y week_start_date

### Performance

- Lazy loading de recetas en modal
- Filtrado client-side para búsqueda instantánea
- Imágenes optimizadas
- Componentes memoizados donde necesario

### Responsive Design

- Grid se adapta a mobile (scroll horizontal si necesario)
- Modal fullscreen en móvil
- Botones con touch targets adecuados
- Sidebar colapsable

## Futuras Mejoras

### Prioridad Alta
- [ ] Drag & drop para mover recetas entre slots
- [ ] Duplicar plan a otra semana
- [ ] Copiar día completo
- [ ] Notas por día
- [ ] Imprimir plan semanal

### Prioridad Media
- [ ] Generar plan automático con IA
- [ ] Sugerencias basadas en preferencias
- [ ] Múltiples recetas por slot
- [ ] Vista lista (alternativa al grid)
- [ ] Exportar a calendario (iCal)

### Prioridad Baja
- [ ] Cálculos nutricionales reales
- [ ] Gráficas de macros
- [ ] Comparar planes
- [ ] Plantillas de planes
- [ ] Compartir planes públicos

## Testing

### Test Cases Manuales

1. **Navegación**
   - ✅ Navegar a semana anterior
   - ✅ Navegar a semana siguiente
   - ✅ Volver a semana actual
   - ✅ Fechas se calculan correctamente

2. **CRUD de Recetas**
   - ✅ Agregar receta a slot vacío
   - ✅ Eliminar receta de slot
   - ✅ Cambiar porciones al agregar
   - ✅ Buscar recetas en modal
   - ✅ Filtrar por dificultad

3. **Persistencia**
   - ✅ Plan se guarda en DB
   - ✅ Plan se carga al cambiar semana
   - ✅ Cambios persisten al recargar página

4. **UX**
   - ✅ Loading states funcionan
   - ✅ Toasts aparecen correctamente
   - ✅ Modal se cierra al seleccionar
   - ✅ Hover effects funcionan

## Troubleshooting

### Plan no se carga
- Verificar que el usuario esté autenticado
- Verificar policies RLS en Supabase
- Revisar logs de consola

### Recetas no aparecen en modal
- Verificar que hay recetas en la base de datos
- Verificar query de useRecipes
- Revisar filtros aplicados

### Cambios no persisten
- Verificar conexión a Supabase
- Revisar mutations en React Query
- Verificar formato de datos enviados

## Referencias

- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Framer Motion](https://www.framer.com/motion/)
