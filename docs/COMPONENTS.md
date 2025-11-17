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

## Changelog

### v0.2.0 (Sprint 2)

- ✅ Creados componentes Button e Input reutilizables
- ✅ Actualizada página de Login con diseño profesional
- ✅ Actualizada página de Register con diseño profesional
- ✅ Eliminado scroll vertical en páginas auth
- ✅ Reemplazado emoji por icono ChefHat
- ✅ Agregada utilidad cn para class merging
- ✅ Mejorados estados hover/active/focus
