# 🎨 Guía de Estilos - Tastebook Pro

Documentación completa de estilos, colores, tipografías y patrones de diseño utilizados en Tastebook Pro.

**Última actualización:** 15 Nov 2025  
**Basado en:** Dashboard component (`apps/web/src/app/page.jsx`)

---

## 📑 Índice

1. [Paleta de Colores](#paleta-de-colores)
2. [Tipografías](#tipografías)
3. [Layout y Espaciado](#layout-y-espaciado)
4. [Componentes y Patrones](#componentes-y-patrones)
5. [Estados Interactivos](#estados-interactivos)
6. [Diseño Responsive](#diseño-responsive)
7. [Dark Mode](#dark-mode)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🎨 Paleta de Colores

### Colores Primarios

#### Verde (Primary)
```css
/* Color principal de la app */
--primary: #10b981        /* Base */
--primary-hover: #059669  /* Hover state */
--primary-active: #0ea573 /* Active state */
--primary-dark: #047857   /* Darker variant */
```

**Uso:**
- Botones principales (CTA)
- Iconos activos en navegación
- Badges de estado positivo
- Gradientes en elementos destacados

**Ejemplos en código:**
```jsx
// Botón primary
<button className="bg-gradient-to-b from-[#10b981] to-[#059669] hover:from-[#0ea573] hover:to-[#047857]">
  Nueva Receta
</button>

// Ícono activo
<Calendar size={24} className="text-[#10b981]" />

// Border hover
<div className="hover:border-[#10b981]">
```

---

#### Naranja/Amber (Accent)
```css
--accent-orange: #ff6b35  /* Base */
--accent-amber: #f7931e   /* Gradiente */
--accent-yellow: #f59e0b  /* Highlights */
```

**Uso:**
- Card de racha (streak)
- Iconos de estadísticas
- Highlights de logros

**Ejemplo:**
```jsx
// Streak card con gradiente
<div className="bg-gradient-to-br from-[#ff6b35] to-[#f7931e]">
  <Flame className="text-white" />
  <p className="text-4xl font-bold">12</p>
</div>
```

---

#### Azul (Secondary)
```css
--secondary-blue: #3b82f6
```

**Uso:**
- Indicadores de comidas (cena)
- Elementos secundarios de UI

---

### Colores de Fondo

#### Light Mode
```css
--bg-primary: #F3F3F3      /* Fondo principal */
--bg-secondary: #FFFFFF    /* Cards y elementos */
--bg-tertiary: #F8F8F8     /* Hover states */
--bg-quaternary: #F0F0F0   /* Active states */
```

#### Dark Mode
```css
--bg-primary-dark: #0A0A0A      /* Fondo principal oscuro */
--bg-secondary-dark: #1A1A1A    /* Sidebar oscuro */
--bg-tertiary-dark: #1E1E1E     /* Cards oscuros */
--bg-quaternary-dark: #262626   /* Elementos elevados */
--bg-hover-dark: #2A2A2A        /* Hover state */
```

**Patrón de uso:**
```jsx
<div className="bg-[#F3F3F3] dark:bg-[#0A0A0A]">           {/* Root */}
  <div className="bg-white dark:bg-[#1E1E1E]">            {/* Card */}
    <div className="bg-[#F8F8F8] dark:bg-[#262626]">      {/* Inner element */}
```

---

### Colores de Bordes

#### Light Mode
```css
--border-light: #E6E6E6    /* Borde principal */
--border-medium: #E5E5E5   /* Variante */
--border-dark: #E4E4E4     /* Borde más oscuro */
```

#### Dark Mode
```css
--border-dark-light: #333333   /* Borde principal oscuro */
--border-dark-medium: #404040  /* Borde hover oscuro */
```

**Patrón:**
```jsx
<div className="border border-[#E6E6E6] dark:border-[#333333]">
  <div className="border-r border-[#E6E6E6] dark:border-[#333333]">
```

---

### Colores de Texto

```css
/* Light Mode */
--text-primary: #000000        /* Títulos principales */
--text-secondary: #4B4B4B      /* Textos secundarios */
--text-tertiary: #6E6E6E       /* Textos terciarios */
--text-quaternary: #AAAAAA     /* Textos deshabilitados */

/* Dark Mode */
--text-primary-dark: #FFFFFF   /* Títulos principales */
--text-secondary-dark: #B0B0B0 /* Textos secundarios */
--text-tertiary-dark: #AAAAAA  /* Textos terciarios */
--text-quaternary-dark: #666666 /* Textos deshabilitados */

/* Opacidad alternativa */
black/70    → rgba(0,0,0,0.7)
black/40    → rgba(0,0,0,0.4)
white/70    → rgba(255,255,255,0.7)
white/60    → rgba(255,255,255,0.6)
white/90    → rgba(255,255,255,0.9)
```

**Jerarquía de textos:**
```jsx
// H1 - Títulos principales
<h1 className="text-black dark:text-white font-bold">

// H2 - Títulos de secciones
<h2 className="text-black dark:text-white font-semibold">

// Body - Textos normales
<p className="text-[#6E6E6E] dark:text-[#AAAAAA]">

// Small - Textos pequeños/meta
<span className="text-[#6E6E6E] dark:text-[#AAAAAA] text-sm">
```

---

## 🔤 Tipografías

### Familias de Fuentes

```css
/* Definidas en tailwind.config.js */
font-family:
  sans: ['Inter', 'sans-serif']           /* Default */
  font-sora: 'Sora'                       /* Títulos/números */
  font-inter: 'Inter'                     /* Cuerpo */
  font-plus-jakarta: 'Plus Jakarta Sans'  /* Navegación */
```

### Uso por Elemento

#### Títulos
```jsx
// H1 - Dashboard title
<h1 className="font-bold text-lg font-sora">
  Tastebook
</h1>

// H2 - Section headers
<h2 className="text-xl font-bold font-sora">
  Plan Semanal
</h2>

// H3 - Sub-headers
<h3 className="text-lg font-bold font-sora">
  Logros Recientes
</h3>
```

#### Números/Stats
```jsx
// Números grandes (stats)
<p className="text-4xl font-bold font-sora">
  12
</p>

<p className="text-3xl font-bold font-sora">
  45
</p>

<p className="text-2xl font-bold font-sora">
  5
</p>
```

#### Cuerpo de Texto
```jsx
// Labels
<p className="font-semibold font-inter">
  Esta Semana
</p>

// Descripciones
<p className="text-sm font-inter">
  recetas planeadas
</p>

// Texto pequeño
<p className="text-xs font-inter">
  Pro
</p>
```

#### Navegación
```jsx
<span className="font-medium text-sm font-plus-jakarta">
  Dashboard
</span>
```

---

### Escalas de Tamaños

```css
text-xs    → 0.75rem (12px)
text-sm    → 0.875rem (14px)
text-base  → 1rem (16px)      /* Default */
text-lg    → 1.125rem (18px)
text-xl    → 1.25rem (20px)
text-2xl   → 1.5rem (24px)
text-3xl   → 1.875rem (30px)
text-4xl   → 2.25rem (36px)
```

### Pesos de Fuente

```css
font-normal    → 400
font-medium    → 500
font-semibold  → 600
font-bold      → 700
```

---

## 📐 Layout y Espaciado

### Sistema de Grid

#### Stats Grid (Top Row)
```jsx
// Desktop: 3 columnas | Mobile: 1 columna
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Streak Card */}
  {/* This Week */}
  {/* Recipes Created */}
</div>
```

#### Main Content Grid
```jsx
// Desktop: 2/3 left + 1/3 right | Mobile: stack
<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
  <div className="xl:col-span-2"> {/* Left column */}
  <div> {/* Right column - sidebar widgets */}
</div>
```

#### Ingredient Pills Grid
```jsx
// Desktop: 3 cols | Tablet: 2 cols | Mobile: 2 cols
<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
```

---

### Flexbox Patterns

#### Root Layout
```jsx
// Full height, columnas en desktop
<div className="flex h-screen">
  <Sidebar />
  <div className="flex-1 flex flex-col">
    <Header />
    <main className="flex-1 overflow-y-auto">
```

#### Cards con Íconos
```jsx
<div className="flex items-center gap-3">
  <Icon size={24} />
  <div>
    <p className="font-semibold">Label</p>
    <p className="text-sm">Description</p>
  </div>
</div>
```

#### Botones con Íconos
```jsx
<button className="flex items-center gap-2">
  <Plus size={18} />
  <span>Nueva Receta</span>
</button>
```

---

### Espaciado (Padding & Margin)

#### Escala de Espacios
```css
p-0   → 0
p-1   → 0.25rem (4px)
p-2   → 0.5rem (8px)
p-3   → 0.75rem (12px)
p-4   → 1rem (16px)
p-6   → 1.5rem (24px)
p-8   → 2rem (32px)

gap-2  → 0.5rem (8px)
gap-3  → 0.75rem (12px)
gap-4  → 1rem (16px)
gap-6  → 1.5rem (24px)
gap-8  → 2rem (32px)
```

#### Patrón Común de Cards
```jsx
// Card exterior
<div className="rounded-xl p-6">
  // Título
  <h2 className="mb-4">
  
  // Contenido con espaciado vertical
  <div className="space-y-3">
    {/* Items */}
  </div>
</div>
```

#### Responsive Padding
```jsx
// Mobile: p-4 | Desktop: p-8
<div className="p-4 md:p-8">
```

---

### Bordes y Radios

```css
/* Border Radius */
rounded-full → 9999px (círculos)
rounded-xl   → 0.75rem (12px)  /* Cards principales */
rounded-lg   → 0.5rem (8px)    /* Botones, elementos pequeños */

/* Border Width */
border       → 1px
border-2     → 2px
```

**Patrón de Cards:**
```jsx
<div className="border border-[#E6E6E6] dark:border-[#333333] rounded-xl">
```

---

## 🧩 Componentes y Patrones

### Card Base

```jsx
<div className="
  bg-white dark:bg-[#1E1E1E] 
  border border-[#E6E6E6] dark:border-[#333333] 
  rounded-xl 
  p-6
">
  <h2 className="text-xl font-bold text-black dark:text-white mb-4 font-sora">
    Título
  </h2>
  <div className="space-y-3">
    {/* Contenido */}
  </div>
</div>
```

---

### Botón Primary (CTA)

```jsx
<button className="
  px-4 py-2 
  rounded-lg 
  bg-gradient-to-b from-[#10b981] to-[#059669] 
  text-white 
  font-semibold 
  transition-all duration-150 
  hover:from-[#0ea573] hover:to-[#047857] 
  active:from-[#0d9468] active:to-[#065f46] 
  active:scale-95 
  font-inter
">
  Nueva Receta
</button>
```

**Variantes:**
```jsx
// Con ícono
<button className="flex items-center gap-2 ...">
  <Plus size={18} />
  <span>Nueva Receta</span>
</button>

// Botón redondeado (pill)
<button className="h-10 px-4 md:px-7 rounded-full ...">
```

---

### Botón Secondary

```jsx
<button className="
  px-4 py-2 
  rounded-lg 
  border border-[#E6E6E6] dark:border-[#404040] 
  bg-white dark:bg-[#262626] 
  text-black dark:text-white 
  font-inter 
  text-sm 
  transition-all duration-150 
  hover:border-[#10b981] 
  hover:bg-[#10b981]/5 
  active:scale-95
">
  Ingrediente
</button>
```

---

### Botón Ghost/Link

```jsx
<button className="
  text-sm 
  text-[#10b981] 
  hover:text-[#059669] 
  font-inter 
  font-semibold
">
  Ver todo →
</button>
```

---

### Item Card (Clickeable)

```jsx
<button className="
  w-full 
  flex items-center gap-3 
  p-2 
  rounded-lg 
  hover:bg-[#F8F8F8] dark:hover:bg-[#262626] 
  transition-all
">
  <img src="..." className="w-12 h-12 rounded-lg object-cover" />
  <div className="flex-1 text-left">
    <p className="font-semibold text-black dark:text-white font-inter text-sm">
      Título
    </p>
    <div className="flex gap-0.5 mt-1">
      {/* Rating stars */}
    </div>
  </div>
</button>
```

---

### Badge/Pill

```jsx
<div className="
  px-4 py-2 
  rounded-lg 
  bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 
  border border-[#10b981]/20
">
  <p className="font-semibold text-black dark:text-white">
    Logro
  </p>
</div>
```

---

### Avatar

```jsx
<img 
  src="..." 
  alt="User Avatar" 
  className="
    w-10 h-10 
    rounded-full 
    ring-2 ring-white dark:ring-[#333333] 
    hover:ring-[#10b981] dark:hover:ring-[#10b981] 
    cursor-pointer 
    object-cover
  "
/>
```

---

### Stat Card

```jsx
<div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
  <div className="flex items-center gap-3 mb-3">
    <Calendar size={24} className="text-[#10b981]" />
    <p className="font-semibold text-black dark:text-white font-inter">
      Esta Semana
    </p>
  </div>
  <p className="text-3xl font-bold text-black dark:text-white font-sora mb-1">
    5
  </p>
  <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
    recetas planeadas
  </p>
</div>
```

---

## ✨ Estados Interactivos

### Hover States

#### Botones
```jsx
// Background change
hover:bg-[#F8F8F8] dark:hover:bg-[#262626]

// Border change
hover:border-[#10b981]

// Color change
hover:text-[#059669]

// Gradient change
hover:from-[#0ea573] hover:to-[#047857]
```

#### Cards
```jsx
hover:bg-[#F8F8F8] dark:hover:bg-[#262626]
hover:bg-white dark:hover:bg-[#2A2A2A]
```

#### Iconos
```jsx
hover:ring-[#10b981]
```

---

### Active States

```jsx
// Escala down (feedback táctil)
active:scale-95
active:scale-[0.98]

// Background más oscuro
active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A]
active:bg-white/70 dark:active:bg-white/15

// Gradiente más oscuro
active:from-[#0d9468] active:to-[#065f46]
```

---

### Focus States

```jsx
// Outline (accesibilidad)
focus:outline-none focus:ring-2 focus:ring-[#10b981]

// Border highlight
focus:border-[#10b981]
```

---

### Disabled States

```jsx
disabled:opacity-50
disabled:cursor-not-allowed
disabled:hover:bg-transparent
```

---

### Transiciones

```css
/* Duraciones estándar */
transition-all duration-150  /* Rápido - botones, hovers */
transition-all duration-200  /* Medio - cards */
transition-all duration-300  /* Lento - sidebar, modales */
transition-all duration-500  /* Muy lento - animaciones complejas */

/* Easing por defecto */
ease-in-out  /* Suave */
ease-out     /* Natural */
```

**Ejemplo completo:**
```jsx
<button className="
  transition-all duration-150
  hover:bg-[#F8F8F8] 
  active:scale-95
">
```

---

## 📱 Diseño Responsive

### Breakpoints

```css
/* Tailwind breakpoints (mobile-first) */
sm:  640px   @media (min-width: 640px)
md:  768px   @media (min-width: 768px)
lg:  1024px  @media (min-width: 1024px)
xl:  1280px  @media (min-width: 1280px)
2xl: 1536px  @media (min-width: 1536px)
```

---

### Patrones Responsive Comunes

#### Grids Adaptivos
```jsx
// Mobile: 1 col | Desktop: 3 cols
<div className="grid grid-cols-1 lg:grid-cols-3">

// Mobile: 2 cols | Tablet: 3 cols
<div className="grid grid-cols-2 md:grid-cols-3">

// Mobile: stack | Desktop: 2/3 + 1/3
<div className="grid grid-cols-1 xl:grid-cols-3">
  <div className="xl:col-span-2">
```

---

#### Padding Responsive
```jsx
// Mobile: 4 | Desktop: 8
<div className="p-4 md:p-8">
```

---

#### Sidebar Toggle (Mobile)
```jsx
// Hidden en mobile, static en desktop
<div className={`
  fixed lg:static 
  inset-y-0 left-0 
  z-50 lg:z-auto
  transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  lg:translate-x-0 
  transition-transform duration-300 ease-in-out
`}>
  <Sidebar />
</div>

// Overlay solo en mobile
{sidebarOpen && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}
```

---

#### Texto Responsive
```jsx
// Ocultar texto en mobile, mostrar en desktop
<span className="hidden sm:inline">Nueva Receta</span>
```

---

#### Iconos Responsive
```jsx
// Mobile: solo ícono | Desktop: ícono + texto
<button className="flex items-center gap-2">
  <Plus size={18} />
  <span className="hidden sm:inline">Nueva Receta</span>
</button>
```

---

## 🌗 Dark Mode

### Estrategia

Tastebook Pro usa el prefijo `dark:` de Tailwind CSS para todos los estilos de modo oscuro.

**Patrón básico:**
```jsx
<div className="
  bg-white dark:bg-[#1E1E1E]
  text-black dark:text-white
  border-[#E6E6E6] dark:border-[#333333]
">
```

---

### Conversiones de Color

| Light Mode | Dark Mode | Uso |
|------------|-----------|-----|
| `#F3F3F3` | `#0A0A0A` | Fondo principal |
| `#FFFFFF` | `#1E1E1E` | Cards |
| `#F8F8F8` | `#262626` | Elementos elevados |
| `#E6E6E6` | `#333333` | Bordes |
| `#E5E5E5` | `#404040` | Bordes hover |
| `#6E6E6E` | `#AAAAAA` | Textos secundarios |
| `#000000` | `#FFFFFF` | Textos primarios |

---

### Opacidades en Dark Mode

```jsx
// Light mode usa black con opacidad
text-black/70  → rgba(0,0,0,0.7)
text-black/40  → rgba(0,0,0,0.4)

// Dark mode usa white con opacidad
dark:text-white/70  → rgba(255,255,255,0.7)
dark:text-white/60  → rgba(255,255,255,0.6)
dark:text-white/40  → rgba(255,255,255,0.4)
```

---

### Overlays

```jsx
// Overlay de sidebar mobile
<div className="
  bg-black bg-opacity-50 
  dark:bg-black dark:bg-opacity-70
">
```

---

### Gradientes en Dark Mode

Los gradientes de color (verde, naranja) **no cambian** en dark mode:
```jsx
// Se mantiene igual en light y dark
<div className="bg-gradient-to-b from-[#10b981] to-[#059669]">
```

Solo los fondos/textos/bordes cambian.

---

## ✅ Mejores Prácticas

### 1. Consistencia de Colores

✅ **Hacer:**
- Usar variables de color definidas en esta guía
- Mantener jerarquía: primary → secondary → tertiary
- Usar `dark:` para todos los estilos en modo oscuro

❌ **Evitar:**
- Inventar nuevos colores sin documentar
- Usar colores hardcodeados sin variables
- Olvidar estilos dark mode

---

### 2. Espaciado

✅ **Hacer:**
- Usar múltiplos de 4px: `p-2`, `p-4`, `p-6`, `p-8`
- Mantener espaciado consistente en cards: `p-6`
- Usar `space-y-{n}` para listas verticales
- Usar `gap-{n}` para flex/grid

❌ **Evitar:**
- Valores arbitrarios como `p-[13px]`
- Mezclar `margin` y `padding` innecesariamente

---

### 3. Tipografía

✅ **Hacer:**
- `font-sora` para títulos y números grandes
- `font-inter` para cuerpo de texto
- Mantener jerarquía: `text-4xl` > `text-3xl` > `text-2xl` > `text-xl`
- Usar `font-bold` para títulos, `font-semibold` para labels

❌ **Evitar:**
- Mezclar más de 2 fuentes en un componente
- Usar tamaños intermedios innecesarios

---

### 4. Interactividad

✅ **Hacer:**
- Siempre incluir `transition-all`
- Usar `hover:` para feedback visual
- Usar `active:scale-95` en botones
- Incluir estados disabled cuando aplique

❌ **Evitar:**
- Botones sin feedback hover
- Transiciones muy lentas (>500ms)
- Olvidar estados active/focus

---

### 5. Responsive

✅ **Hacer:**
- Mobile-first: estilos base para mobile
- Usar breakpoints: `md:` para tablet, `lg:` para desktop
- Probar en móvil, tablet y desktop
- Ocultar elementos no críticos en mobile con `hidden md:block`

❌ **Evitar:**
- Desktop-first (requiere más código)
- Breakpoints custom innecesarios
- Layouts que no funcionan en mobile

---

### 6. Accesibilidad

✅ **Hacer:**
- Contraste mínimo AA: 4.5:1 para texto
- `focus:ring-2` en elementos interactivos
- Textos legibles (min 14px)
- Iconos con labels semánticos

❌ **Evitar:**
- Colores con bajo contraste
- Botones sin estados focus
- Textos muy pequeños (<12px)

---

## 📋 Checklist de Nuevo Componente

Antes de crear un nuevo componente, verifica:

- [ ] ¿Usa colores de la paleta definida?
- [ ] ¿Tiene estilos dark mode con `dark:`?
- [ ] ¿Usa `font-sora` o `font-inter` apropiadamente?
- [ ] ¿Espaciado consistente (múltiplos de 4)?
- [ ] ¿Incluye `transition-all` en elementos interactivos?
- [ ] ¿Tiene estados hover/active/focus?
- [ ] ¿Es responsive (mobile-first)?
- [ ] ¿Probado en mobile, tablet y desktop?
- [ ] ¿Contraste de color accesible?
- [ ] ¿Documentado en STYLES.md si es patrón nuevo?

---

## 🔄 Actualización de Este Documento

**Cuándo actualizar:**
- Al crear nuevos componentes con estilos únicos
- Al definir nuevos colores o tokens
- Al establecer nuevos patrones de diseño
- Al cambiar convenciones de naming

**Cómo actualizar:**
1. Agregar nuevos colores a Paleta de Colores
2. Documentar nuevos patrones en Componentes y Patrones
3. Actualizar ejemplos de código
4. Mantener consistencia con naming existente

---

**Última actualización:** 15 Nov 2025  
**Mantenido por:** Equipo de Desarrollo Tastebook Pro  
**Basado en:** Dashboard component (`apps/web/src/app/page.jsx`)
