# 🖼️ Configuración de Supabase Storage para Avatares

## Objetivo

Configurar un bucket público en Supabase Storage para almacenar los avatares de los usuarios de Tastebook Pro.

---

## 📋 Pasos de Configuración

### 1. Crear Bucket de Storage

1. Ve a tu proyecto en https://supabase.com/dashboard
2. Selecciona tu proyecto **Tastebook Pro**
3. En el menú lateral, ve a **Storage**
4. Haz clic en **New bucket**
5. Configura el bucket:
   - **Name:** `avatars`
   - **Public bucket:** ✅ Activado (para que las URLs sean públicas)
   - **File size limit:** 2 MB
   - **Allowed MIME types:** `image/*`
6. Haz clic en **Create bucket**

### 2. Configurar Políticas de Acceso (RLS)

El bucket debe permitir:
- ✅ **SELECT (read):** Cualquiera puede ver los avatares
- ✅ **INSERT (upload):** Solo usuarios autenticados pueden subir
- ✅ **DELETE:** Solo usuarios autenticados pueden eliminar sus propios avatares

#### Ejecutar SQL para Políticas

Ve a **SQL Editor** y ejecuta:

```sql
-- ============================================
-- POLÍTICAS RLS PARA BUCKET AVATARS
-- ============================================

-- 1. Permitir lectura pública de avatares
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- 2. Permitir upload solo a usuarios autenticados
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Permitir que usuarios eliminen su propio avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Permitir que usuarios actualicen su propio avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Verificar Configuración

#### 3.1 Verificar Bucket

En **Storage**, deberías ver el bucket `avatars` con:
- ✅ Icono de candado abierto (público)
- ✅ 0 files (vacío al inicio)

#### 3.2 Verificar Políticas

Ejecuta en SQL Editor:

```sql
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects';
```

Deberías ver 4 políticas para el bucket `avatars`.

---

## 🧪 Testing

### Test 1: Subir Avatar desde la App

1. Inicia sesión en http://localhost:4000/login
2. Ve a http://localhost:4000/profile
3. Haz clic en el botón de cámara del avatar
4. Selecciona una imagen (< 2MB)
5. Verifica que:
   - ✅ Se muestre loading spinner
   - ✅ Aparezca toast de éxito
   - ✅ El avatar se actualice inmediatamente
   - ✅ La URL pública funcione

### Test 2: Verificar en Supabase

1. Ve a **Storage** → **avatars**
2. Deberías ver el archivo subido con nombre: `{userId}-{timestamp}.{ext}`
3. Haz clic en el archivo y verifica la URL pública

### Test 3: Verificar en Tabla Users

1. Ve a **Table Editor** → **users**
2. Busca tu usuario
3. Verifica que `avatar_url` tenga la URL pública del storage

---

## 🔧 Troubleshooting

### Error: "new row violates row-level security policy"

**Causa:** Las políticas RLS están mal configuradas.

**Solución:** 
1. Verifica que el bucket sea público
2. Re-ejecuta las políticas SQL de arriba
3. Asegúrate de que el usuario esté autenticado

### Error: "Bucket not found"

**Causa:** El bucket no existe o tiene otro nombre.

**Solución:**
1. Ve a Storage y verifica que el bucket se llame exactamente `avatars`
2. Si tiene otro nombre, actualiza el código en `useUploadAvatar.ts`:
   ```typescript
   .from('tu-bucket-name')
   ```

### Error: "File too large"

**Causa:** El archivo supera los 2MB.

**Solución:**
- El hook ya valida esto en el frontend
- Si persiste, verifica el límite del bucket en Supabase
- Puedes aumentarlo en: Storage → avatars → Settings → File size limit

### La imagen no se muestra

**Causa 1:** URL pública incorrecta.

**Solución:**
```typescript
// Verifica que estés usando getPublicUrl correctamente
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(filePath);
```

**Causa 2:** Permisos CORS.

**Solución:**
- Supabase maneja CORS automáticamente para buckets públicos
- Si tienes problemas, verifica en Storage → Settings → CORS

---

## 📊 Estructura de Archivos

Los avatares se almacenan con este patrón:

```
avatars/
├── {userId-1}-{timestamp}.jpg
├── {userId-2}-{timestamp}.png
└── {userId-3}-{timestamp}.webp
```

**Ejemplo:**
```
avatars/550e8400-e29b-41d4-a716-446655440000-1700000000000.jpg
```

---

## 🎯 Próximos Pasos

Una vez completada la configuración:

1. ✅ Testing completo del upload
2. ⏳ Implementar resize automático de imágenes (opcional)
3. ⏳ Agregar progress bar durante upload (opcional)
4. ⏳ Implementar crop de imagen antes de upload (opcional)

---

## 🔗 Referencias

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Image Upload Best Practices](https://supabase.com/docs/guides/storage/uploads)

---

**¡Configuración lista para producción!** 🚀
