# ⚡ Optimización de Performance - Tastebook Pro

Guía para mejorar el rendimiento del proyecto durante desarrollo.

---

## 🎯 Optimizaciones Implementadas

### 1. Vite Configuration

**Archivo:** `apps/web/vite.config.ts`

**Cambios aplicados:**

```typescript
server: {
  watch: {
    // Excluir directorios innecesarios
    ignored: [
      '**/node_modules/**',
      '**/apps/mobile/**',
      '**/docs/**',
      '**/scripts/**',
    ],
    usePolling: false,
    interval: 100,
  },
}
```

**Beneficios:**
- ✅ Menos archivos vigilados = menos CPU
- ✅ HMR más rápido
- ✅ Menor uso de memoria

### 2. React Query Optimization

**Archivo:** `apps/web/src/app/root.tsx`

**Configuración optimizada:**

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 min cache
      gcTime: 1000 * 60 * 10,          // 10 min garbage collection
      refetchOnWindowFocus: false,     // No refetch al volver a la ventana
      refetchOnMount: false,           // No refetch al montar
      refetchOnReconnect: false,       // No refetch al reconectar
      retry: 1,                        // Solo 1 retry en error
    },
  },
});
```

**Beneficios:**
- ✅ Menos llamadas a Supabase
- ✅ Mejor uso de cache
- ✅ Menos re-renders

### 3. Framer Motion Configuration

**Archivo:** `apps/web/src/utils/motionConfig.ts`

**Configuración creada:**

```typescript
// Desactivar animaciones en desarrollo
const DISABLE_ANIMATIONS_IN_DEV = false; // Cambiar a true si va lento

export const shouldAnimate = !isDev || !DISABLE_ANIMATIONS_IN_DEV;
```

**Uso:**

```tsx
import { motionProps, slideUpVariants } from '@/utils/motionConfig';

<motion.div {...motionProps({ variants: slideUpVariants })}>
  Contenido
</motion.div>
```

**Beneficios:**
- ✅ Desactivar animaciones fácilmente
- ✅ Menos carga GPU
- ✅ HMR más fluido

---

## 🔧 Optimizaciones Adicionales (Opcionales)

### Opción 1: Desactivar TypeScript Checking en VS Code

Si tu Mac va muy lento editando archivos:

1. Abre VS Code Settings (Cmd+,)
2. Busca "typescript validate"
3. Desactiva "TypeScript › Validate: Enable"
4. Ejecuta `pnpm typecheck` manualmente cuando necesites

### Opción 2: Reducir Extensiones de VS Code

Desactiva extensiones que no uses activamente:
- Formatters que no uses
- Linters duplicados
- Extensiones de lenguajes que no uses

### Opción 3: Aumentar Límite de Watchers (macOS)

Si ves error "EMFILE: too many open files":

```bash
# Aumentar límite de archivos abiertos
echo kern.maxfiles=65536 | sudo tee -a /etc/sysctl.conf
echo kern.maxfilesperproc=65536 | sudo tee -a /etc/sysctl.conf
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=65536
```

### Opción 4: Usar React DevTools Solo Cuando Necesites

Las DevTools consumen recursos:
- No las abras si no las usas
- Cierra el profiler cuando no debuguees

### Opción 5: Build en Lugar de Dev

Para probar features sin HMR:

```bash
pnpm build
pnpm preview
```

Más rápido que `pnpm dev` pero sin hot reload.

---

## 📊 Monitoreo de Performance

### En el Navegador

**Chrome DevTools:**
1. Abre DevTools (F12)
2. Ve a "Performance" tab
3. Graba mientras usas la app
4. Busca componentes lentos

**React DevTools Profiler:**
1. Instala React DevTools extension
2. Abre "Profiler" tab
3. Graba interacciones
4. Identifica re-renders innecesarios

### En VS Code

**Task Manager:**
1. Cmd+Shift+P → "Developer: Open Process Explorer"
2. Ver qué extensiones/procesos consumen más
3. Desactivar los problemáticos

---

## 🎨 Optimización de Imágenes

### Subir Imágenes Optimizadas

Antes de subir a Supabase:

```bash
# Instalar ImageMagick
brew install imagemagick

# Optimizar imagen
convert input.jpg -quality 85 -resize 1200x output.jpg
```

### En el Código

Usar lazy loading:

```tsx
<img 
  src={recipe.image_url} 
  alt={recipe.title}
  loading="lazy"
  decoding="async"
/>
```

---

## 🚀 Tailwind CSS Optimization

### JIT Already Enabled

Tailwind CSS JIT está activo por defecto en Vite.

### Purge Unused Classes

En producción, solo se incluyen las clases usadas.

### Reduce Variants (Opcional)

Si la app es muy lenta, puedes reducir variantes en `tailwind.config.js`:

```js
module.exports = {
  theme: {
    // ...
  },
  corePlugins: {
    // Desactivar plugins que no uses
    // float: false,
    // objectFit: false,
  },
}
```

---

## 📝 Checklist de Performance

**Antes de empezar sesión de desarrollo:**

- [ ] Cerrar apps innecesarias (Chrome tabs, Spotify, etc.)
- [ ] Cerrar React DevTools si no las usas
- [ ] Verificar que solo tengas 1 terminal corriendo `pnpm dev`
- [ ] Limpiar cache si es necesario: `rm -rf node_modules/.vite`

**Durante desarrollo:**

- [ ] Usar `console.log` con moderación (eliminar logs viejos)
- [ ] No tener múltiples tabs de localhost:4000 abiertas
- [ ] Commit frecuentemente para evitar cambios gigantes
- [ ] Reiniciar el servidor si HMR se vuelve lento

**Cuando la app esté lenta:**

1. Reiniciar servidor: `Ctrl+C` y `pnpm dev`
2. Limpiar cache: `rm -rf node_modules/.vite && pnpm dev`
3. Desactivar animaciones: `DISABLE_ANIMATIONS_IN_DEV = true`
4. Usar build mode: `pnpm build && pnpm preview`

---

## 🔍 Troubleshooting

### "Mi Mac se pilla mucho"

**Causas comunes:**

1. **Demasiados watchers** → Aplicar configuración de Vite
2. **React Query refetching mucho** → Aplicar configuración optimizada
3. **Animaciones pesadas** → Desactivar en desarrollo
4. **TypeScript checking** → Desactivar en VS Code
5. **Muchas extensiones VS Code** → Desactivar innecesarias

### "HMR tarda mucho"

**Soluciones:**

1. Reiniciar servidor
2. Limpiar cache Vite
3. Reducir archivos vigilados
4. Cerrar tabs innecesarias

### "El build tarda mucho"

**Soluciones:**

1. Usar `pnpm dev` en desarrollo
2. Aumentar memoria de Node: `NODE_OPTIONS=--max-old-space-size=4096 pnpm build`
3. Revisar imports circulares

---

## 💡 Tips Generales

1. **Commits pequeños** - Más fáciles de procesar por HMR
2. **Componentes pequeños** - Más rápidos de re-renderizar
3. **Memo/useMemo/useCallback** - Pero solo cuando sea necesario
4. **Lazy imports** - `const Component = lazy(() => import('./Component'))`
5. **Code splitting** - Ya configurado en vite.config.ts

---

**Última actualización:** 17 Nov 2025  
**Versión:** v0.4.1
