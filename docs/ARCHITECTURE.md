# Arquitectura del Proyecto - Tastebook Pro

Documento técnico describiendo la arquitectura, estructura y patrones de diseño del proyecto.

## Visión General

Tastebook Pro es una aplicación web full-stack construida con arquitectura cliente-servidor moderna:

- **Frontend:** React Router 7 con React Server Components
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Estado:** React Query para cache y sincronización
- **Estilos:** Tailwind CSS con componentes custom

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React Router 7 App Router                │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────┐  │  │
│  │  │   Pages    │  │ Components │  │   Hooks   │  │  │
│  │  └────────────┘  └────────────┘  └───────────┘  │  │
│  │         │                │               │        │  │
│  │         └────────────────┴───────────────┘        │  │
│  │                      │                            │  │
│  │         ┌────────────▼────────────┐               │  │
│  │         │   React Query Layer    │               │  │
│  │         │  (Cache & Sync State)  │               │  │
│  │         └────────────┬────────────┘               │  │
│  │                      │                            │  │
│  │         ┌────────────▼────────────┐               │  │
│  │         │   Supabase Client JS   │               │  │
│  │         └────────────┬────────────┘               │  │
│  └──────────────────────┼──────────────────────────┘  │
└────────────────────────┼────────────────────────────┘
                         │ HTTPS / WebSocket
                         │
┌────────────────────────▼────────────────────────────┐
│                 BACKEND (Supabase)                   │
│  ┌──────────────────────────────────────────────┐  │
│  │           PostgreSQL Database                │  │
│  │  ┌────────┐  ┌─────────┐  ┌──────────────┐  │  │
│  │  │ Tables │  │ Indexes │  │ Constraints  │  │  │
│  │  └────────┘  └─────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │        Row Level Security (RLS)              │  │
│  │        + Auth Policies                       │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │          Supabase Auth                       │  │
│  │  (Magic Link + OAuth Providers)              │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │          Supabase Storage                    │  │
│  │  (Recipe Images + User Avatars)              │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │          Supabase Realtime                   │  │
│  │  (Shopping List Sync + Notifications)        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Estructura de Carpetas

```
tastebook-pro/
├── apps/
│   └── web/                          # Aplicación web principal
│       ├── src/
│       │   ├── app/                  # Rutas y páginas
│       │   │   ├── _layout.jsx       # Layout principal
│       │   │   ├── index.jsx         # Dashboard (home)
│       │   │   ├── recipes/          # Biblioteca de recetas
│       │   │   ├── planner/          # Planificador semanal
│       │   │   ├── shopping/         # Lista de compra
│       │   │   └── profile/          # Perfil de usuario
│       │   │
│       │   ├── components/           # Componentes React reutilizables
│       │   │   ├── ui/              # Componentes UI base (shadcn)
│       │   │   ├── recipes/         # Componentes específicos recetas
│       │   │   ├── planner/         # Componentes planificador
│       │   │   └── shared/          # Componentes compartidos
│       │   │
│       │   ├── lib/                  # Librerías y utilidades
│       │   │   ├── supabase.ts      # Cliente Supabase configurado
│       │   │   ├── api/             # Servicios API
│       │   │   │   ├── recipes.ts   # RecipeService
│       │   │   │   ├── mealPlans.ts # MealPlanService
│       │   │   │   └── shopping.ts  # ShoppingListService
│       │   │   ├── validations/     # Esquemas Zod
│       │   │   └── constants.ts     # Constantes globales
│       │   │
│       │   ├── hooks/                # Custom React Hooks
│       │   │   ├── useRecipes.ts    # Hook CRUD recetas
│       │   │   ├── useAuth.ts       # Hook autenticación
│       │   │   ├── useMealPlan.ts   # Hook plan semanal
│       │   │   └── useShoppingList.ts # Hook lista compra
│       │   │
│       │   ├── utils/                # Funciones helper
│       │   │   ├── formatters.ts    # Formateo de datos
│       │   │   ├── parsers.ts       # Parseo de recetas
│       │   │   └── validators.ts    # Validaciones custom
│       │   │
│       │   └── types/                # Tipos TypeScript
│       │       ├── recipe.ts        # Tipos de recetas
│       │       ├── user.ts          # Tipos de usuario
│       │       └── database.ts      # Tipos generados de DB
│       │
│       ├── public/                   # Assets estáticos
│       │   ├── manifest.json        # PWA manifest
│       │   ├── sw.js                # Service Worker
│       │   └── icons/               # Iconos PWA
│       │
│       ├── tsconfig.json            # Configuración TypeScript
│       ├── tailwind.config.js       # Configuración Tailwind
│       ├── vite.config.ts           # Configuración Vite
│       └── package.json             # Dependencias
│
├── docs/                             # Documentación técnica
│   ├── SETUP.md                     # Guía de setup
│   ├── ARCHITECTURE.md              # Este archivo
│   ├── DATABASE.md                  # Esquema de DB
│   ├── API.md                       # Documentación API
│   ├── COMPONENTS.md                # Catálogo componentes
│   └── ROADMAP.md                   # Roadmap del proyecto
│
├── README.md                        # Documentación principal
├── CHANGELOG.md                     # Log de cambios
└── .env.example                     # Template variables entorno
```

## Capas de la Aplicación

### 1. Capa de Presentación (UI)

**Responsabilidad:** Renderizar interfaz de usuario y capturar interacciones.

**Tecnologías:**
- React 18+ (components, hooks)
- Tailwind CSS (utility-first styling)
- Framer Motion (animaciones)
- Lucide React (iconografía)

**Patrones:**
- Componentes funcionales con hooks
- Composition over inheritance
- Atomic Design (atoms → molecules → organisms)
- Mobile-first responsive design

### 2. Capa de Lógica de Negocio (Hooks)

**Responsabilidad:** Encapsular lógica reutilizable y gestión de estado.

**Ejemplo: `useRecipes`**
```typescript
export function useRecipes(filters?: RecipeFilters) {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => RecipeService.fetchRecipes(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
```

**Características:**
- Abstracción de React Query
- Optimistic updates
- Error handling centralizado
- Cache automático

### 3. Capa de Servicios (API)

**Responsabilidad:** Comunicación con backend (Supabase).

**Ejemplo: `RecipeService`**
```typescript
export const RecipeService = {
  async fetchRecipes(filters?: RecipeFilters) {
    let query = supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true);
    
    if (filters?.tags) {
      query = query.contains('tags', filters.tags);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  
  // ... más métodos
};
```

**Características:**
- Validación con Zod
- Manejo de errores tipado
- Transformación de datos
- Retry logic

### 4. Capa de Datos (Supabase)

**Responsabilidad:** Persistencia, autenticación, storage, realtime.

**Módulos:**
- **Database:** PostgreSQL con RLS
- **Auth:** Magic link + OAuth
- **Storage:** Imágenes de recetas
- **Realtime:** WebSocket para sincronización

## Flujo de Datos

### Lectura (GET)

```
User Action → Component → Hook (useRecipes) 
  → React Query Cache Check
    → Cache Hit: Return cached data
    → Cache Miss: 
      → Service (RecipeService.fetchRecipes)
        → Supabase Client
          → PostgreSQL + RLS
            → Return data
              → Transform & Validate (Zod)
                → Update Cache
                  → Re-render Component
```

### Escritura (POST/PUT/DELETE)

```
User Action → Component → Hook (useRecipes mutation)
  → Optimistic Update (UI inmediato)
    → Service (RecipeService.createRecipe)
      → Validate Input (Zod)
        → Supabase Client
          → PostgreSQL + RLS Check
            → Success:
              → Invalidate Query Cache
              → Refetch Data
              → Confirm UI Update
            → Error:
              → Rollback Optimistic Update
              → Show Error Message
```

## Patrones de Diseño

### 1. Repository Pattern (Servicios)

Abstracción de acceso a datos en servicios dedicados:

```typescript
// lib/api/recipes.ts
export const RecipeService = {
  fetchRecipes,
  fetchRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  uploadRecipeImage,
};
```

### 2. Custom Hooks Pattern

Encapsulación de lógica reutilizable:

```typescript
// hooks/useRecipes.ts
export function useRecipes() {
  const queryClient = useQueryClient();
  
  const recipes = useQuery({ ... });
  const createMutation = useMutation({ ... });
  
  return { recipes, createRecipe: createMutation.mutate };
}
```

### 3. Composition Pattern

Componentes pequeños y componibles:

```typescript
<RecipeCard>
  <RecipeImage src={recipe.image_url} />
  <RecipeTitle>{recipe.title}</RecipeTitle>
  <RecipeMeta time={recipe.cook_time} servings={recipe.servings} />
  <RecipeActions onEdit={...} onDelete={...} />
</RecipeCard>
```

### 4. Provider Pattern

Context providers para estado global:

```typescript
<QueryClientProvider client={queryClient}>
  <SupabaseProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </SupabaseProvider>
</QueryClientProvider>
```

## Gestión de Estado

### Estado Local (Component State)

Para estado UI temporal:
```typescript
const [isOpen, setIsOpen] = useState(false);
```

### Estado Servidor (React Query)

Para datos del backend:
```typescript
const { data: recipes } = useRecipes();
```

### Estado Global (Zustand - si necesario)

Para estado compartido persistente:
```typescript
const useStore = create((set) => ({
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
```

## Seguridad

### Row Level Security (RLS)

Políticas PostgreSQL para cada tabla:

```sql
-- Solo el dueño puede editar sus recetas
CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id);
```

### Validación de Datos

Doble validación (cliente + servidor):

```typescript
// Cliente
const RecipeSchema = z.object({
  title: z.string().min(3).max(100),
  ingredients: z.array(z.object({ ... })),
});

// Servidor (Supabase RLS + constraints)
```

### Autenticación

JWT tokens manejados por Supabase:

```typescript
const { data: { session } } = await supabase.auth.getSession();
// Supabase incluye token automáticamente en requests
```

## Performance

### Optimizaciones Implementadas

1. **Code Splitting:** Lazy loading de rutas
2. **Image Optimization:** Compresión automática al subir
3. **React Query Cache:** Reducir requests redundantes
4. **Debouncing:** En búsquedas y filtros
5. **Memoization:** useMemo/useCallback en componentes complejos

### Métricas Objetivo

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90

## Testing (Próximamente)

```
src/
  ├── components/
  │   ├── RecipeCard.tsx
  │   └── RecipeCard.test.tsx
  ├── hooks/
  │   ├── useRecipes.ts
  │   └── useRecipes.test.ts
  └── lib/
      ├── api/
      │   ├── recipes.ts
      │   └── recipes.test.ts
```

## Deployment

### Vercel (Frontend)

```bash
# Auto-deploy desde GitHub
git push origin main
# → Vercel detecta cambios y deploya
```

### Supabase (Backend)

- Migraciones SQL ejecutadas manualmente en Dashboard
- No hay CI/CD para DB (por ahora)

## Próximas Mejoras Arquitectónicas

1. **Server Components:** Migrar a RSC donde tenga sentido
2. **Edge Functions:** Para operaciones complejas server-side
3. **Webhooks:** Stripe integration para pagos
4. **CDN:** Cloudflare para assets estáticos
5. **Monitoring:** Sentry para error tracking

---

**Última actualización:** 15 Nov 2025
