# Catálogo de Componentes - Tastebook Pro

Documentación de componentes React reutilizables del proyecto.

## Estado Actual

**Componentes existentes:** Componentes base heredados de Anything AI (JSX)
**Componentes a crear:** Componentes nuevos en TypeScript (TSX)
**Estrategia:** Migración gradual de .jsx a .tsx al modificarlos

---

## Componentes Base (Existentes)

### Header

**Ubicación:** `/src/components/Header.jsx`

Header principal de la aplicación con navegación.

**Props:**
```typescript
// Sin props por ahora
```

**Estado:** JSX heredado - pendiente migración a TSX

---

### Sidebar

**Ubicación:** `/src/components/Sidebar.jsx`

Barra lateral con menú de navegación.

**Props:**
```typescript
// Sin props por ahora
```

**Estado:** JSX heredado - pendiente migración a TSX

---

## Componentes a Crear (Sprint 2+)

### RecipeCard

Tarjeta de receta para listas y grids.

**Ubicación:** `/src/components/recipes/RecipeCard.tsx`

**Props:**
```typescript
interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?: (id: string) => void;
  showActions?: boolean;
}
```

**Ejemplo:**
```tsx
<RecipeCard
  recipe={recipe}
  onClick={(id) => navigate(`/recipe/${id}`)}
  showActions={isOwner}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Features:**
- Imagen con fallback
- Título y descripción truncada
- Tiempo total, porciones, dificultad
- Rating promedio (estrellas)
- Tags
- Acciones: editar, eliminar, favorito
- Hover effects y animaciones

---

### RecipeEditor

Editor completo de recetas con formulario.

**Ubicación:** `/src/components/recipes/RecipeEditor.tsx`

**Props:**
```typescript
interface RecipeEditorProps {
  recipe?: Recipe; // Para edición
  onSave: (data: CreateRecipeInput | UpdateRecipeInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
```

**Features:**
- Formulario react-hook-form + zod
- Validación en tiempo real
- Subida de imagen con preview
- Ingredientes dinámicos (añadir/eliminar)
- Pasos numerados drag & drop
- Auto-guardado (draft)
- Confirmación al cancelar con cambios

**Subcomponentes:**
- `IngredientInput` - Input con autocompletado
- `StepInput` - Input para pasos
- `ImageUploader` - Subida con preview y crop

---

### RecipeFilters

Panel de filtros avanzados para búsqueda.

**Ubicación:** `/src/components/recipes/RecipeFilters.tsx`

**Props:**
```typescript
interface RecipeFiltersProps {
  filters: RecipeFilters;
  onChange: (filters: RecipeFilters) => void;
  onReset: () => void;
}
```

**Features:**
- Búsqueda por texto (debounced)
- Multi-select de tags
- Slider de tiempo (0-120 min)
- Checkboxes de dificultad
- Slider de calorías
- Contador de filtros activos
- Botón "Limpiar filtros"

---

### WeeklyPlanner

Planificador semanal con drag & drop.

**Ubicación:** `/src/components/planner/WeeklyPlanner.tsx`

**Props:**
```typescript
interface WeeklyPlannerProps {
  weekStartDate: Date;
  mealPlan: MealPlan;
  recipes: Recipe[];
  onUpdateMeal: (date: string, mealType: MealType, recipeId: string, servings: number) => void;
  onRemoveMeal: (date: string, mealType: MealType) => void;
}
```

**Features:**
- 7 columnas (lun-dom)
- 4 filas por día (desayuno/comida/cena/snack)
- Drag & drop de recetas
- Selector de semana (prev/next)
- Totales por día (calorías, tiempo)
- Código de colores por comida
- Responsive (mobile: swipe horizontal)

**Subcomponentes:**
- `DayColumn` - Columna de un día
- `MealSlot` - Slot para una comida
- `RecipeSidebar` - Lista arrastrable de recetas

---

### ShoppingList

Lista de compra inteligente con sincronización realtime.

**Ubicación:** `/src/components/shopping/ShoppingList.tsx`

**Props:**
```typescript
interface ShoppingListProps {
  mealPlanId: string;
  items: ShoppingListItem[];
  onToggleItem: (itemId: string, checked: boolean) => void;
  onAddItem: (item: Omit<ShoppingListItem, 'id'>) => void;
  onRemoveItem: (itemId: string) => void;
}
```

**Features:**
- Agrupado por categorías
- Checkboxes para marcar comprado
- Añadir items manuales
- Eliminar items
- Contador de items pendientes
- Botón "Compartir lista"
- Sincronización realtime (WebSocket)
- Persistencia offline

---

### CookingMode

Modo cocina fullscreen paso a paso.

**Ubicación:** `/src/components/cooking/CookingMode.tsx`

**Props:**
```typescript
interface CookingModeProps {
  recipe: Recipe;
  onExit: () => void;
}
```

**Features:**
- Fullscreen mode
- Un paso a la vez
- Texto grande (min 24px)
- Botones gigantes de navegación
- Indicador de progreso
- Timers por paso
- Wake lock (pantalla encendida)
- Fondo oscuro
- Comandos de voz (futuro)

**Subcomponentes:**
- `StepView` - Vista de un paso
- `Timer` - Temporizador integrado
- `ProgressIndicator` - Barra de progreso

---

### RecipeDetail

Vista completa de una receta.

**Ubicación:** `/src/components/recipes/RecipeDetail.tsx`

**Props:**
```typescript
interface RecipeDetailProps {
  recipe: Recipe;
  reviews: Review[];
  onAddToMealPlan: () => void;
  onStartCooking: () => void;
  onAddReview: (review: CreateReviewInput) => void;
}
```

**Features:**
- Galería de imágenes
- Ingredientes con checkboxes
- Pasos numerados
- Info nutricional
- Rating y reviews
- Botones de acción
- Escalador de porciones
- Compartir en redes

**Subcomponentes:**
- `IngredientList` - Lista de ingredientes
- `StepList` - Lista de pasos
- `NutritionInfo` - Tabla nutricional
- `ReviewList` - Lista de reviews
- `ReviewForm` - Formulario de review

---

## Componentes UI Base (shadcn/ui)

### Button

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Click me
</Button>
```

**Variants:** default, destructive, outline, secondary, ghost, link
**Sizes:** default, sm, lg, icon

---

### Input

```tsx
import { Input } from '@/components/ui/input';

<Input type="text" placeholder="Buscar recetas..." />
```

---

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>Contenido</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

---

### Dialog

```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descripción</DialogDescription>
    </DialogHeader>
    {/* contenido */}
  </DialogContent>
</Dialog>
```

---

### Select

```tsx
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Selecciona..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opción 1</SelectItem>
    <SelectItem value="option2">Opción 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Contenido 1</TabsContent>
  <TabsContent value="tab2">Contenido 2</TabsContent>
</Tabs>
```

---

## Componentes de Loading

### Spinner

```tsx
import { Spinner } from '@/components/ui/spinner';

<Spinner size="lg" />
```

---

### Skeleton

```tsx
import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="h-12 w-full" />
```

---

## Componentes de Feedback

### Toast

```tsx
import { toast } from 'sonner';

toast.success('¡Receta creada!');
toast.error('Error al guardar');
toast.info('Información');
toast.warning('Advertencia');
```

---

### Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

<Alert>
  <AlertTitle>Título</AlertTitle>
  <AlertDescription>Descripción</AlertDescription>
</Alert>
```

---

## Patrones de Componentes

### Composición

```tsx
// Malo
<RecipeCard 
  title="..."
  description="..."
  image="..."
  tags={[...]}
  // 20 props más
/>

// Bueno
<RecipeCard recipe={recipe}>
  <RecipeImage src={recipe.image_url} />
  <RecipeTitle>{recipe.title}</RecipeTitle>
  <RecipeDescription>{recipe.description}</RecipeDescription>
  <RecipeTags tags={recipe.tags} />
</RecipeCard>
```

---

### Render Props

```tsx
<RecipeList>
  {({ recipe, index }) => (
    <RecipeCard key={recipe.id} recipe={recipe} index={index} />
  )}
</RecipeList>
```

---

### Compound Components

```tsx
<Form>
  <Form.Field name="title">
    <Form.Label>Título</Form.Label>
    <Form.Input />
    <Form.Error />
  </Form.Field>
</Form>
```

---

## Accesibilidad

Todos los componentes deben cumplir con WCAG AA:

- Roles ARIA apropiados
- Labels en inputs
- Alt text en imágenes
- Navegación por teclado
- Focus visible
- Contraste de colores adecuado

**Ejemplo:**
```tsx
<button
  aria-label="Eliminar receta"
  aria-describedby="delete-description"
  onClick={handleDelete}
>
  <TrashIcon aria-hidden="true" />
</button>
<span id="delete-description" className="sr-only">
  Esta acción no se puede deshacer
</span>
```

---

**Última actualización:** 15 Nov 2025  
**Próxima actualización:** Al completar Sprint 2 (RecipeEditor)
