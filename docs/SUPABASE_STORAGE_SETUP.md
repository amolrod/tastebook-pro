# 🗄️ Configuración de Supabase Storage para Avatares

Este documento explica cómo configurar Supabase Storage para permitir la subida de avatares de usuario.

---

## 📋 Opción Actual: Usar Bucket 'public' (Más Simple)

Por defecto, Supabase crea un bucket llamado `public` que está disponible para todos los proyectos. El hook `useUploadAvatar` está configurado para usar este bucket.

### Ventajas:
- ✅ No requiere crear bucket nuevo
- ✅ Ya está público por defecto
- ✅ Funciona inmediatamente

### Configuración de Políticas RLS

Solo necesitas agregar políticas para permitir subida y eliminación. Ve a **Storage** → **Policies** → bucket `public` y agrega:

---

## 📋 Opción Alternativa: Crear Bucket Dedicado `avatars`

Si prefieres tener un bucket dedicado para avatares:

### 1. Acceder a Supabase Storage

1. Ve a tu proyecto en https://supabase.com/dashboard
2. En el menú lateral, selecciona **Storage**
3. Haz clic en **New Bucket** (Nuevo Bucket)

### 2. Configurar el Bucket `avatars`

Completa el formulario con estos valores:

```
Name: avatars
Public bucket: ✅ (marcado)
File size limit: 2MB
Allowed MIME types: image/*
```

**Importante:** Marca la opción **Public bucket** para que las imágenes sean accesibles públicamente.

**Nota:** Si creas este bucket, deberás cambiar el hook `useUploadAvatar.ts` para usar `'avatars'` en lugar de `'public'`.

### 3. Configurar Políticas de Seguridad (RLS)

Ve a **Storage** → **Policies** → bucket correspondiente y agrega estas políticas:

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
