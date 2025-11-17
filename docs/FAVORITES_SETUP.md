# ❤️ Configuración del Sistema de Favoritos

## 📋 Paso 1: Crear Tabla `favorites` en Supabase

Ve a **SQL Editor** en Supabase y ejecuta:

```sql
-- ============================================
-- TABLA FAVORITES
-- ============================================

-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para evitar duplicados
  UNIQUE(user_id, recipe_id)
);

-- Índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON public.favorites(recipe_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(created_at DESC);

-- Comentarios
COMMENT ON TABLE public.favorites IS 'Recetas favoritas de los usuarios';
COMMENT ON COLUMN public.favorites.user_id IS 'Usuario que agregó el favorito';
COMMENT ON COLUMN public.favorites.recipe_id IS 'Receta marcada como favorita';

-- ============================================
-- RLS POLICIES PARA FAVORITES
-- ============================================

-- Habilitar RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Drop políticas existentes
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
-- VERIFICAR CONFIGURACIÓN
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
```

## ✅ Resultado Esperado

Deberías ver:
- ✅ Tabla `favorites` creada
- ✅ 3 políticas RLS activas
- ✅ 3 índices para performance
- ✅ Constraint UNIQUE para evitar duplicados

---

## 🧪 Testing

### Test 1: Agregar Favorito
```typescript
const { data, error } = await supabase
  .from('favorites')
  .insert({
    user_id: userId,
    recipe_id: recipeId
  });
```

### Test 2: Verificar en Supabase
1. Ve a **Table Editor** → `favorites`
2. Verifica que se creó el registro
3. Intenta agregar el mismo favorito dos veces (debería fallar por UNIQUE)

### Test 3: Eliminar Favorito
```typescript
const { error } = await supabase
  .from('favorites')
  .delete()
  .eq('user_id', userId)
  .eq('recipe_id', recipeId);
```

---

## 📊 Estructura Final

```
favorites
├── id (UUID, PK)
├── user_id (UUID, FK → auth.users)
├── recipe_id (UUID, FK → recipes)
└── created_at (TIMESTAMP)

Indexes:
- idx_favorites_user_id
- idx_favorites_recipe_id
- idx_favorites_created_at

Constraints:
- UNIQUE(user_id, recipe_id)
```

---

**¡Configuración lista!** ❤️
