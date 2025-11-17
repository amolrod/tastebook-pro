# 🎨 Componentes UI - Tastebook Pro

## Componentes Reutilizables

### Button Component

Componente de botón reutilizable con múltiples variantes y estados.

**Ubicación:** `src/components/ui/Button.tsx`

#### Props

\`\`\`typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}
\`\`\`

#### Ejemplo de uso

\`\`\`tsx
import { Button } from '../../components/ui/Button';

<Button variant="primary" size="md" isLoading={loading}>
  Guardar
</Button>
\`\`\`

---

### Input Component

Componente de input reutilizable con etiquetas, iconos y estados de error.

**Ubicación:** `src/components/ui/Input.tsx`

#### Ejemplo de uso

\`\`\`tsx
import { Input } from '../../components/ui/Input';
import { Mail } from 'lucide-react';

<Input
  id="email"
  type="email"
  label="Correo electrónico"
  placeholder="tu@email.com"
  leftIcon={<Mail size={20} />}
  autoComplete="email"
  required
/>
\`\`\`

---

## Páginas

### ProfilePage (Rediseñada - Sprint 3)

Página de perfil de usuario completamente rediseñada con UX profesional moderna.

**Ubicación:** `src/app/profile/page.tsx`

#### Características

**Hero Section:**
- Cover con gradiente verde animado (`from-[#10b981] via-[#059669] to-[#047857]`)
- Patrones decorativos con blur effects
- Iconos flotantes animados (ChefHat, BookOpen) con motion loop
- Avatar grande (32x32) con:
  - Imagen real o placeholder con inicial
  - Botón de upload funcional
  - Loading spinner durante upload
  - Ring border decorativo
- Badge "Miembro Pro" con gradiente naranja
- Edición inline de nombre y biografía con botones Check/X
- Meta información (email, fecha de registro)
- Botones de configuración y logout

**Stats Cards (4 métricas):**
- Recetas creadas (BookOpen icon, verde)
- Favoritos (Heart icon, naranja)
- Planes (Target icon, amber)
- Días de racha (Flame icon, gradiente)
- Animaciones de entrada con delay progresivo

**Tabs Navigation:**
- 3 tabs: Resumen, Mis Recetas, Logros
- Active state con gradiente verde
- Transiciones suaves entre tabs con AnimatePresence

**Tab: Resumen (Overview):**
- Activity Timeline:
  - Últimas acciones del usuario
  - Iconos coloridos por tipo de actividad
  - Cards con hover effects
- Quick Stats Sidebar:
  - Progreso semanal con progress bar animada
  - Próximo logro con descripción
  - Progress bar para siguiente achievement

**Tab: Mis Recetas:**
- Listado de recetas publicadas por el usuario
- Estado vacío con CTA para crear receta
- Botón para navegar a recetas

**Tab: Logros (Achievements):**
- Grid de badges de logros
- Estados: desbloqueado (colorido) y bloqueado (gris)
- Diseño con gradientes y bordes

#### Hooks Utilizados

```typescript
// Auth y datos
const { user, signOut } = useAuth();
const { data: profile, isLoading } = useUserProfile(user?.id);
const { data: stats, isLoadingStats } = useUserStats(user?.id);

// Mutaciones
const updateProfile = useUpdateProfile();
const uploadAvatar = useUploadAvatar();
```

#### Funcionalidades

- ✅ Upload de avatar con validación (max 2MB, solo imágenes)
- ✅ Edición inline de nombre con autosave
- ✅ Edición inline de biografía con autosave
- ✅ Estadísticas en tiempo real
- ✅ Sistema de tabs con transiciones
- ✅ Logout funcional
- ✅ Loading states en todas las operaciones
- ✅ Toast notifications con sonner
- ✅ Responsive mobile-first
- ✅ Dark mode completo
- ✅ Animaciones con framer-motion

#### Ejemplo de uso

```tsx
import { ProtectedRoute } from '../components/ProtectedRoute';
import ProfilePage from './profile/page';

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

---

### useUploadAvatar Hook

Hook personalizado para subir avatares a Supabase Storage.

**Ubicación:** `src/hooks/useUploadAvatar.ts`

#### Características

- Validación de tamaño (max 2MB)
- Validación de tipo (solo imágenes)
- Elimina avatar anterior automáticamente
- Genera nombre único con userId y timestamp
- Actualiza tabla `users` con nueva URL
- Invalidación de cache de React Query
- Toast notifications de éxito/error

#### Ejemplo de uso

```tsx
const uploadAvatar = useUploadAvatar();
const fileInputRef = useRef<HTMLInputElement>(null);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && user?.id) {
    uploadAvatar.mutate({ file, userId: user.id });
  }
};

<button onClick={() => fileInputRef.current?.click()}>
  <Camera />
</button>
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleFileChange}
  className="hidden"
/>
```

---

---

## ❤️ Sistema de Favoritos

### Página /favorites (Rediseñada - Sprint 4.1)

Página de favoritos completamente rediseñada con UX premium y diseño moderno.

**Ubicación:** `apps/web/src/app/favorites/page.tsx`

#### Características

**Hero Header Premium:**
- Gradiente moderno: `from-red-500 via-pink-500 to-rose-600`
- Patrones decorativos con blur effects (`blur-3xl`)
- Título grande con icono corazón animado
- Contador dinámico: "X recetas guardadas"

**Quick Stats Cards (3 métricas):**
- Recetas fáciles (Sparkles icon, verde)
- Recetas intermedias (TrendingUp icon, naranja)
- Recetas avanzadas (ChefHat icon, rojo)
- Backdrop blur y animaciones de entrada

**Búsqueda y Filtros:**
- Input con búsqueda en tiempo real por título
- Icono Search con posición absoluta
- 4 botones de filtro: Todas / Fácil / Media / Difícil
- Active states con colores temáticos
- Contador de resultados actual

**Grid de Recetas:**
- Layout responsive: 1/2/3 columnas
- Animaciones staggered (0.05s delay por card)
- AnimatePresence para transiciones suaves
- Empty state premium con CTA "Explorar recetas"
- No results state cuando filtros no coinciden

#### Hooks Utilizados

```typescript
const { user } = useAuth();
const { data: favorites, isLoading, error } = useFavorites(user?.id);
const [searchQuery, setSearchQuery] = useState('');
const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

// Filtrado local
const filteredFavorites = useMemo(() => {
  return favorites?.filter(fav => {
    const matchesSearch = fav.recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !filterDifficulty || fav.recipe.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  }) || [];
}, [favorites, searchQuery, filterDifficulty]);
```

---

### RecipeCard (Botón de Favorito Mejorado - Sprint 4.1)

Componente de tarjeta de receta con botón de favorito rediseñado.

**Ubicación:** `apps/web/src/components/recipes/RecipeCard.tsx`

#### Mejoras del Botón de Favorito

**Posición y Tamaño:**
- Movido de top-left a **top-right** (menos accidental clicks)
- Tamaño aumentado: `p-3` (antes p-2)
- Shadow-lg para mejor visibilidad

**Estados Visuales:**
```tsx
// Activo (guardado)
className="bg-red-500/90 hover:bg-red-600 text-white"
<Heart className="fill-white text-white scale-110" />

// Inactivo (no guardado)
className="bg-white/90 dark:bg-[#1A1A1A]/90 text-red-500"
<Heart className="text-red-500" />

// Loading
{toggleFavorite.isPending && (
  <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
)}

// Disabled
disabled={toggleFavorite.isPending || isFavoriteLoading}
className="opacity-50 cursor-not-allowed"
```

**Animaciones:**
- Hover: `whileHover={{ scale: 1.15 }}`
- Tap: `whileTap={{ scale: 0.9 }}`
- Card hover: `whileHover={{ y: -4 }}`

**Toast Notifications:**
```tsx
if (!user) {
  toast.error('Debes iniciar sesión para guardar favoritos');
  return;
}
```

**Ejemplo de uso:**
```tsx
<RecipeCard 
  recipe={recipe}
  onClick={() => navigate(`/recipes/${recipe.id}`)}
/>
```

---

### RecipeDetail (Hero con Favorito Prominente - Sprint 4.1)

Página de detalle de receta con botón de favorito integrado en hero.

**Ubicación:** `apps/web/src/components/recipes/RecipeDetail.tsx`

#### Hero Section Rediseñado

**Layout:**
- Altura: h-96 (384px)
- Imagen full-width con overlay gradiente
- Título y descripción superpuestos (bottom positioning)
- Botones de acción en top (back, favorito, share, edit, delete)

**Botón de Favorito en Hero:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  onClick={handleFavoriteClick}
  disabled={toggleFavorite.isPending || isFavoriteLoading}
  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold backdrop-blur-md transition-all ${
    isFavorite 
      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
      : 'bg-white/90 dark:bg-[#1E1E1E]/90 text-gray-900 dark:text-white hover:bg-white shadow-lg'
  }`}
>
  {toggleFavorite.isPending ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  ) : (
    <>
      <Heart size={20} className={isFavorite ? 'fill-white' : ''} />
      <span className="hidden sm:inline">{isFavorite ? 'Favorito' : 'Guardar'}</span>
    </>
  )}
</motion.button>
```

**Meta Cards Grid:**
- Grid 2/4 columnas responsive
- Cards: tiempo (Clock), porciones (Users), dificultad (Flame), calorías (Flame)
- Iconos grandes (w-8 h-8) con colores temáticos
- Animaciones staggered con delay 0.2-0.5s

**Secciones Mejoradas:**
```tsx
// Ingredientes
<div className="flex items-center gap-3 mb-6">
  <div className="p-3 bg-[#10b981]/10 rounded-xl">
    <BookOpen className="w-6 h-6 text-[#10b981]" />
  </div>
  <h2 className="text-2xl font-bold font-sora">Ingredientes</h2>
</div>

// Instrucciones con números gradiente
<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] text-white font-bold">
  {index + 1}
</div>
```

---

## Changelog

### v0.4.1 (Sprint 4.1 - Favoritos UI)

- ✅ Rediseñada página /favorites con hero gradient premium
- ✅ Implementado sistema de búsqueda en tiempo real
- ✅ Agregados filtros por dificultad con active states
- ✅ Quick stats cards con métricas por dificultad
- ✅ Animaciones staggered en grid de recetas
- ✅ Empty state premium con CTA
- ✅ RecipeCard: botón favorito movido a top-right
- ✅ RecipeCard: tamaño aumentado (p-3) con backdrop blur
- ✅ RecipeCard: loading spinner durante mutaciones
- ✅ RecipeCard: toast error cuando no estás logueado
- ✅ RecipeCard: mejores animaciones (scale 1.15x hover)
- ✅ RecipeDetail: hero section con imagen y overlay
- ✅ RecipeDetail: botón favorito prominente en header
- ✅ RecipeDetail: texto responsive (oculto en mobile)
- ✅ RecipeDetail: meta cards grid con iconos grandes
- ✅ RecipeDetail: secciones mejoradas con icon headers
- ✅ Optimistic updates en todos los toggles
- ✅ Dark mode completo en todos los componentes
- ✅ Responsive design mobile-first

### v0.3.0 (Sprint 3)

- ✅ Rediseñada ProfilePage con UX profesional moderna
- ✅ Implementado upload de avatar con useUploadAvatar hook
- ✅ Sistema de tabs navigation (Resumen, Recetas, Logros)
- ✅ Activity timeline con eventos recientes
- ✅ Achievement badges con estados locked/unlocked
- ✅ Progress bars animadas para objetivos
- ✅ Hero section con cover gradient y decoraciones
- ✅ Edición inline de nombre y bio
- ✅ Stats cards con iconos coloridos y animaciones
- ✅ Dark mode completo
- ✅ Responsive design mobile-first

### v0.2.0 (Sprint 2)

- ✅ Creados componentes Button e Input reutilizables
- ✅ Actualizada página de Login con diseño profesional
- ✅ Actualizada página de Register con diseño profesional
- ✅ Eliminado scroll vertical en páginas auth
- ✅ Reemplazado emoji por icono ChefHat
- ✅ Agregada utilidad cn para class merging
- ✅ Mejorados estados hover/active/focus
