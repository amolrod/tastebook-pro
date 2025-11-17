-- ============================================
-- SPRINT 4: SISTEMA DE FAVORITOS
-- ============================================
-- Ejecutar en SQL Editor de Supabase

-- ============================================
-- PASO 1: CREAR TABLA FAVORITES
-- ============================================

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para evitar duplicados
  UNIQUE(user_id, recipe_id)
);

-- Comentarios
COMMENT ON TABLE public.favorites IS 'Recetas favoritas de los usuarios';
COMMENT ON COLUMN public.favorites.user_id IS 'Usuario que agregó el favorito';
COMMENT ON COLUMN public.favorites.recipe_id IS 'Receta marcada como favorita';

-- ============================================
-- PASO 2: CREAR ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON public.favorites(recipe_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(created_at DESC);

-- ============================================
-- PASO 3: HABILITAR RLS
-- ============================================

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 4: CREAR POLÍTICAS RLS
-- ============================================

-- Drop políticas si existen
DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

-- Política 1: SELECT - Ver solo propios favoritos
CREATE POLICY "Users can view own favorites"
ON public.favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política 2: INSERT - Agregar solo propios favoritos
CREATE POLICY "Users can insert own favorites"
ON public.favorites
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política 3: DELETE - Eliminar solo propios favoritos
CREATE POLICY "Users can delete own favorites"
ON public.favorites
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- PASO 5: VERIFICAR CONFIGURACIÓN
-- ============================================

-- Ver estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'favorites'
ORDER BY ordinal_position;

-- Ver políticas RLS
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'favorites';

-- ============================================
-- ✅ CONFIGURACIÓN COMPLETADA
-- ============================================
-- La tabla favorites está lista para usar.
-- Ahora puedes usar el sistema de favoritos en la app.
