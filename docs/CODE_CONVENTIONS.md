# 📐 Convenciones de Código - Tastebook Pro

**Última actualización:** 16 Nov 2025  
**Estado:** Sprint 1 completado

---

## 📁 Estructura de Archivos

### Convención de Extensiones

**Regla oficial:** Migración progresiva de `.jsx` a `.tsx`

**Archivos TypeScript (.tsx / .ts):**
- ✅ Todos los archivos nuevos DEBEN ser `.tsx` o `.ts`
- ✅ Strict mode TypeScript habilitado
- ✅ Props tipadas con interfaces
- ✅ Return types explícitos en funciones

**Archivos Legacy (.jsx):**
- ⚠️ Solo componentes existentes pre-proyecto
- ⚠️ Migrar a `.tsx` al modificarlos
- ⚠️ No crear nuevos archivos `.jsx`

**Archivos legacy actuales:**
```
apps/web/src/
├── components/
│   ├── Header.jsx          ← Migrar Sprint 2
│   └── Sidebar.jsx         ← Migrar Sprint 2
└── app/
    ├── page.jsx            ← Dashboard, migrar Sprint 2
    ├── planner/
    │   └── page.jsx        ← Migrar Sprint 3
    └── shopping/
        └── page.jsx        ← Migrar Sprint 3
```

---

## 🎨 Sistema de Diseño

**Guía completa:** [STYLES.md](STYLES.md)

### Colores

```typescript
// Primarios
const colors = {
  primary: '#10b981',
  primaryHover: '#059669',
  primaryActive: '#047857',
  
  // Accent
  accentOrange: '#ff6b35',
  accentAmber: '#f7931e',
  
  // Backgrounds
  bgLight: '#F3F3F3',
  bgDark: '#0A0A0A',
  
  // Cards
  cardLight: '#FFFFFF',
  cardDark: '#1E1E1E',
};
```

### Tipografías

```typescript
// Familias
font-sora      → Títulos y números grandes
font-inter     → Cuerpo de texto
font-plus-jakarta → Navegación (Sidebar)

// Tamaños
text-xs   → 12px
text-sm   → 14px
text-base → 16px (default)
text-lg   → 18px
text-xl   → 20px
text-2xl  → 24px
text-3xl  → 30px
text-4xl  → 36px
```

### Espaciado

```typescript
// Padding estándar
p-2  → 8px
p-4  → 16px
p-6  → 24px  ← Cards
p-8  → 32px  ← Pages

// Gaps
gap-2 → 8px
gap-3 → 12px
gap-4 → 16px
gap-6 → 24px
gap-8 → 32px
```

---

## 🧩 Componentes

### Ubicación

```
apps/web/src/components/
├── ui/                    # Componentes base reutilizables
│   ├── Button.tsx         # TODO: Sprint 2
│   ├── Input.tsx          # TODO: Sprint 2
│   ├── Card.tsx           # TODO: Sprint 2
│   ├── LoadingSpinner.tsx ✅
│   └── ErrorMessage.tsx   ✅
├── recipes/               # Componentes específicos de recetas
│   ├── RecipeCard.tsx     ✅
│   └── RecipeEditor.tsx   ✅
└── [Header.jsx, Sidebar.jsx] # Legacy, migrar Sprint 2
```

### Nomenclatura

**Componentes:**
```typescript
// PascalCase para componentes
export function RecipeCard({ recipe }: RecipeCardProps) { ... }

// Interface con sufijo Props
interface RecipeCardProps {
  recipe: Recipe;
  onClick?: (id: string) => void;
}
```

**Archivos:**
```
RecipeCard.tsx      ✅ Correcto
recipeCard.tsx      ❌ Incorrecto
recipe-card.tsx     ❌ Incorrecto
```

---

## 🔤 Tipos TypeScript

### Ubicación

**Archivo principal:** [apps/web/src/types/database.ts](../types/database.ts)

**Contenido:**
- `Database` interface con schema completo
- Tipos de tablas: `Recipe`, `User`, `MealPlan`, etc.
- Enums: `RecipeDifficulty`, `MealType`, etc.
- Helper types: `Ingredient`, `Nutrition`, etc.

### Convenciones

```typescript
// Interfaces para tipos de dominio
interface Recipe {
  id: string;
  title: string;
  // ...
}

// Types para uniones o helpers
type RecipeDifficulty = 'facil' | 'media' | 'dificil';

// Enums solo si necesario
enum MealType {
  Breakfast = 'desayuno',
  Lunch = 'comida',
  Dinner = 'cena',
  Snack = 'snack',
}
```

### Naming

```typescript
// Database types: sufijo Table
type RecipesTable = Database['public']['Tables']['recipes'];

// Insert types: se omite user_id (asignado automáticamente)
type CreateRecipeInput = Omit<
  Database['public']['Tables']['recipes']['Insert'],
  'id' | 'created_at' | 'updated_at' | 'user_id' | ...
>;

// Update types: Partial
type UpdateRecipeInput = Partial<CreateRecipeInput>;
```

---

## 🪝 Hooks Personalizados

### Ubicación

```
apps/web/src/hooks/
├── useRecipes.ts       ✅ Implementado
├── useAuth.ts          ⏳ Sprint 2
├── useMealPlans.ts     ⏳ Sprint 3
└── useShoppingList.ts  ⏳ Sprint 3
```

### Nomenclatura

```typescript
// Prefijo 'use' obligatorio
export function useRecipes() { ... }  ✅
export function getRecipes() { ... }  ❌

// Hooks compuestos: sufijo Actions
export function useRecipesActions() { ... }  ✅
```

### Estructura

```typescript
export function useRecipes(
  filters?: RecipeFilters,
  sortBy?: RecipeSortBy,
  sortOrder?: SortOrder,
  options?: UseQueryOptions
) {
  return useQuery({
    queryKey: recipeKeys.list(filters),
    queryFn: () => RecipeService.fetchRecipes(filters, sortBy, sortOrder),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
```

---

## 🛠️ Servicios (API)

### Ubicación

```
apps/web/src/lib/api/
├── recipes.ts          ✅ Implementado
├── mealPlans.ts        ⏳ Sprint 3
└── shoppingLists.ts    ⏳ Sprint 3
```

### Estructura

```typescript
export const RecipeService = {
  async fetchRecipes(filters, sortBy, sortOrder) { ... },
  async fetchRecipeById(id) { ... },
  async createRecipe(input) { ... },
  async updateRecipe(id, input) { ... },
  async deleteRecipe(id) { ... },
  async uploadRecipeImage(file, recipeId) { ... },
};
```

### Error Handling

```typescript
try {
  const { data, error } = await query;
  if (error) throw new Error(`Error específico: ${error.message}`);
  return data || [];
} catch (error) {
  console.error('Context:', error);
  throw error; // Propagar para manejo en UI
}
```

---

## 📝 JSDoc

### Obligatorio en:

- ✅ Servicios (RecipeService)
- ✅ Hooks personalizados (useRecipes)
- ✅ Funciones helper
- ✅ Componentes complejos

### Formato

```typescript
/**
 * Obtiene lista de recetas con filtros opcionales.
 * 
 * @param filters - Filtros de búsqueda (search, tags, difficulty)
 * @param sortBy - Campo de ordenamiento
 * @param sortOrder - Dirección (asc/desc)
 * @returns Promise con array de recetas
 * 
 * @example
 * const recipes = await RecipeService.fetchRecipes(
 *   { tags: ['italiana'] },
 *   'created_at',
 *   'desc'
 * );
 */
async fetchRecipes(filters, sortBy, sortOrder) { ... }
```

---

## 🎯 Imports

### Orden

```typescript
// 1. React y librerías externas
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Hooks personalizados
import { useRecipes } from '@/hooks/useRecipes';

// 3. Componentes
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// 4. Tipos
import type { Recipe, RecipeFilters } from '@/types/database';

// 5. Utilidades
import { supabase } from '@/lib/supabase';

// 6. Iconos
import { Plus, Search } from 'lucide-react';
```

### Alias

```typescript
// Configurado en tsconfig.json
"@/*" → "src/*"

// Uso
import { useRecipes } from '@/hooks/useRecipes';  ✅
import { useRecipes } from '../../hooks/useRecipes';  ❌
```

---

## 🧪 Testing (Sprint 6)

### Ubicación

```
apps/web/src/
├── components/
│   ├── RecipeCard.tsx
│   └── RecipeCard.test.tsx
├── hooks/
│   ├── useRecipes.ts
│   └── useRecipes.test.ts
└── lib/
    └── api/
        ├── recipes.ts
        └── recipes.test.ts
```

### Librería

```typescript
// Unit tests
import { describe, it, expect } from 'vitest';

// Component tests
import { render, screen } from '@testing-library/react';
```

---

## 📦 Commits

**Formato:** Conventional Commits

```bash
# Estructura
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

```
feat:     Nueva funcionalidad
fix:      Bug fix
refactor: Refactorización
style:    Cambios de estilo/formato
docs:     Documentación
test:     Tests
chore:    Tareas mantenimiento
```

### Ejemplos

```bash
git commit -m "feat(recipes): implement recipe editor with validation"

git commit -m "fix(auth): resolve token refresh issue"

git commit -m "refactor(cleanup): remove unused components"

git commit -m "docs: update API documentation with new endpoints"

git commit -m "style: apply design system to RecipeCard component"
```

---

## 🚀 Workflow de Desarrollo

### 1. Crear Rama (opcional para features grandes)

```bash
git checkout -b feature/recipe-editor
```

### 2. Desarrollo

```bash
# Código
# Tests
# Documentación
```

### 3. Commits Frecuentes

```bash
git add .
git commit -m "feat(editor): add ingredient input component"
git commit -m "feat(editor): add step list component"
git commit -m "docs: document recipe editor component"
```

### 4. Push

```bash
git push origin feature/recipe-editor
# O directamente a main si es cambio pequeño
git push origin main
```

---

## 📂 Archivos a Ignorar

**`.gitignore` configurado:**

```
# Entornos
.env
.env.local
.env.*.local

# Dependencies
node_modules/

# Build
dist/
build/
.next/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

---

## ✅ Checklist de Nuevo Componente

Antes de crear un componente:

- [ ] Nombre en PascalCase
- [ ] Archivo `.tsx` (no `.jsx`)
- [ ] Props interface definida
- [ ] TypeScript strict
- [ ] JSDoc si es complejo
- [ ] Estilos según [STYLES.md](STYLES.md)
- [ ] Dark mode con `dark:` prefix
- [ ] Responsive con breakpoints
- [ ] Imports organizados
- [ ] Sin console.log en producción

---

## 🔄 Migración JSX → TSX

**Proceso estándar:**

1. Renombrar archivo: `Header.jsx` → `Header.tsx`
2. Añadir tipos a props:
   ```typescript
   interface HeaderProps {
     onMenuClick: () => void;
     title: string;
     onCreateClick?: () => void;
   }
   ```
3. Tipar estado:
   ```typescript
   const [isOpen, setIsOpen] = useState<boolean>(false);
   ```
4. Revisar imports y añadir `type` donde corresponda
5. Aplicar sistema de diseño de [STYLES.md](STYLES.md)
6. Commit: `refactor(header): migrate to TypeScript`

---

**Última actualización:** 16 Nov 2025  
**Próxima revisión:** Al completar Sprint 2
