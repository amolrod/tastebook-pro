# 🔑 DÓNDE ENCONTRAR TUS CREDENCIALES DE SUPABASE

## 📍 Paso 1: Ir al Dashboard de Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Verás tu lista de proyectos (o créa uno nuevo)

---

## 📍 Paso 2: Crear Proyecto (si no tienes uno)

Si no tienes un proyecto, haz clic en **"New Project"**:

```
┌─────────────────────────────────────────┐
│  New Project                            │
├─────────────────────────────────────────┤
│  Name: tastebook-pro                    │
│  Database Password: [tu-password-aqui]  │
│  Region: South America (São Paulo)      │
│  Plan: Free                             │
│                                         │
│  [Create new project]                   │
└─────────────────────────────────────────┘
```

⏱️ **Espera 2-3 minutos** mientras se crea el proyecto.

---

## 📍 Paso 3: Obtener SUPABASE_URL y SUPABASE_ANON_KEY

Una vez creado el proyecto:

### A) En el Dashboard Principal:

1. Haz clic en tu proyecto
2. Ve a **Settings** (⚙️ icono de engranaje en la barra lateral izquierda)
3. Haz clic en **API** en el menú de Settings

### B) En la sección API verás:

```
┌──────────────────────────────────────────────────────────────┐
│ Project API                                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Project URL                                                  │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ https://abcdefghijklmnop.supabase.co            [Copy]│  │ ← ESTE ES TU SUPABASE_URL
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ API Keys                                                     │
│                                                              │
│ anon public                                                  │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi... [Copy]│  │ ← ESTE ES TU SUPABASE_ANON_KEY
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ service_role secret                                          │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi... [Copy]│  │ ← NO uses esta (es para backend)
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## ✅ LOS DOS DATOS QUE NECESITAS:

### 1️⃣ **SUPABASE_URL** (Project URL)
```
https://abcdefghijklmnop.supabase.co
```
- Formato: `https://[tu-proyecto-id].supabase.co`
- Ejemplo real: `https://xyzabc123def456.supabase.co`

### 2️⃣ **SUPABASE_ANON_KEY** (anon public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuYXRiY...
```
- Es una clave MUY larga (como 200+ caracteres)
- Empieza con `eyJ`
- Es seguro usarla en el frontend (es la clave pública)

---

## 🚨 IMPORTANTE: ¿Cuál NO usar?

❌ **NO uses** `service_role secret` - Esta es para operaciones de backend/admin
✅ **USA** `anon public` - Esta es para tu aplicación frontend

---

## 📝 COPIAR LAS CREDENCIALES

### Opción A: Script Automatizado (Recomendado)

```bash
# Ejecuta este comando desde la raíz del proyecto
./scripts/setup.sh
```

El script te pedirá:
1. Tu SUPABASE_URL
2. Tu SUPABASE_ANON_KEY

Y creará automáticamente el archivo `.env.local` ✨

### Opción B: Manual

1. Abre el archivo: `apps/web/.env.local`
2. Pega tus credenciales:

```env
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...tu-key-completa-aqui
```

3. Guarda el archivo

---

## 🔍 RESUMEN VISUAL

```
Supabase Dashboard
    ↓
Settings (⚙️)
    ↓
API
    ↓
┌─────────────────────────────────────┐
│ Project URL                         │
│ https://xxxxx.supabase.co    [Copy] │ → Copia esto
└─────────────────────────────────────┘
    ↓
Pega en .env.local como:
VITE_SUPABASE_URL=https://xxxxx.supabase.co

┌─────────────────────────────────────┐
│ anon public                         │
│ eyJhbGciOiJIUzI1NiI...       [Copy] │ → Copia esto
└─────────────────────────────────────┘
    ↓
Pega en .env.local como:
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI...
```

---

## 🎯 DESPUÉS DE COPIAR LAS CREDENCIALES

1. **Ejecuta el SQL:**
   - Ve a **SQL Editor** en Supabase
   - Copia el contenido de `supabase_setup.sql`
   - Pega y haz clic en **Run**

2. **Crea el Bucket de Storage:**
   - Ve a **Storage** en Supabase
   - Clic en **Create bucket**
   - Name: `recipe-images`
   - Public: ✅ Activado
   - Clic en **Create**

3. **Inicia el servidor:**
   ```bash
   cd apps/web
   pnpm dev
   ```

4. **Abre la app:**
   ```
   http://localhost:4000/recipes
   ```

---

## ❓ FAQ

**P: ¿Puedo compartir mi ANON_KEY?**
R: Es relativamente seguro (está diseñada para frontend), pero no la publiques en GitHub público. Ya está protegida por Row Level Security (RLS).

**P: ¿Dónde guardo mi Database Password?**
R: No la necesitas para la app. Solo la usaste al crear el proyecto. Guárdala en un lugar seguro por si necesitas acceso directo a PostgreSQL.

**P: ¿Puedo cambiar las credenciales después?**
R: Sí, pero se resetearán todas las claves de API. Mejor mantén las que tienes.

**P: Mi .env.local no funciona**
R: Recuerda:
- Las variables DEBEN empezar con `VITE_`
- Reinicia el servidor después de editar `.env.local`
- No debe haber espacios antes/después del `=`

---

## ✅ CHECKLIST

- [ ] Crear proyecto en Supabase
- [ ] Ir a Settings → API
- [ ] Copiar **Project URL**
- [ ] Copiar **anon public** key (la primera, NO la service_role)
- [ ] Pegar en `apps/web/.env.local` con prefijo `VITE_`
- [ ] Ejecutar SQL en SQL Editor
- [ ] Crear bucket `recipe-images` en Storage
- [ ] Reiniciar servidor (`pnpm dev`)
- [ ] Probar en `http://localhost:4000/recipes`

---

**🎉 ¡Listo! Con esto ya puedes configurar Supabase completamente.**
