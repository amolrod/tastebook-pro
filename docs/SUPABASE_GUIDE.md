# 🚀 Guía Completa de Supabase - Tastebook Pro

Guía maestra para configurar y mantener la infraestructura de Supabase del proyecto.

---

## 📋 Índice

1. [Configuración Inicial](#configuración-inicial)
2. [Base de Datos y Schema](#base-de-datos-y-schema)
3. [Autenticación](#autenticación)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Storage](#storage)
6. [Testing y Verificación](#testing-y-verificación)
7. [Troubleshooting](#troubleshooting)

---

## Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Click en **"New Project"**
3. Configura el proyecto:
   - **Name:** `tastebook-pro`
   - **Database Password:** Guarda la contraseña de forma segura
   - **Region:** Elige la más cercana (ej: South America - São Paulo)
   - **Pricing Plan:** Free (suficiente para desarrollo)
4. Click en **"Create new project"** y espera 2-3 minutos

### 2. Obtener Credenciales

1. Ve a **Settings** (⚙️) → **API**
2. Copia:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** La clave pública (empieza con `eyJhbG...`)

⚠️ **NUNCA uses la service_role key en el frontend**

### 3. Configurar Variables de Entorno

Crea/edita `apps/web/.env.local`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

⚠️ Este archivo está en `.gitignore` - nunca lo subas a Git

---

## Base de Datos y Schema

### Ejecutar Script de Creación

1. Ve a **SQL Editor** en Supabase
2. Crea **New Query**
3. Copia el contenido de `/supabase_setup.sql` o el SQL de `/docs/DATABASE.md`
4. Click en **Run**

### Tablas Creadas

El script crea estas tablas:

```
📦 Tastebook Pro Database
├── users - Perfiles de usuario
├── recipes - Recetas con ingredientes e instrucciones
├── favorites - Recetas favoritas de usuarios
├── meal_plans - Planificación semanal de comidas
├── shopping_lists - Listas de compra
├── collections - Colecciones personalizadas
├── reviews - Reseñas y ratings
├── achievements - Sistema de logros
└── user_achievements - Logros desbloqueados
```

### Verificar Creación

```sql
-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Contar registros en recipes
SELECT COUNT(*) FROM recipes;
```

---

## Autenticación

### Configurar Email Auth

El sistema usa autenticación por email/password de Supabase.

#### 1. Configuración de Email (Opcional)

1. Ve a **Authentication** → **Settings**
2. Configura:
   - **Site URL:** `http://localhost:4000` (desarrollo)
   - **Redirect URLs:** Agrega `http://localhost:4000/**` 

#### 2. Email Templates (Opcional)

Ve a **Authentication** → **Email Templates** y personaliza:
- Confirm signup
- Magic Link
- Reset Password
- Change Email

#### 3. Providers OAuth (Opcional)

Para habilitar Google/GitHub login:

1. Ve a **Authentication** → **Providers**
2. Habilita el provider deseado
3. Configura OAuth credentials
4. Actualiza el código frontend para usar `signInWithOAuth()`

---

## Row Level Security (RLS)

Las políticas RLS están incluidas en el script SQL inicial, pero aquí está el resumen:

### Políticas por Tabla

#### **users** (Perfiles)

```sql
-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- SELECT: Ver solo propio perfil
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- INSERT: Crear perfil durante registro
CREATE POLICY "Users can insert own profile"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (true);

-- UPDATE: Actualizar solo propio perfil
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
TO authenticated
USING (auth.uid() = id);
```

#### **recipes** (Recetas)

```sql
-- SELECT: Ver recetas públicas o propias
CREATE POLICY "Allow public read access"
ON public.recipes FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- INSERT: Solo usuarios autenticados
CREATE POLICY "Users can create own recipes"
ON public.recipes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Solo el dueño
CREATE POLICY "Users can update own recipes"
ON public.recipes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- DELETE: Solo el dueño
CREATE POLICY "Users can delete own recipes"
ON public.recipes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

#### **favorites** (Favoritos)

```sql
-- SELECT: Ver solo propios favoritos
CREATE POLICY "Users can view own favorites"
ON public.favorites FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- INSERT: Agregar a propios favoritos
CREATE POLICY "Users can insert own favorites"
ON public.favorites FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- DELETE: Eliminar de propios favoritos
CREATE POLICY "Users can delete own favorites"
ON public.favorites FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### Verificar Políticas

```sql
-- Ver todas las políticas
SELECT 
    tablename,
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
```

---

## Storage

### Crear Bucket para Imágenes

1. Ve a **Storage** en el menú lateral
2. Click en **Create a new bucket**
3. Configura:
   - **Name:** `recipe-images`
   - **Public:** ✅ (para que las imágenes sean accesibles)
   - **File size limit:** 5 MB
   - **Allowed MIME types:** `image/jpeg`, `image/png`, `image/webp`
4. Click en **Create bucket**

### Políticas de Storage

```sql
-- Permitir lectura pública de imágenes
CREATE POLICY "Public can view recipe images"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-images');

-- Solo usuarios autenticados pueden subir
CREATE POLICY "Authenticated users can upload recipe images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'recipe-images');

-- Solo el dueño puede actualizar/eliminar sus imágenes
CREATE POLICY "Users can update own recipe images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own recipe images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'recipe-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Estructura de Carpetas

Las imágenes se guardan con esta estructura:

```
recipe-images/
└── {user_id}/
    ├── {recipe_id}_1234567890.jpg
    ├── {recipe_id}_1234567891.jpg
    └── ...
```

---

## Testing y Verificación

### 1. Test de Conexión

```bash
cd apps/web
pnpm dev
```

Abre http://localhost:4000 - no debería haber errores de conexión.

### 2. Test de Autenticación

**Registro:**
1. Ve a `/register`
2. Completa el formulario
3. Verifica que te redirija automáticamente
4. Revisa **Table Editor** → `users` en Supabase

**Login:**
1. Cierra sesión
2. Ve a `/login`
3. Inicia sesión
4. Verifica que el header muestre tu nombre

**Persistencia:**
1. Recarga la página (F5)
2. La sesión debe persistir

### 3. Test de RLS

**Como usuario autenticado:**
```sql
-- Debería devolver solo tu perfil
SELECT * FROM users;

-- Debería devolver tus favoritos
SELECT * FROM favorites;
```

**Sin autenticación:**
```sql
-- Debería devolver solo recetas públicas
SELECT * FROM recipes WHERE is_public = true;
```

### 4. Test de Storage

1. Crea una receta con imagen
2. Verifica en **Storage** → `recipe-images` que se subió
3. La URL debería ser accesible públicamente

---

## Troubleshooting

### Error: "Invalid API key"

✅ Verifica que copiaste la **anon key** correcta  
✅ No uses la service_role key  
✅ Revisa que no haya espacios en la key  
✅ Reinicia el servidor

### Error: "relation does not exist"

✅ Ejecuta el SQL de creación de tablas  
✅ Verifica en Table Editor que existen  
✅ Revisa que el schema sea `public`

### Error: "new row violates row-level security policy"

✅ Verifica que las políticas RLS estén creadas  
✅ Asegúrate de estar autenticado  
✅ Revisa que el `user_id` coincida con `auth.uid()`

### Error: "null value in column 'user_id'"

✅ Verifica que `user_id` se está pasando en la inserción  
✅ Revisa que `auth.uid()` no sea null (usuario autenticado)  
✅ Temporalmente permite NULL si es necesario

### Imágenes no se cargan

✅ Verifica que el bucket sea **público**  
✅ Revisa las políticas de Storage  
✅ Comprueba la URL de la imagen  
✅ Verifica el MIME type permitido

### Session no persiste

✅ Verifica que Supabase esté usando localStorage  
✅ Revisa la configuración de cookies  
✅ Comprueba que la Site URL esté configurada

---

## 🔐 Mejores Prácticas

### Seguridad

- ✅ Nunca expongas la service_role key
- ✅ Usa RLS en todas las tablas con datos de usuario
- ✅ Valida datos en el backend (Supabase Functions)
- ✅ Limita tamaño de archivos en Storage
- ✅ Usa HTTPS en producción

### Performance

- ✅ Crea índices en campos de búsqueda
- ✅ Usa `select()` para traer solo campos necesarios
- ✅ Implementa paginación con `range()`
- ✅ Usa React Query para cache del lado cliente
- ✅ Optimiza imágenes antes de subir

### Mantenimiento

- ✅ Documenta cambios en el schema
- ✅ Haz backup de la base de datos regularmente
- ✅ Monitorea logs en el dashboard
- ✅ Revisa uso de Storage periódicamente

---

## 📚 Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [PostgreSQL Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html)

---

## ✅ Checklist de Setup Completo

- [ ] Proyecto creado en Supabase
- [ ] Variables de entorno configuradas
- [ ] Tablas creadas (ejecutar SQL)
- [ ] RLS policies configuradas
- [ ] Storage bucket `recipe-images` creado
- [ ] Políticas de Storage configuradas
- [ ] Auth configurado (Email templates opcional)
- [ ] Test de conexión exitoso
- [ ] Test de registro/login exitoso
- [ ] Test de creación de receta exitoso
- [ ] Test de upload de imagen exitoso

---

**Última actualización:** 17 Nov 2025  
**Versión:** v0.4.1
