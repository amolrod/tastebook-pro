# Configuración de Storage para Imágenes de Recetas

Este documento explica cómo configurar el almacenamiento de imágenes en Supabase para TasteBook Pro.

## Pasos para Configurar

### 1. Crear el Bucket en Supabase Dashboard

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. En el menú lateral, selecciona **Storage**
3. Haz click en **"New bucket"** o **"Create a new bucket"**
4. Configura el bucket:
   - **Name**: `recipe-images`
   - **Public**: ✅ **Marcar como PUBLIC**
   - **File size limit**: 5MB (o el valor que prefieras)
   - **Allowed MIME types**: Dejar vacío o agregar: `image/jpeg`, `image/png`, `image/webp`
5. Haz click en **"Create bucket"**

### 2. Configurar Políticas de Seguridad (RLS)

1. Ve a **SQL Editor** en el menú lateral de Supabase
2. Crea una nueva query
3. Copia y pega el contenido del archivo `storage_setup.sql`
4. Ejecuta el script (botón **Run** o `Cmd/Ctrl + Enter`)

### 3. Verificar la Configuración

#### Opción A: Desde la UI de Supabase

1. Ve a **Storage** → **recipe-images**
2. Intenta subir una imagen de prueba manualmente
3. Si aparece en el bucket, la configuración es correcta

#### Opción B: Desde la Aplicación

1. Inicia el servidor de desarrollo:
   ```bash
   cd apps/web
   pnpm dev
   ```

2. Ve a `/recipes/new`
3. Intenta crear una receta con una imagen
4. Si la imagen se sube correctamente, verás:
   - Preview de la imagen en el formulario
   - Toast: "Subiendo imagen..."
   - Toast: "Receta creada exitosamente"
   - La receta aparece con su imagen en `/recipes`

## Estructura de Archivos

Las imágenes se organizan por usuario:

```
recipe-images/
  └── {user_id}/
      ├── 1234567890-abc123.jpg
      ├── 1234567891-def456.png
      └── 1234567892-ghi789.webp
```

## Políticas de Seguridad Configuradas

| Política | Operación | Quién | Condición |
|----------|-----------|-------|-----------|
| Upload | INSERT | Usuarios autenticados | Solo en su carpeta (user_id) |
| Update | UPDATE | Usuarios autenticados | Solo sus propias imágenes |
| Delete | DELETE | Usuarios autenticados | Solo sus propias imágenes |
| View | SELECT | Todos (público) | Todas las imágenes del bucket |

## Restricciones

- **Tamaño máximo**: 5MB por imagen
- **Formatos permitidos**: JPEG, PNG, WEBP
- **Organización**: Las imágenes se guardan en carpetas por user_id
- **Acceso**: Solo el dueño puede subir/modificar/eliminar, todos pueden ver

## Solución de Problemas

### Error: "Bucket not found"

- Verifica que el bucket `recipe-images` existe en Storage
- Asegúrate de que el nombre es exactamente `recipe-images` (sin espacios ni mayúsculas)

### Error: "Policy violation" o "Row level security"

- Ejecuta el script `storage_setup.sql` en SQL Editor
- Verifica que las 4 políticas se crearon correctamente:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'objects';
  ```

### Error: "File type not allowed"

- Asegúrate de que estás subiendo solo JPEG, PNG o WEBP
- Verifica que el archivo no esté corrupto

### Error: "File too large"

- El tamaño máximo es 5MB
- Comprime la imagen antes de subirla
- Usa herramientas como [TinyPNG](https://tinypng.com/) o [Squoosh](https://squoosh.app/)

### Las imágenes no se muestran

- Verifica que el bucket está marcado como **PUBLIC**
- Revisa la consola del navegador (F12) para ver errores
- Comprueba que la URL de la imagen es correcta:
  ```
  https://{project-ref}.supabase.co/storage/v1/object/public/recipe-images/{user-id}/{filename}
  ```

## Comandos Útiles

### Ver todas las políticas del bucket

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';
```

### Eliminar todas las políticas (para reconfigurar)

```sql
DROP POLICY IF EXISTS "Users can upload recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own recipe images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view recipe images" ON storage.objects;
```

### Ver archivos en el bucket

```sql
SELECT * FROM storage.objects 
WHERE bucket_id = 'recipe-images' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Eliminar un archivo específico

```sql
DELETE FROM storage.objects 
WHERE bucket_id = 'recipe-images' 
AND name = '{user-id}/{filename}';
```

## Próximos Pasos

Una vez configurado el storage:

1. ✅ Crear recetas con imágenes
2. ✅ Ver imágenes en la lista de recetas
3. ✅ Ver imágenes en el detalle de recetas
4. 🔄 Editar recetas y actualizar imágenes
5. 🔄 Optimización de imágenes (resize, compression)
6. 🔄 Soporte para múltiples imágenes por receta

## Referencias

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Image Optimization Guide](https://supabase.com/docs/guides/storage/serving/image-transformations)
