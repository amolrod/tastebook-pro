# 🚀 Guía Rápida de Configuración de Supabase

## 📋 Pasos para Configurar Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta (o inicia sesión)
2. Haz clic en **"New Project"**
3. Completa los datos:
   - **Name:** `tastebook-pro` (o el nombre que prefieras)
   - **Database Password:** Elige una contraseña segura (¡guárdala!)
   - **Region:** Elige la más cercana a ti (ej: `South America (São Paulo)`)
   - **Pricing Plan:** Free (suficiente para desarrollo)
4. Haz clic en **"Create new project"**
5. Espera 2-3 minutos mientras se crea el proyecto

### 2. Obtener Credenciales

1. En el dashboard de tu proyecto, ve a **Settings** (⚙️) → **API**
2. Verás dos valores importantes:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** Una clave larga que empieza con `eyJhbG...`

### 3. Configurar Variables de Entorno

1. Copia el archivo `.env.local` en tu proyecto:
   ```bash
   # Ya está creado en: apps/web/.env.local
   ```

2. Edita `.env.local` y reemplaza los valores:
   ```bash
   VITE_SUPABASE_URL=https://tu-proyecto-real.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anon-real-aqui
   ```

3. **¡Importante!** Nunca subas este archivo a Git (ya está en `.gitignore`)

### 4. Crear Base de Datos

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Crea un **New query**
3. Copia y pega el SQL del archivo `/docs/DATABASE.md`
4. Haz clic en **Run** para ejecutar el script
5. Verifica que se crearon las tablas en **Table Editor**

### 5. Crear Storage Bucket

1. Ve a **Storage** en el menú lateral
2. Haz clic en **Create a new bucket**
3. Configura el bucket:
   - **Name:** `recipe-images`
   - **Public:** ✅ Activado (para que las imágenes sean accesibles)
   - **File size limit:** 5 MB
   - **Allowed MIME types:** `image/*`
4. Haz clic en **Create bucket**

### 6. Configurar Políticas de Seguridad (RLS)

Las políticas ya están en el SQL del paso 4, pero verifica:

1. Ve a **Authentication** → **Policies**
2. Deberías ver políticas para:
   - `recipes`: SELECT (público), INSERT/UPDATE/DELETE (autenticado)
   - `meal_plans`: CRUD solo para owner
   - `shopping_lists`: CRUD solo para owner

### 7. Probar la Conexión

1. Reinicia tu servidor de desarrollo:
   ```bash
   cd apps/web
   pnpm dev
   ```

2. Abre [http://localhost:4000/recipes](http://localhost:4000/recipes)

3. Deberías ver:
   - ✅ Sin errores de conexión
   - ✅ Mensaje "No hay recetas" (porque la DB está vacía)
   - ✅ Botón "Crear Primera Receta"

### 8. Crear Primera Receta (Opcional)

Para probar que todo funciona, puedes crear una receta manualmente en Supabase:

1. Ve a **Table Editor** → `recipes`
2. Haz clic en **Insert row**
3. Completa los campos:
   ```json
   {
     "title": "Pasta Carbonara",
     "description": "Receta italiana clásica",
     "prep_time": 10,
     "cook_time": 15,
     "servings": 4,
     "difficulty": "facil",
     "ingredients": [
       {"name": "Pasta", "amount": "400g"},
       {"name": "Huevos", "amount": "4"},
       {"name": "Bacon", "amount": "200g"}
     ],
     "instructions": [
       "Cocinar la pasta",
       "Freír el bacon",
       "Mezclar con huevos"
     ],
     "tags": ["italiana", "pasta"],
     "is_public": true
   }
   ```
4. **Insert row**
5. Recarga tu app → Deberías ver la receta! 🎉

## 🆘 Troubleshooting

### Error: "Faltan variables de entorno"
- ✅ Verifica que `.env.local` existe en `apps/web/`
- ✅ Verifica que las variables tienen el prefijo `VITE_`
- ✅ Reinicia el servidor (`Ctrl+C` y `pnpm dev`)

### Error: "Invalid API key"
- ✅ Verifica que copiaste la **anon key** correcta (no la service_role)
- ✅ Verifica que no haya espacios al inicio/final de la key

### Error: "relation does not exist"
- ✅ Ejecuta el SQL del archivo `/docs/DATABASE.md`
- ✅ Verifica en **Table Editor** que las tablas existen

### No aparecen recetas
- ✅ Verifica que hayas creado al menos una receta en Supabase
- ✅ Verifica que `is_public = true` o estés autenticado
- ✅ Abre la consola del navegador para ver errores

## 📚 Recursos

- [Documentación Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [SQL Editor](https://supabase.com/docs/guides/database/overview)

## ✅ Checklist Final

- [ ] Proyecto creado en Supabase
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] SQL ejecutado (tablas creadas)
- [ ] Storage bucket `recipe-images` creado
- [ ] RLS policies configuradas
- [ ] Servidor reiniciado
- [ ] App abre sin errores
- [ ] Primera receta creada (opcional)

---

¡Una vez completados estos pasos, tu app estará conectada a Supabase y lista para funcionar! 🚀
