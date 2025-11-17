# 📋 Plan de Desarrollo - Tastebook Pro

**Fecha:** 15 Nov 2025  
**Estado actual:** Sprint 1 - Fase 1 (65% completo)  
**Objetivo:** Construir app funcional de gestión de recetas con CRUD completo, autenticación y planificación

---

## 🎯 Estado Actual del Proyecto

### ✅ Backend Completado (100%)

- **Base de datos:** 8 tablas definidas en `supabase_setup.sql`
  - users, recipes, meal_plans, shopping_lists, collections, reviews, achievements, user_achievements
  - Políticas RLS configuradas
  - Índices optimizados
  - Funciones útiles (search_recipes, generate_shopping_list)

- **Servicios:** RecipeService con 6 métodos CRUD
  - fetchRecipes (con filtros y ordenamiento)
  - fetchRecipeById
  - createRecipe
  - updateRecipe
  - deleteRecipe
  - uploadRecipeImage

- **React Query Hooks:** 7 hooks optimizados
  - useRecipes, useRecipe, useCreateRecipe, useUpdateRecipe, useDeleteRecipe, useUploadRecipeImage, useRecipesActions
  - Cache management
  - Optimistic updates
  - Error handling

- **Tipos TypeScript:** Completos con interfaces para todas las tablas

### ✅ Frontend Parcial (40%)

- **Páginas funcionando:**
  - ✅ Dashboard (con datos mock)
  - ✅ Recipes (conectada a Supabase con búsqueda)
  - ✅ Planner (con datos mock)
  - ✅ Shopping (con datos mock)

- **Componentes base:**
  - ✅ RecipeCard, LoadingSpinner, ErrorMessage
  - ✅ Header, Sidebar (legacy JSX)

- **Sistema de diseño:**
  - ✅ Paleta de colores documentada
  - ✅ Tipografías (Sora, Inter, Plus Jakarta)
  - ✅ Dark mode completo
  - ✅ Responsive mobile-first

### ❌ Funcionalidades Críticas Faltantes

1. **Editor de recetas** - No se pueden crear/editar desde UI
2. **Detalle de receta** - No se puede ver info completa
3. **Autenticación** - Login/Register no implementado (RLS bloquea inserts)
4. **Conexión Dashboard** - Stats usan datos mock
5. **Conexión Planner** - No persiste en Supabase
6. **Conexión Shopping List** - No persiste en Supabase

---

## 🚀 SPRINT 1 - Fundación y CRUD Básico

**Objetivo:** App con creación, lectura, edición y eliminación de recetas funcional  
**Duración:** 1 semana  
**Progreso actual:** 65%

### 🔴 Fase 1A: Configuración Inicial (15 min) - USUARIO

**Tareas previas antes de desarrollar:**

1. **Verificar variables de entorno**
   ```bash
   cd apps/web
   cat .env.local
   ```
   - Si no existe: `cp .env.example .env.local`
   - Editar con credenciales de Supabase:
     ```
     VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
     VITE_SUPABASE_ANON_KEY=tu-anon-key
     ```

2. **Ejecutar setup SQL en Supabase**
   - Dashboard → SQL Editor
   - Copiar contenido de `supabase_setup.sql`
   - Run
   - Verificar: `SELECT COUNT(*) FROM recipes;`

3. **Crear bucket de Storage**
   - Dashboard → Storage → New bucket
   - Nombre: `recipe-images`
   - Public: ✅
   - Max file size: 5MB
   - Allowed MIME: image/jpeg, image/png, image/webp

4. **Desactivar RLS temporalmente** (para testing sin auth)
   ```sql
   ALTER TABLE recipes DISABLE ROW LEVEL SECURITY;
   ```
   _Nota: Reactivar en Sprint 2 después de implementar auth_

5. **Verificar conexión**
   ```bash
   pnpm devrecipes.ts:280 Error in createRecipe: Error: Debes estar autenticado para crear una receta
    at Object.createRecipe (recipes.ts:277:15)

useRecipes.ts:210 Error creating recipe: Error: Debes estar autenticado para crear una receta
    at Object.createRecipe (recipes.ts:277:15)
RecipeEditor.tsx:93 ❌ Error creando receta: Error: Debes estar autenticado para crear una receta
    at Object.createRecipe (recipes.ts:277:15)
   ```
   - Abrir http://localhost:4000/recipes
   - Debería mostrar "No hay recetas"

---

### 🔴 Fase 1B: Editor de Recetas (6-8 horas)

**Prioridad:** CRÍTICA - Bloqueante para cualquier testing real

#### Archivos a Crear

**1. Validación con Zod** - `src/lib/validations/recipe.ts` (30 min)

```typescript
import { z } from 'zod';

export const IngredientSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  quantity: z.number().positive('Cantidad debe ser positiva'),
  unit: z.string().min(1, 'Unidad requerida'),
});

export const CreateRecipeSchema = z.object({
  title: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  description: z.string()
    .max(500, 'Máximo 500 caracteres')
    .optional(),
  ingredients: z.array(IngredientSchema)
    .min(1, 'Al menos 1 ingrediente'),
  steps: z.array(z.string().min(1, 'Paso no puede estar vacío'))
    .min(1, 'Al menos 1 paso'),
  prep_time: z.number().int().positive().optional(),
  cook_time: z.number().int().positive().optional(),
  servings: z.number().int().positive().default(4),
  difficulty: z.enum(['facil', 'media', 'dificil']),
  tags: z.array(z.string()).optional(),
  is_public: z.boolean().default(false),
});

export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;
```

**2. Componente IngredientList** - `src/components/recipes/IngredientList.tsx` (1 hora)

```typescript
'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Ingredient } from '@/types/database';

interface IngredientListProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  errors?: string;
}

export function IngredientList({ ingredients, onChange, errors }: IngredientListProps) {
  const addIngredient = () => {
    onChange([...ingredients, { name: '', quantity: 1, unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-black dark:text-white font-inter">
          Ingredientes *
        </label>
        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-1 text-sm text-[#10b981] hover:text-[#059669] font-semibold"
        >
          <Plus size={16} />
          Añadir
        </button>
      </div>

      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            placeholder="Ingrediente"
            value={ingredient.name}
            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
            className="flex-1 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white"
          />
          <input
            type="number"
            placeholder="Cant."
            value={ingredient.quantity}
            onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value))}
            className="w-20 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white"
          />
          <input
            type="text"
            placeholder="Unidad"
            value={ingredient.unit}
            onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
            className="w-24 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white"
          />
          <button
            type="button"
            onClick={() => removeIngredient(index)}
            className="p-2 text-red-500 hover:text-red-700"
          >
            <X size={20} />
          </button>
        </div>
      ))}

      {errors && (
        <p className="text-red-500 text-sm">{errors}</p>
      )}
    </div>
  );
}
```

**3. Componente StepList** - `src/components/recipes/StepList.tsx` (1 hora)

```typescript
'use client';

import { Plus, X } from 'lucide-react';

interface StepListProps {
  steps: string[];
  onChange: (steps: string[]) => void;
  errors?: string;
}

export function StepList({ steps, onChange, errors }: StepListProps) {
  const addStep = () => {
    onChange([...steps, '']);
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const updated = steps.map((step, i) => (i === index ? value : step));
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-black dark:text-white font-inter">
          Pasos de Preparación *
        </label>
        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-1 text-sm text-[#10b981] hover:text-[#059669] font-semibold"
        >
          <Plus size={16} />
          Añadir Paso
        </button>
      </div>

      {steps.map((step, index) => (
        <div key={index} className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-semibold text-sm">
            {index + 1}
          </span>
          <textarea
            value={step}
            onChange={(e) => updateStep(index, e.target.value)}
            placeholder={`Paso ${index + 1}`}
            rows={2}
            className="flex-1 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white resize-none"
          />
          <button
            type="button"
            onClick={() => removeStep(index)}
            className="p-2 text-red-500 hover:text-red-700 self-start"
          >
            <X size={20} />
          </button>
        </div>
      ))}

      {errors && (
        <p className="text-red-500 text-sm">{errors}</p>
      )}
    </div>
  );
}
```

**4. Componente RecipeEditor** - `src/components/recipes/RecipeEditor.tsx` (3-4 horas)

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRecipeSchema, type CreateRecipeInput } from '@/lib/validations/recipe';
import { useCreateRecipe } from '@/hooks/useRecipes';
import { IngredientList } from './IngredientList';
import { StepList } from './StepList';
import { Clock, Users } from 'lucide-react';
import type { Recipe, Ingredient } from '@/types/database';

interface RecipeEditorProps {
  initialData?: Partial<Recipe>;
  onSuccess?: (recipe: Recipe) => void;
  onCancel?: () => void;
}

const COMMON_TAGS = [
  'italiana', 'mexicana', 'española', 'asiática', 'vegetariana', 'vegana',
  'sin gluten', 'postres', 'ensaladas', 'sopas', 'carnes', 'pescados', 'pasta'
];

export function RecipeEditor({ initialData, onSuccess, onCancel }: RecipeEditorProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients || [{ name: '', quantity: 1, unit: '' }]
  );
  const [steps, setSteps] = useState<string[]>(initialData?.steps || ['']);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);

  const { mutate: createRecipe, isPending } = useCreateRecipe();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateRecipeInput>({
    resolver: zodResolver(CreateRecipeSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      servings: initialData?.servings || 4,
      difficulty: initialData?.difficulty || 'media',
      prep_time: initialData?.prep_time || undefined,
      cook_time: initialData?.cook_time || undefined,
      is_public: initialData?.is_public || false,
    }
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const onSubmit = (data: Omit<CreateRecipeInput, 'ingredients' | 'steps' | 'tags'>) => {
    const recipeData: CreateRecipeInput = {
      ...data,
      ingredients,
      steps,
      tags: selectedTags,
    };

    createRecipe(recipeData, {
      onSuccess: (recipe) => {
        onSuccess?.(recipe);
      },
      onError: (error) => {
        console.error('Error creating recipe:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Título de la Receta *
        </label>
        <input
          {...register('title')}
          type="text"
          className="w-full px-4 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          placeholder="Ej: Pasta Carbonara Tradicional"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Descripción
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter resize-none focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          placeholder="Descripción breve de la receta..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Ingredientes */}
      <IngredientList
        ingredients={ingredients}
        onChange={setIngredients}
        errors={errors.ingredients?.message}
      />

      {/* Pasos */}
      <StepList
        steps={steps}
        onChange={setSteps}
        errors={errors.steps?.message}
      />

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tiempo de preparación */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
            <Clock size={16} className="inline mr-1" />
            Prep. (min)
          </label>
          <input
            {...register('prep_time', { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white"
            placeholder="15"
          />
        </div>

        {/* Tiempo de cocción */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
            <Clock size={16} className="inline mr-1" />
            Cocción (min)
          </label>
          <input
            {...register('cook_time', { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white"
            placeholder="30"
          />
        </div>

        {/* Porciones */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
            <Users size={16} className="inline mr-1" />
            Porciones *
          </label>
          <input
            {...register('servings', { valueAsNumber: true })}
            type="number"
            min="1"
            className="w-full px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white"
          />
          {errors.servings && (
            <p className="text-red-500 text-sm mt-1">{errors.servings.message}</p>
          )}
        </div>
      </div>

      {/* Dificultad */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Dificultad *
        </label>
        <div className="flex gap-3">
          {['facil', 'media', 'dificil'].map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('difficulty')}
                type="radio"
                value={level}
                className="w-4 h-4 text-[#10b981]"
              />
              <span className="text-sm font-inter text-black dark:text-white capitalize">
                {level === 'facil' ? 'Fácil' : level === 'media' ? 'Media' : 'Difícil'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Categorías
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-sm font-inter transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-[#10b981] text-white'
                  : 'bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] text-black dark:text-white hover:border-[#10b981]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Público/Privado */}
      <div className="flex items-center gap-2">
        <input
          {...register('is_public')}
          type="checkbox"
          id="is_public"
          className="w-4 h-4 text-[#10b981] rounded"
        />
        <label htmlFor="is_public" className="text-sm font-inter text-black dark:text-white">
          Hacer pública esta receta (otros usuarios podrán verla)
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-gradient-to-b from-[#10b981] to-[#059669] hover:from-[#0ea573] hover:to-[#047857] text-white py-3 rounded-lg font-semibold font-inter transition-all active:scale-95 disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : initialData ? 'Actualizar Receta' : 'Guardar Receta'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg text-black dark:text-white font-semibold font-inter hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
```

**5. Página Nueva Receta** - `src/app/recipes/new/page.tsx` (30 min)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { RecipeEditor } from '@/components/recipes/RecipeEditor';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';

export default function NewRecipePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="recipes" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Nueva Receta"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <RecipeEditor
              onSuccess={(recipe) => {
                router.push(`/recipes/${recipe.id}`);
              }}
              onCancel={() => {
                router.push('/recipes');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Checkpoint Sprint 1

```bash
git add .
git commit -m "feat(recipes): implement recipe editor with validation

- Add Zod validation schema for recipes
- Create IngredientList component with dynamic array
- Create StepList component with numbered steps
- Implement RecipeEditor with full form
- Add /recipes/new page with editor
- Support for ingredients, steps, metadata, tags
- Integrated with useCreateRecipe hook"

git push origin main
```

**Testing:**
1. Navegar a http://localhost:4000/recipes/new
2. Llenar formulario completo
3. Click "Guardar Receta"
4. Verificar redirección a `/recipes/{id}` (dará 404 por ahora)
5. Volver a `/recipes` y ver receta en la lista

---

## 🚀 SPRINT 2 - Visualización y Autenticación

**Objetivo:** Ver detalles completos de recetas y habilitar login/registro  
**Duración:** 1-2 semanas

### 🔴 Fase 2A: Detalle de Receta (4-6 horas)

**Archivos a crear:**

**1. Componente RecipeDetail** - `src/components/recipes/RecipeDetail.tsx`

Características:
- Header con imagen grande
- Metadata (tiempo, porciones, dificultad)
- Lista de ingredientes con checkboxes interactivos
- Pasos numerados con diseño claro
- Tags visuales
- Botones de acción: Editar, Compartir, Añadir a plan, Modo cocina

**2. Página de Detalle** - `src/app/recipes/[id]/page.tsx`

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRecipe } from '@/hooks/useRecipes';
import { RecipeDetail } from '@/components/recipes/RecipeDetail';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: recipe, isLoading, error, refetch } = useRecipe(recipeId);

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="recipes" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={recipe?.title || 'Receta'}
          onCreateClick={() => router.push('/recipes/new')}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {isLoading && <LoadingSpinner size="lg" message="Cargando receta..." />}
          
          {error && (
            <ErrorMessage error={error} onRetry={refetch} />
          )}
          
          {recipe && (
            <RecipeDetail
              recipe={recipe}
              onEdit={() => router.push(`/recipes/${recipeId}/edit`)}
              onBack={() => router.push('/recipes')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

**Checkpoint:**
```bash
git commit -m "feat(recipes): add recipe detail view with full info display"
```

---

### 🔴 Fase 2B: Edición de Recetas (2-3 horas)

**Archivos a crear:**

**1. Página de Edición** - `src/app/recipes/[id]/edit/page.tsx`

```typescript
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useRecipe, useUpdateRecipe } from '@/hooks/useRecipes';
import { RecipeEditor } from '@/components/recipes/RecipeEditor';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useState } from 'react';

export default function EditRecipePage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: recipe, isLoading } = useRecipe(recipeId);
  const { mutate: updateRecipe } = useUpdateRecipe();

  if (isLoading) {
    return <LoadingSpinner size="lg" message="Cargando receta..." />;
  }

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="recipes" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Editar Receta"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            {recipe && (
              <RecipeEditor
                initialData={recipe}
                onSuccess={(updated) => {
                  router.push(`/recipes/${updated.id}`);
                }}
                onCancel={() => {
                  router.push(`/recipes/${recipeId}`);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Modificar RecipeEditor:**
- Añadir soporte para `initialData` prop
- Precargar form con valores existentes
- Usar `useUpdateRecipe` en lugar de `useCreateRecipe` si hay initialData

**Checkpoint:**
```bash
git commit -m "feat(recipes): add recipe editing functionality"
```

---

### 🔴 Fase 2C: Autenticación (4-6 horas)

**CRÍTICO:** Sin esto, RLS bloquea todas las operaciones de escritura

**Archivos a crear:**

**1. Helpers de Auth** - `src/lib/auth.ts`

```typescript
import { supabase } from './supabase';

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}
```

**2. Hook de Auth** - `src/hooks/useAuth.ts`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
  };
}
```

**3. LoginForm** - `src/components/auth/LoginForm.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/lib/auth';
import { Mail, Lock } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      router.push('/recipes');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border rounded-lg"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Contraseña</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border rounded-lg"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-b from-[#10b981] to-[#059669] text-white py-3 rounded-lg font-semibold hover:from-[#0ea573] hover:to-[#047857] disabled:opacity-50"
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

**4. RegisterForm** - Similar a LoginForm pero con `signUpWithEmail`

**5. Páginas de Auth**
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`

**6. Proteger Rutas**

Crear middleware o componente `ProtectedRoute`:

```typescript
// src/components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from './ui/LoadingSpinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

**7. Actualizar Header con Auth**

Modificar `Header.jsx`:
- Usar `useAuth()` hook
- Mostrar avatar real del usuario
- Dropdown con "Perfil" y "Cerrar sesión"
- Al cerrar sesión, redirigir a `/login`

**8. Reactivar RLS**

```sql
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
-- etc...
```

**Checkpoint:**
```bash
git commit -m "feat(auth): implement authentication with Supabase Auth

- Add auth helpers (login, register, logout)
- Create useAuth hook
- Add LoginForm and RegisterForm components
- Create /login and /register pages
- Add ProtectedRoute wrapper
- Update Header with real user data
- Reactivate RLS policies"

git push origin main
```

**Testing:**
1. Intentar acceder a `/recipes/new` sin login → redirige a `/login`
2. Crear cuenta en `/register`
3. Login exitoso → redirige a `/recipes`
4. Crear nueva receta → funciona con user_id correcto
5. Ver solo tus recetas en la lista

---

## 🚀 SPRINT 3 - Planificación

**Objetivo:** Planificador semanal y lista de compras funcionales  
**Duración:** 1-2 semanas

### 🟡 Fase 3A: Backend Services (3-4 horas)

**1. MealPlanService** - `src/lib/api/mealPlans.ts`

```typescript
export const MealPlanService = {
  async fetchWeekPlan(userId: string, weekStart: string): Promise<MealPlan>,
  async createMeal(data: CreateMealInput): Promise<void>,
  async updateMeal(mealId: string, data: UpdateMealInput): Promise<void>,
  async deleteMeal(mealId: string): Promise<void>,
};
```

**2. ShoppingListService** - `src/lib/api/shoppingLists.ts`

```typescript
export const ShoppingListService = {
  async fetchShoppingList(userId: string): Promise<ShoppingList>,
  async generateFromMealPlan(userId: string, weekStart: string): Promise<ShoppingList>,
  async toggleItem(itemId: string, checked: boolean): Promise<void>,
  async addItem(data: AddItemInput): Promise<void>,
  async removeItem(itemId: string): Promise<void>,
};
```

**3. Hooks correspondientes:**
- `src/hooks/useMealPlans.ts`
- `src/hooks/useShoppingList.ts`

### 🟡 Fase 3B: UI del Planificador (4-6 horas)

**1. Conectar `planner/page.jsx` con backend**
- Reemplazar datos mock con `useMealPlan(week)`
- Implementar añadir/editar/eliminar comidas
- Persistir en Supabase automáticamente

**2. Drag & Drop (opcional)**
- Librería: `@dnd-kit/core`
- Arrastrar recetas desde sidebar al calendario

### 🟡 Fase 3C: Lista de Compras (3-4 horas)

**1. Conectar `shopping/page.jsx` con backend**
- Reemplazar datos mock con `useShoppingList()`
- Implementar toggle de items
- Generar desde meal plan

**2. Agrupación por categorías**
- Agrupar ingredientes (frutas, verduras, carnes, lácteos, etc.)

**Checkpoint:**
```bash
git commit -m "feat(planning): implement meal planner and shopping list

- Add MealPlanService and hooks
- Add ShoppingListService and hooks
- Connect planner page to Supabase
- Connect shopping list page to Supabase
- Add generate shopping list from meal plan
- Support for item grouping by category"

git push origin main
```

---

## 🚀 SPRINT 4 - Mejoras UX

**Objetivo:** Filtros avanzados, modo cocina, búsqueda mejorada  
**Duración:** 1 semana

### Tareas:

**1. Filtros Avanzados en `/recipes`** (2-3 horas)
- Sidebar con filtros: tags, dificultad, tiempo, calorías
- Aplicar a useRecipes hook

**2. Modo Cocina** (3-4 horas)
- Página `/recipes/[id]/cook`
- Fullscreen con pasos grandes
- Navegación con botones Anterior/Siguiente
- Timer integrado por paso

**3. Upload de Imágenes** (2-3 horas)
- Integrar en RecipeEditor
- Preview antes de subir
- useUploadRecipeImage hook
- Almacenar en Storage bucket

**4. Toast Notifications** (1 hora)
- Librería: react-hot-toast
- Success/error toasts en todas las mutations

**Checkpoint:**
```bash
git commit -m "feat(ux): add advanced filters, cooking mode, and image upload"
```

---

## 🚀 SPRINT 5 - Comunidad (Opcional)

**Objetivo:** Reviews, ratings, perfil de usuario  
**Duración:** 1 semana

### Tareas:

**1. Sistema de Reviews** (4-5 horas)
- ReviewService y hooks
- ReviewForm component
- Mostrar reviews en RecipeDetail

**2. Rating de Recetas** (2-3 horas)
- Estrellas interactivas
- Actualizar rating_avg en DB
- Ordenar por rating en lista

**3. Perfil de Usuario** (3-4 horas)
- Página `/profile`
- Editar nombre, avatar, preferencias
- Ver estadísticas personales

**Checkpoint:**
```bash
git commit -m "feat(community): add reviews, ratings, and user profiles"
```

---

## 🚀 SPRINT 6 - Optimización (Opcional)

**Objetivo:** Performance, testing, deployment  
**Duración:** 1 semana

### Tareas:

**1. Paginación** (2-3 horas)
- Cursor pagination en fetchRecipes
- Infinite scroll o botones prev/next

**2. Testing** (4-6 horas)
- Unit tests para servicios (Vitest)
- Component tests (React Testing Library)
- E2E tests básicos (Playwright)

**3. Performance** (2-3 horas)
- Optimización de imágenes (lazy loading)
- Code splitting
- Métricas de Lighthouse

**4. Deployment** (1-2 horas)
- Deploy a Vercel
- Configurar variables de entorno
- Setup de Supabase en producción

**Checkpoint:**
```bash
git commit -m "chore: add testing, optimize performance, and deploy to production"
```

---

## 📊 Métricas de Éxito

### Sprint 1 (Fundación)
- ✅ Usuario puede crear recetas desde UI
- ✅ Formulario valida datos correctamente
- ✅ Recetas se guardan en Supabase
- ✅ Lista muestra recetas creadas

### Sprint 2 (CRUD + Auth)
- ✅ Usuario puede ver detalles completos
- ✅ Usuario puede editar sus recetas
- ✅ Login/Register funciona
- ✅ Solo usuarios autenticados pueden crear/editar

### Sprint 3 (Planificación)
- ✅ Usuario puede planificar comidas semanales
- ✅ Plan persiste en Supabase
- ✅ Lista de compras se genera desde plan
- ✅ Items se pueden marcar como comprados

### Sprint 4+ (Opcional)
- ✅ Filtros avanzados funcionan
- ✅ Modo cocina mejora experiencia
- ✅ Reviews y ratings activos
- ✅ App deployed a producción

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
pnpm dev                    # Iniciar servidor dev
pnpm build                  # Build para producción
pnpm lint                   # Linter
pnpm typecheck              # Verificar tipos

# Git
git status                  # Ver cambios
git add .                   # Añadir todos
git commit -m "mensaje"     # Commit
git push origin main        # Push a GitHub

# Supabase
supabase status             # Ver estado
supabase db reset           # Reset DB (cuidado!)
supabase gen types typescript --project-id <id> > src/types/database.ts
```

---

## 📝 Convenciones

**Commits:**
- `feat(scope): descripción` - Nueva funcionalidad
- `fix(scope): descripción` - Bug fix
- `docs: descripción` - Documentación
- `style: descripción` - Formateo
- `refactor(scope): descripción` - Refactoring
- `test(scope): descripción` - Tests
- `chore: descripción` - Tareas de mantenimiento

**Branches (si necesario):**
- `main` - Código estable
- `feature/nombre` - Nueva funcionalidad
- `fix/nombre` - Bug fix

---

## 🎯 Próximos Pasos Inmediatos

1. ✅ **Verificar configuración inicial** (Fase 1A)
2. 🔴 **Implementar RecipeEditor** (Fase 1B) ← EMPEZAR AQUÍ
3. 🔴 **Implementar RecipeDetail** (Fase 2A)
4. 🔴 **Implementar Autenticación** (Fase 2C)
5. 🟡 **Conectar Planificador** (Fase 3)

**Tiempo estimado Sprint 1+2:** 15-20 horas de desarrollo

---

**Última actualización:** 15 Nov 2025  
**Progreso actual:** Sprint 1 - Fase 1A completada, Fase 1B pendiente
