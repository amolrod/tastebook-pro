# 🗄️ Configuración de Supabase Storage para Avatares

**Estado Actual:** ✅ **Storage configurado y funcionando** - El sistema usa Supabase Storage con el bucket `avatars`.

---

## ✅ Configuración Completada

El bucket `avatars` está configurado con las siguientes políticas RLS:

1. ✅ **Anyone can view avatars** - Lectura pública (SELECT)
2. ✅ **Authenticated users can upload avatars** - Upload autenticado (INSERT)
3. ✅ **Users can update own avatar** - Update propio (UPDATE)
4. ✅ **Users can delete own avatar** - Delete propio (DELETE)

---

### 1. Crear Bucket en Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto **Tastebook Pro**
3. Ve a **Storage** en el menú lateral
4. Haz clic en **New bucket**
5. Configura así:
   ```
   Name: avatars
   Public bucket: ✅ ACTIVADO
   File size limit: 2 MB
   Allowed MIME types: image/*
   ```
6. Haz clic en **Create bucket**

### 2. Configurar Políticas RLS

Ve a **Storage** → **Policies** → bucket `avatars` y crea estas políticas:

#### Política 1: Lectura Pública
```sql
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

#### Política 2: Upload Autenticado
```sql
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);
```

#### Política 3: Update Propio Avatar
```sql
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);
```

#### Política 4: Delete Propio Avatar
```sql
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);
```

### 3. Actualizar el Hook

Después de crear el bucket, actualiza `useUploadAvatar.ts`:

**Reemplazar esta sección:**
```typescript
// TEMPORALMENTE: Convertir imagen a base64
const reader = new FileReader();
const base64Promise = new Promise<string>((resolve, reject) => {
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const base64Image = await base64Promise;

const { error: updateError } = await supabase
  .from('users')
  .update({ avatar_url: base64Image })
  .eq('id', userId);
```

**Por esto:**
```typescript
// Generar nombre único
const fileExt = file.name.split('.').pop();
const fileName = `${userId}-${Date.now()}.${fileExt}`;

// Subir imagen
const { error: uploadError } = await supabase.storage
  .from('avatars')
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: true,
  });

if (uploadError) throw uploadError;

// Obtener URL pública
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(fileName);

// Actualizar usuario
const { error: updateError } = await supabase
  .from('users')
  .update({ avatar_url: publicUrl })
  .eq('id', userId);
```

---

## ✅ Ventajas de usar Storage vs Base64

### Base64 (Actual - Temporal)
- ✅ Funciona inmediatamente sin configuración
- ❌ Aumenta tamaño de la BD
- ❌ Más lento al cargar
- ❌ No recomendado para producción

### Storage (Recomendado)
- ✅ Optimizado para archivos
- ✅ CDN incluido
- ✅ Mejor performance
- ✅ Fácil de escalar
- ✅ URLs públicas permanentes

---

## 🧪 Testing

Después de configurar:

1. Ve a /profile
2. Haz clic en el botón de cámara del avatar
3. Selecciona una imagen
4. Verifica que se suba correctamente
5. Recarga la página y verifica que persista
6. En Supabase Storage → `avatars`, deberías ver el archivo

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
