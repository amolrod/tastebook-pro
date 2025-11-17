# 🔐 Configuración de Autenticación - Sprint 2

## Instrucciones para Supabase Dashboard

### 1. Habilitar RLS en tabla users (si no está habilitado)

```sql
-- Habilitar RLS en la tabla users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden leer su propio perfil
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Política: Permitir inserts durante el registro (CRÍTICO)
-- Esta política permite que un usuario recién registrado pueda crear su perfil
DROP POLICY IF EXISTS "Users can insert own profile on signup" ON users;
CREATE POLICY "Users can insert own profile on signup"
  ON users FOR INSERT
  WITH CHECK (true); -- Permite cualquier insert (el auth.uid() aún no está disponible durante signup)

-- Alternativa más segura (si tienes service_role key):
-- CREATE POLICY "Users can insert own profile on signup"
--   ON users FOR INSERT
--   WITH CHECK (auth.uid() = id);
-- Pero requiere usar service_role key en el signup, no anon key
```

### 2. Actualizar políticas de recetas para autenticación

```sql
-- Eliminar políticas temporales de desarrollo
DROP POLICY IF EXISTS "Allow anonymous recipe creation" ON recipes;

-- Política: Cualquiera puede leer recetas públicas
DROP POLICY IF EXISTS "Allow public read access" ON recipes;
CREATE POLICY "Allow public read access"
  ON recipes FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- Política: Solo usuarios autenticados pueden crear recetas
DROP POLICY IF EXISTS "Users can create own recipes" ON recipes;
CREATE POLICY "Users can create own recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Solo el dueño puede actualizar su receta
DROP POLICY IF EXISTS "Users can update own recipes" ON recipes;
CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Solo el dueño puede eliminar su receta
DROP POLICY IF EXISTS "Users can delete own recipes" ON recipes;
CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. (OPCIONAL) Hacer user_id obligatorio después de migrar datos

⚠️ **SOLO ejecutar después de que todas las recetas existentes tengan un user_id válido**

```sql
-- Asignar recetas huérfanas (NULL user_id) a un usuario admin/test
-- Primero obtén un user_id válido:
-- SELECT id FROM users LIMIT 1;

-- Luego actualiza las recetas sin dueño:
-- UPDATE recipes 
-- SET user_id = 'REEMPLAZAR-CON-USER-ID-REAL'
-- WHERE user_id IS NULL;

-- Finalmente, hacer user_id obligatorio:
-- ALTER TABLE recipes 
-- ALTER COLUMN user_id SET NOT NULL;
```

### 4. Configurar Email Templates (Opcional pero recomendado)

1. Ve a **Authentication** → **Email Templates**
2. Personaliza los templates:
   - **Confirm signup**: Email de confirmación
   - **Magic Link**: Login sin contraseña
   - **Change Email Address**: Confirmar cambio de email
   - **Reset Password**: Recuperar contraseña

### 5. Configurar Providers (Opcional)

Si quieres login con Google/GitHub:

1. Ve a **Authentication** → **Providers**
2. Habilita los providers que desees
3. Configura OAuth credentials
4. Actualiza `AuthContext.tsx` para agregar `signInWithOAuth()`

---

## Estado Actual

### ✅ Completado

- AuthContext con signIn, signUp, signOut
- AuthProvider integrado en root.tsx
- Páginas Login y Register funcionales
- Header con info de usuario y logout
- ProtectedRoute component
- RecipeDetail component completo
- user_id opcional (NULL permitido para desarrollo)

### 🚧 Pendiente (Usuario debe ejecutar)

- [ ] Ejecutar SQL del punto 1 (RLS en users)
- [ ] Ejecutar SQL del punto 2 (Políticas de recetas con auth)
- [ ] Probar registro de nuevo usuario
- [ ] Probar login/logout
- [ ] Verificar que solo el dueño puede editar/eliminar recetas

### 🔮 Futuro (Sprint 3+)

- [ ] Ejecutar SQL del punto 3 (hacer user_id obligatorio)
- [ ] Configurar Email Templates
- [ ] Agregar OAuth providers
- [ ] Implementar "Forgot Password"
- [ ] Avatar de usuario con upload

---

## Testing

### Flujo de Prueba Completo

1. **Sin sesión:**
   - Visitar `/recipes` → Ver solo recetas públicas
   - Click en receta → Ver detalle
   - Intentar crear receta → Redirect a `/login`

2. **Registro:**
   - Ir a `/register`
   - Completar formulario
   - Verificar email si está habilitado
   - Auto-login después de registro

3. **Login:**
   - Ir a `/login`
   - Iniciar sesión con credenciales
   - Redirect a `/recipes`
   - Ver avatar/email en Header

4. **Crear receta:**
   - Click en "Nueva Receta"
   - Llenar formulario
   - Guardar → Ahora tiene `user_id` automático

5. **Logout:**
   - Click en avatar → "Cerrar Sesión"
   - Redirect a `/login`
   - Ya no ver recetas privadas

---

## Troubleshooting

### Error: "new row violates row-level security policy"

**Causa:** Las políticas RLS están activas pero no permiten la operación.

**Solución:** Ejecutar el SQL del punto 2.

### Error: "insert or update violates foreign key constraint"

**Causa:** El `user_id` no existe en la tabla `users`.

**Solución:** 
1. Verificar que el usuario esté autenticado
2. Verificar que el registro en `users` se creó correctamente
3. Revisar `AuthContext.signUp()` para asegurar que crea el perfil

### Recetas sin dueño (user_id NULL)

**Causa:** Recetas creadas en Sprint 1 antes de implementar auth.

**Solución:**
```sql
-- Ver recetas huérfanas
SELECT id, title, created_at 
FROM recipes 
WHERE user_id IS NULL;

-- Asignarlas a tu usuario
UPDATE recipes 
SET user_id = 'tu-user-id-aqui'
WHERE user_id IS NULL;
```

---

## Próximos Pasos (Sprint 3)

1. **Perfil de Usuario**
   - Página `/profile`
   - Editar full_name, avatar, bio
   - Cambiar contraseña

2. **Colecciones**
   - Crear colecciones de recetas
   - Agregar recetas a colecciones
   - Compartir colecciones

3. **Social Features**
   - Seguir otros usuarios
   - Feed de recetas de seguidos
   - Comentarios en recetas

4. **Meal Planning**
   - Crear planes de comidas
   - Arrastrar recetas al calendario
   - Generar lista de compras automática
