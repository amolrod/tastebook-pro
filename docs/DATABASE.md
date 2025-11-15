# Esquema de Base de Datos - Tastebook Pro

Documentación completa del esquema de base de datos PostgreSQL en Supabase, incluyendo tablas, relaciones, índices y políticas RLS.

## Diagrama ER (Entidad-Relación)

```
┌─────────────┐
│    users    │
└──────┬──────┘
       │
       │ (1:N)
       │
       ├──────────────────────────────────────┐
       │                                      │
       │                                      │
┌──────▼──────┐     ┌─────────────┐   ┌─────▼──────┐
│   recipes   │────>│ ingredients │   │meal_plans  │
└──────┬──────┘     └─────────────┘   └─────┬──────┘
       │                                     │
       │ (1:N)                               │ (1:N)
       │                                     │
┌──────▼──────┐                     ┌────────▼──────────┐
│  reviews    │                     │ shopping_lists    │
└─────────────┘                     └───────────────────┘

┌─────────────┐     ┌─────────────┐
│ collections │────>│  recipes    │
└─────────────┘     └─────────────┘
      (N:M)

┌──────────────┐
│ achievements │
└──────────────┘
```

## Tablas Principales

### 1. users

Tabla de usuarios con información de perfil.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  stats JSONB DEFAULT '{
    "recipes_created": 0,
    "recipes_cooked": 0,
    "achievements_earned": 0
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_users_email ON users(email);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

**Campos:**
- `id`: UUID único generado automáticamente
- `email`: Email único del usuario
- `full_name`: Nombre completo opcional
- `avatar_url`: URL del avatar (Supabase Storage)
- `bio`: Biografía del usuario
- `preferences`: JSON con preferencias (theme, notifications, etc.)
- `stats`: JSON con estadísticas (recetas creadas, logros, etc.)
- `created_at`: Fecha de registro
- `updated_at`: Última actualización

---

### 2. recipes

Tabla principal de recetas.

```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  prep_time INTEGER, -- minutos
  cook_time INTEGER, -- minutos
  servings INTEGER DEFAULT 4,
  difficulty TEXT CHECK (difficulty IN ('facil', 'media', 'dificil')),
  image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  nutrition JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_is_public ON recipes(is_public);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);

-- Full text search
CREATE INDEX idx_recipes_title_search ON recipes USING GIN(to_tsvector('spanish', title));

-- RLS Policies
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public recipes"
  ON recipes FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);
```

**Estructura de campos JSONB:**

```typescript
// ingredients: Array de objetos
[
  {
    name: "Tomate",
    quantity: 500,
    unit: "g",
    category: "Verduras"
  },
  {
    name: "Cebolla",
    quantity: 1,
    unit: "unidad",
    category: "Verduras"
  }
]

// steps: Array de strings
[
  "Precalentar horno a 180°C",
  "Cortar las verduras en cubos pequeños",
  "Saltear en aceite durante 5 minutos",
  "Hornear durante 20 minutos"
]

// nutrition: Objeto con info nutricional
{
  calories: 250,
  protein: 12,
  carbs: 30,
  fat: 8,
  fiber: 5
}
```

**Tags comunes:**
- Categorías: `vegetariano`, `vegano`, `sin-gluten`, `sin-lactosa`
- Tipos: `desayuno`, `comida`, `cena`, `postre`, `snack`
- Cocinas: `italiana`, `mexicana`, `asiatica`, `mediterranea`

---

### 3. meal_plans

Planificador semanal de comidas.

```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  meals JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Índices
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_week_start ON meal_plans(week_start_date);

-- RLS Policies
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own meal plans"
  ON meal_plans FOR ALL
  USING (auth.uid() = user_id);
```

**Estructura de meals JSONB:**

```typescript
{
  "2025-11-18": {
    "desayuno": { recipe_id: "uuid", servings: 2 },
    "comida": { recipe_id: "uuid", servings: 4 },
    "cena": { recipe_id: "uuid", servings: 3 },
    "snack": { recipe_id: "uuid", servings: 1 }
  },
  "2025-11-19": {
    // ...
  }
}
```

---

### 4. shopping_lists

Lista de compra generada automáticamente desde meal plans.

```sql
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX idx_shopping_lists_meal_plan_id ON shopping_lists(meal_plan_id);

-- RLS Policies
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own shopping lists"
  ON shopping_lists FOR ALL
  USING (auth.uid() = user_id);

-- Trigger para sincronización realtime
CREATE OR REPLACE FUNCTION notify_shopping_list_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'shopping_list_changed',
    json_build_object('user_id', NEW.user_id, 'id', NEW.id)::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER shopping_list_update_trigger
  AFTER INSERT OR UPDATE ON shopping_lists
  FOR EACH ROW
  EXECUTE FUNCTION notify_shopping_list_change();
```

**Estructura de items JSONB:**

```typescript
[
  {
    id: "uuid",
    name: "Tomates",
    quantity: 1500,
    unit: "g",
    category: "Verduras",
    checked: false,
    from_recipes: ["recipe-uuid-1", "recipe-uuid-2"]
  },
  {
    id: "uuid",
    name: "Leche",
    quantity: 1,
    unit: "L",
    category: "Lácteos",
    checked: true,
    from_recipes: ["recipe-uuid-3"]
  }
]
```

---

### 5. collections

Colecciones personalizadas de recetas (favoritos, para probar, etc.).

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📁',
  color TEXT DEFAULT '#10b981',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE collection_recipes (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, recipe_id)
);

-- Índices
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collection_recipes_collection_id ON collection_recipes(collection_id);
CREATE INDEX idx_collection_recipes_recipe_id ON collection_recipes(recipe_id);

-- RLS Policies
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own collections"
  ON collections FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own collection recipes"
  ON collection_recipes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_recipes.collection_id
      AND collections.user_id = auth.uid()
    )
  );
```

---

### 6. reviews

Sistema de reviews y ratings de recetas.

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(recipe_id, user_id)
);

-- Índices
CREATE INDEX idx_reviews_recipe_id ON reviews(recipe_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- RLS Policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews of public recipes"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = reviews.recipe_id
      AND recipes.is_public = true
    )
  );

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para actualizar average rating en recipes
CREATE OR REPLACE FUNCTION update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE recipes
  SET rating_avg = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM reviews
    WHERE recipe_id = NEW.recipe_id
  ),
  rating_count = (
    SELECT COUNT(*)
    FROM reviews
    WHERE recipe_id = NEW.recipe_id
  )
  WHERE id = NEW.recipe_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_rating();
```

---

### 7. achievements

Sistema de logros y gamificación.

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  points INTEGER DEFAULT 0,
  criteria JSONB NOT NULL
);

CREATE TABLE user_achievements (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Índices
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- RLS Policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can view own unlocked achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);
```

**Logros de ejemplo:**

```sql
INSERT INTO achievements (code, name, description, icon, tier, points, criteria) VALUES
('first_recipe', 'Primera Receta', 'Crea tu primera receta', '👨‍🍳', 'bronze', 10, '{"recipes_created": 1}'::jsonb),
('recipe_master', 'Maestro Cocinero', 'Crea 50 recetas', '🏆', 'gold', 100, '{"recipes_created": 50}'::jsonb),
('social_chef', 'Chef Social', 'Recibe 100 likes en tus recetas', '❤️', 'silver', 50, '{"total_likes": 100}'::jsonb),
('week_planner', 'Planificador', 'Completa un plan semanal', '📅', 'bronze', 20, '{"meal_plans_completed": 1}'::jsonb);
```

---

## Storage Buckets

### recipe-images

```sql
-- Crear bucket en Supabase Dashboard
-- Storage > Create Bucket
-- Name: recipe-images
-- Public: Yes
```

**Políticas de Storage:**

```sql
-- Lectura pública
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

-- Escritura autenticada
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'recipe-images'
    AND auth.role() = 'authenticated'
  );

-- Actualizar/eliminar solo propietario
CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'recipe-images'
    AND auth.uid() = owner
  );
```

---

## Funciones Útiles

### Buscar recetas por ingredientes disponibles

```sql
CREATE OR REPLACE FUNCTION search_recipes_by_ingredients(
  available_ingredients TEXT[]
)
RETURNS TABLE(recipe_id UUID, match_percentage DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    (COUNT(DISTINCT ing.name) * 100.0 / jsonb_array_length(r.ingredients))::DECIMAL(5,2) as match_pct
  FROM recipes r
  CROSS JOIN LATERAL jsonb_array_elements(r.ingredients) ing
  WHERE ing->>'name' = ANY(available_ingredients)
    AND r.is_public = true
  GROUP BY r.id
  HAVING COUNT(DISTINCT ing.name) >= (jsonb_array_length(r.ingredients) * 0.7)
  ORDER BY match_pct DESC;
END;
$$ LANGUAGE plpgsql;
```

### Generar lista de compra desde meal plan

```sql
CREATE OR REPLACE FUNCTION generate_shopping_list(
  p_meal_plan_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_shopping_list_id UUID;
  v_items JSONB;
BEGIN
  -- Obtener user_id
  SELECT user_id INTO v_user_id
  FROM meal_plans WHERE id = p_meal_plan_id;
  
  -- Agregar ingredientes de todas las recetas del plan
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', ingredient->>'name',
      'quantity', SUM((ingredient->>'quantity')::numeric),
      'unit', ingredient->>'unit',
      'category', ingredient->>'category',
      'checked', false
    )
  )
  INTO v_items
  FROM meal_plans mp
  CROSS JOIN LATERAL jsonb_each(mp.meals) day
  CROSS JOIN LATERAL jsonb_each(day.value) meal
  JOIN recipes r ON r.id = (meal.value->>'recipe_id')::uuid
  CROSS JOIN LATERAL jsonb_array_elements(r.ingredients) ingredient
  WHERE mp.id = p_meal_plan_id
  GROUP BY ingredient->>'name', ingredient->>'unit', ingredient->>'category';
  
  -- Crear shopping list
  INSERT INTO shopping_lists (user_id, meal_plan_id, items)
  VALUES (v_user_id, p_meal_plan_id, v_items)
  RETURNING id INTO v_shopping_list_id;
  
  RETURN v_shopping_list_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Migraciones

Ejecutar en orden:

1. `001_create_users.sql`
2. `002_create_recipes.sql`
3. `003_create_meal_plans.sql`
4. `004_create_shopping_lists.sql`
5. `005_create_collections.sql`
6. `006_create_reviews.sql`
7. `007_create_achievements.sql`
8. `008_create_storage_policies.sql`
9. `009_create_functions.sql`

---

**Última actualización:** 15 Nov 2025
