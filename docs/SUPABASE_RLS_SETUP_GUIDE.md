# 🔐 Guía de Configuración RLS en Supabase

**Propósito:** Configurar Row Level Security (RLS) para la tabla `users` y permitir que los usuarios solo accedan a sus propios datos.

---

## ⚠️ Importante

Debes ejecutar estos SQL en el **SQL Editor** de tu dashboard de Supabase para que el sistema de autenticación funcione correctamente con políticas de seguridad.

---

## 📋 Pasos a Seguir

### 1. Abrir SQL Editor en Supabase

1. Ve a tu proyecto en https://supabase.com/dashboard
2. Selecciona tu proyecto **Tastebook Pro**
3. En el menú lateral, busca **SQL Editor**
4. Haz clic en **New Query**

### 2. Ejecutar SQL de Políticas RLS

Copia y pega el siguiente código SQL en el editor:

```sql
-- ============================================
-- RLS POLICIES PARA TABLA USERS
-- ============================================

-- 1. Habilitar RLS en la tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. DROP políticas existentes (si las hay)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- 3. Crear política de SELECT (leer)
-- Permite que los usuarios lean su propio perfil
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 4. Crear política de INSERT (crear)
-- IMPORTANTE: Permite la creación inicial del perfil durante el registro
-- La validación auth.uid() = id se hace DESPUÉS de la inserción
CREATE POLICY "Users can insert own profile"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (true);  -- Permite inserción, luego valida con triggers

-- 5. Crear política de UPDATE (actualizar)
-- Permite que los usuarios actualicen solo su propio perfil
CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- VERIFICAR POLÍTICAS CREADAS
-- ============================================

-- Ejecuta esto para ver tus políticas:
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users';
```

### 3. Ejecutar el SQL

1. Haz clic en el botón **Run** (▶️) en la esquina superior derecha
2. Deberías ver mensajes de éxito:
   ```
   Success. No rows returned
   ```
3. Si hay errores, verifica que la tabla `users` exista y tenga el campo `id` como UUID

### 4. Verificar Políticas

Ejecuta la consulta de verificación (última parte del SQL) para ver las políticas creadas:

```sql
SELECT 
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'users';
```

Deberías ver 3 políticas:
- `Users can view own profile` (SELECT)
- `Users can insert own profile` (INSERT)
- `Users can update own profile` (UPDATE)

---

## 🧪 Testing de Políticas

### Test 1: Registro de Usuario

1. Ve a http://localhost:4000/register
2. Registra un nuevo usuario con:
   - **Nombre completo:** Test Usuario
   - **Email:** test@example.com
   - **Password:** test123
3. Verifica que te redirija automáticamente después del registro

### Test 2: Verificar en Supabase

1. Ve a **Table Editor** → `users` en Supabase
2. Deberías ver el nuevo usuario con:
   - `id` = UUID del usuario de Auth
   - `email` = test@example.com
   - `full_name` = Test Usuario
   - `created_at` = timestamp actual

### Test 3: Login

1. Cierra sesión en la app
2. Ve a http://localhost:4000/login
3. Inicia sesión con `test@example.com` / `test123`
4. Verifica que te redirija a `/recipes`
5. Verifica que el header muestre tu nombre y avatar

### Test 4: Session Persistence

1. Recarga la página (F5)
2. Verifica que sigues autenticado
3. La sesión debe persistir incluso después de recargar

---

## ❌ Troubleshooting

### Error: "new row violates row-level security policy"

**Causa:** La política INSERT es muy restrictiva.

**Solución:** Verifica que usaste `WITH CHECK (true)` en la política INSERT, no `WITH CHECK (auth.uid() = id)`.

### Error: "null value in column 'id' violates not-null constraint"

**Causa:** El `id` no se está generando correctamente.

**Solución:** Verifica que tu tabla `users` tenga:
```sql
ALTER TABLE public.users 
ALTER COLUMN id SET DEFAULT gen_random_uuid();
```

### No se crea el perfil después de registro

**Causa:** El código no está insertando en la tabla `users`.

**Solución:** Verifica que `AuthContext.tsx` tenga el código de inserción:
```typescript
const { data: userData, error: userError } = await supabase
  .from('users')
  .insert([{
    id: authData.user.id,
    email: authData.user.email,
    full_name: fullName
  }]);
```

### Usuario no puede ver su propio perfil

**Causa:** La política SELECT está bloqueando la consulta.

**Solución:** Verifica que estés usando `TO authenticated` en la política, no `TO public`.

---

## 📚 Recursos Adicionales

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html)
- Ver también: `/docs/AUTH_SETUP.md` para más detalles

---

## ✅ Checklist Final

Antes de continuar con Sprint 3, verifica:

- [ ] Políticas RLS ejecutadas en Supabase
- [ ] Tabla `users` tiene 3 políticas activas
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Sesión persiste después de recargar
- [ ] Header muestra datos del usuario
- [ ] Logout funciona correctamente

---

## 🎯 Próximos Pasos

Una vez completada esta configuración:

1. **Hacer commit de STATUS.md actualizado**
2. **Merge de `sprint-2-auth` a `main`**
3. **Tag release:** `v0.2.0 - Authentication Complete`
4. **Iniciar Sprint 3:** Perfil de Usuario

---

**¡Listo para producción!** 🚀
