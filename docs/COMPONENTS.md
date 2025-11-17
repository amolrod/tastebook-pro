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

## Changelog

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
