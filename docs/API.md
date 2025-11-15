# API Documentation - Tastebook Pro

Documentación de los servicios API y hooks personalizados del proyecto.

## Servicios (Services)

### RecipeService

Servicio para operaciones CRUD de recetas con Supabase.

**Ubicación:** `/src/lib/api/recipes.ts`

#### Métodos

##### `fetchRecipes(filters?, sortBy?, sortOrder?)`

Obtiene lista de recetas con filtros opcionales.

**Parámetros:**
- `filters?: RecipeFilters` - Filtros de búsqueda
  - `search?: string` - Búsqueda por texto
  - `tags?: string[]` - Filtrar por tags
  - `maxTime?: number` - Tiempo máximo total (minutos)
  - `difficulty?: 'facil' | 'media' | 'dificil'`
  - `maxCalories?: number` - Calorías máximas
  - `isPublic?: boolean` - Solo públicas
  - `userId?: string` - Usuario específico
- `sortBy?: RecipeSortBy` - Campo para ordenar (default: 'created_at')
- `sortOrder?: 'asc' | 'desc'` - Orden (default: 'desc')

**Returns:** `Promise<Recipe[]>`

**Ejemplo:**
```typescript
const recipes = await RecipeService.fetchRecipes({
  tags: ['vegetariano'],
  maxTime: 30,
  difficulty: 'facil'
}, 'rating_avg', 'desc');
```

---

##### `fetchRecipeById(id)`

Obtiene una receta por su UUID. Incrementa contador de vistas automáticamente.

**Parámetros:**
- `id: string` - UUID de la receta

**Returns:** `Promise<Recipe | null>`

**Ejemplo:**
```typescript
const recipe = await RecipeService.fetchRecipeById('uuid-here');
```

---

##### `createRecipe(input)`

Crea una nueva receta. Requiere autenticación.

**Parámetros:**
- `input: CreateRecipeInput` - Datos de la receta

**Returns:** `Promise<Recipe>`

**Validaciones:**
- Usuario debe estar autenticado
- `user_id` debe coincidir con usuario autenticado

**Ejemplo:**
```typescript
const newRecipe = await RecipeService.createRecipe({
  user_id: currentUser.id,
  title: 'Pasta Carbonara',
  description: 'Receta italiana clásica',
  ingredients: [
    { name: 'Pasta', quantity: 400, unit: 'g', category: 'Despensa' }
  ],
  steps: ['Paso 1', 'Paso 2'],
  prep_time: 10,
  cook_time: 15,
  servings: 4,
  difficulty: 'media',
  is_public: true,
  tags: ['italiana', 'pasta']
});
```

---

##### `updateRecipe(id, input)`

Actualiza una receta existente. Solo el dueño puede actualizar.

**Parámetros:**
- `id: string` - UUID de la receta
- `input: UpdateRecipeInput` - Campos a actualizar (parcial)

**Returns:** `Promise<Recipe>`

**Ejemplo:**
```typescript
const updated = await RecipeService.updateRecipe('uuid', {
  title: 'Nuevo título',
  is_public: true
});
```

---

##### `deleteRecipe(id)`

Elimina una receta. Solo el dueño puede eliminar. También elimina la imagen asociada de Storage.

**Parámetros:**
- `id: string` - UUID de la receta

**Returns:** `Promise<void>`

**Ejemplo:**
```typescript
await RecipeService.deleteRecipe('uuid');
```

---

##### `uploadRecipeImage(file, recipeId?)`

Sube una imagen a Supabase Storage.

**Parámetros:**
- `file: File` - Archivo de imagen
- `recipeId?: string` - UUID de receta (opcional)

**Returns:** `Promise<string>` - URL pública de la imagen

**Validaciones:**
- Tipos permitidos: JPEG, PNG, WebP
- Tamaño máximo: 5MB
- Usuario debe estar autenticado

**Ejemplo:**
```typescript
const imageUrl = await RecipeService.uploadRecipeImage(file, recipeId);
```

---

## Hooks Personalizados

### useRecipes

Hook principal para listar recetas con filtros.

**Ubicación:** `/src/hooks/useRecipes.ts`

**Parámetros:**
- `filters?: RecipeFilters` - Filtros de búsqueda
- `sortBy?: RecipeSortBy` - Campo para ordenar
- `sortOrder?: 'asc' | 'desc'` - Orden
- `options?: { enabled?: boolean }` - Opciones React Query

**Returns:**
```typescript
{
  data: Recipe[] | undefined,
  isLoading: boolean,
  error: Error | null,
  refetch: () => void,
  // ... más propiedades de useQuery
}
```

**Características:**
- Cache automático (stale time: 5 min)
- Refetch en focus de ventana
- Invalidación automática

**Ejemplo:**
```typescript
function RecipeList() {
  const { data: recipes, isLoading, error } = useRecipes({
    tags: ['italiana'],
    maxTime: 45
  });
  
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return (
    <div>
      {recipes?.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
```

---

### useRecipe

Hook para obtener una receta por ID.

**Parámetros:**
- `id: string` - UUID de la receta
- `options?: { enabled?: boolean }` - Opciones React Query

**Returns:** Igual que `useRecipes` pero con `Recipe | null`

**Ejemplo:**
```typescript
function RecipeDetail({ id }: { id: string }) {
  const { data: recipe, isLoading } = useRecipe(id);
  
  if (isLoading) return <Spinner />;
  if (!recipe) return <NotFound />;
  
  return <RecipeView recipe={recipe} />;
}
```

---

### useCreateRecipe

Hook para crear recetas con optimistic updates.

**Returns:**
```typescript
{
  mutate: (input: CreateRecipeInput) => void,
  mutateAsync: (input: CreateRecipeInput) => Promise<Recipe>,
  isPending: boolean,
  isError: boolean,
  error: Error | null,
  // ... más propiedades de useMutation
}
```

**Comportamiento:**
- Invalida cache de listas automáticamente
- Añade receta al cache de detalle
- Muestra UI de carga durante creación

**Ejemplo:**
```typescript
function CreateRecipeForm() {
  const createRecipe = useCreateRecipe();
  
  const handleSubmit = async (data: CreateRecipeInput) => {
    try {
      const newRecipe = await createRecipe.mutateAsync(data);
      navigate(`/recipe/${newRecipe.id}`);
      toast.success('¡Receta creada!');
    } catch (error) {
      toast.error('Error al crear receta');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* campos */}
      <button disabled={createRecipe.isPending}>
        {createRecipe.isPending ? 'Guardando...' : 'Crear'}
      </button>
    </form>
  );
}
```

---

### useUpdateRecipe

Hook para actualizar recetas con optimistic updates y rollback.

**Returns:** Similar a `useCreateRecipe` pero con parámetros `{ id, data }`

**Comportamiento:**
- Optimistic update (UI se actualiza inmediatamente)
- Rollback automático si falla
- Invalidación de cache

**Ejemplo:**
```typescript
function EditRecipeForm({ recipeId }: { recipeId: string }) {
  const updateRecipe = useUpdateRecipe();
  
  const handleSubmit = async (data: UpdateRecipeInput) => {
    try {
      await updateRecipe.mutateAsync({ id: recipeId, data });
      toast.success('¡Receta actualizada!');
    } catch (error) {
      toast.error('Error al actualizar');
    }
  };
  
  return <form onSubmit={handleSubmit}>{/* campos */}</form>;
}
```

---

### useDeleteRecipe

Hook para eliminar recetas con optimistic delete.

**Returns:** Similar a otros mutations pero con `mutate: (id: string) => void`

**Comportamiento:**
- Elimina de UI inmediatamente
- Rollback si falla
- Limpia cache

**Ejemplo:**
```typescript
function DeleteButton({ recipeId }: { recipeId: string }) {
  const deleteRecipe = useDeleteRecipe();
  
  const handleDelete = async () => {
    if (!confirm('¿Seguro?')) return;
    
    try {
      await deleteRecipe.mutateAsync(recipeId);
      navigate('/recipes');
      toast.success('Receta eliminada');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };
  
  return (
    <button
      onClick={handleDelete}
      disabled={deleteRecipe.isPending}
    >
      Eliminar
    </button>
  );
}
```

---

### useUploadRecipeImage

Hook para subir imágenes de recetas.

**Returns:** Mutation standard con `mutate: ({ file, recipeId? }) => void`

**Ejemplo:**
```typescript
function ImageUploader() {
  const uploadImage = useUploadRecipeImage();
  
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const url = await uploadImage.mutateAsync({ file });
      console.log('URL:', url);
    } catch (error) {
      toast.error('Error al subir imagen');
    }
  };
  
  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleChange}
      disabled={uploadImage.isPending}
    />
  );
}
```

---

### useRecipesActions

Hook compuesto que combina todos los hooks de recetas.

**Parámetros:**
- `filters?: RecipeFilters` - Filtros para lista

**Returns:**
```typescript
{
  // Data
  recipes: Recipe[] | undefined,
  isLoading: boolean,
  error: Error | null,
  
  // Methods
  refetch: () => void,
  createRecipe: (input: CreateRecipeInput) => Promise<Recipe>,
  updateRecipe: ({ id, data }) => Promise<Recipe>,
  deleteRecipe: (id: string) => Promise<void>,
  uploadImage: ({ file, recipeId? }) => Promise<string>,
  
  // States
  isCreating: boolean,
  isUpdating: boolean,
  isDeleting: boolean,
  isUploading: boolean,
}
```

**Ejemplo:**
```typescript
function RecipeManager() {
  const {
    recipes,
    isLoading,
    createRecipe,
    deleteRecipe,
  } = useRecipesActions({ tags: ['favoritas'] });
  
  // Acceso a todos los métodos CRUD
}
```

---

## Query Keys

Constantes para identificar queries en React Query:

```typescript
export const recipeKeys = {
  all: ['recipes'],
  lists: () => ['recipes', 'list'],
  list: (filters) => ['recipes', 'list', filters],
  details: () => ['recipes', 'detail'],
  detail: (id) => ['recipes', 'detail', id],
};
```

**Uso:**
```typescript
// Invalidar todas las recetas
queryClient.invalidateQueries({ queryKey: recipeKeys.all });

// Invalidar solo listas
queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });

// Invalidar receta específica
queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
```

---

## Manejo de Errores

Todos los servicios y hooks lanzan errores tipados que deben ser manejados:

```typescript
try {
  const recipe = await RecipeService.fetchRecipeById(id);
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
    toast.error(error.message);
  }
}
```

**Errores comunes:**
- `"Debes estar autenticado..."` - Usuario no autenticado
- `"No tienes permisos..."` - Intento de modificar receta ajena
- `"Receta no encontrada"` - ID inválido o eliminado
- `"Error al obtener recetas: ..."` - Error de Supabase/DB

---

## Próximas Implementaciones

- [ ] `MealPlanService` - Gestión de planificador semanal
- [ ] `ShoppingListService` - Lista de compra con sync realtime
- [ ] `CollectionService` - Colecciones personalizadas
- [ ] `ReviewService` - Sistema de reviews y ratings
- [ ] `AchievementService` - Logros y gamificación

---

**Última actualización:** 15 Nov 2025
