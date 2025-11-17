# 🗄️ Actualización de Schema - Sprint 3

## Agregar campo `bio` a la tabla `users`

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- Agregar campo bio a la tabla users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Agregar comentario descriptivo
COMMENT ON COLUMN public.users.bio IS 'Biografía del usuario (opcional, máx 500 caracteres)';

-- Verificar estructura actualizada
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;
```

## Estructura actualizada de `users`

```typescript
interface User {
  id: string;              // UUID (Primary Key)
  email: string;           // Email del usuario
  full_name: string;       // Nombre completo
  bio?: string;            // Biografía (NUEVO)
  avatar_url?: string;     // URL del avatar (futuro)
  created_at: string;      // Timestamp de creación
  updated_at: string;      // Timestamp de última actualización
}
```

## Próximos pasos

1. ✅ Ejecutar SQL para agregar `bio`
2. ⏳ Actualizar tipos TypeScript en `database.ts`
3. ⏳ Agregar campo `avatar_url` cuando implementemos upload
