-- =====================================================
-- CONFIGURACIÓN DE STORAGE PARA IMÁGENES DE RECETAS
-- =====================================================
-- 
-- Este script configura el almacenamiento de imágenes en Supabase Storage
-- para las recetas de TasteBook Pro.
--
-- INSTRUCCIONES:
-- 1. Ve a Supabase Dashboard → Storage
-- 2. Crea un nuevo bucket llamado 'recipe-images' (si no existe)
-- 3. Configura el bucket como PUBLIC
-- 4. Ejecuta este SQL en SQL Editor para configurar las políticas RLS
--
-- =====================================================

-- Política: Usuarios autenticados pueden subir imágenes
-- Solo pueden subir a su propia carpeta (user_id)
CREATE POLICY "Users can upload recipe images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'recipe-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Usuarios pueden actualizar sus propias imágenes
CREATE POLICY "Users can update own recipe images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'recipe-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Usuarios pueden eliminar sus propias imágenes
CREATE POLICY "Users can delete own recipe images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'recipe-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: Cualquiera puede ver imágenes públicas
CREATE POLICY "Anyone can view recipe images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'recipe-images');

-- =====================================================
-- NOTAS:
-- =====================================================
-- 
-- 1. El bucket 'recipe-images' debe ser PUBLIC para que las imágenes
--    sean accesibles sin autenticación
--
-- 2. Las imágenes se guardan en la estructura:
--    recipe-images/
--      └── {user_id}/
--          └── {timestamp}-{random}.{ext}
--
-- 3. Tamaño máximo: 5MB por imagen
-- 4. Formatos permitidos: JPEG, PNG, WEBP
--
-- 5. Si necesitas eliminar todas las políticas para reconfigurar:
--    DROP POLICY IF EXISTS "Users can upload recipe images" ON storage.objects;
--    DROP POLICY IF EXISTS "Users can update own recipe images" ON storage.objects;
--    DROP POLICY IF EXISTS "Users can delete own recipe images" ON storage.objects;
--    DROP POLICY IF EXISTS "Anyone can view recipe images" ON storage.objects;
--
-- =====================================================
