-- =====================================================
-- TASTEBOOK PRO - SQL COMPLETO PARA SUPABASE
-- =====================================================
-- Copia y pega TODO este archivo en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query > Pega aquí > Run
-- =====================================================

-- 1. TABLA: users
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
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

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- 2. TABLA: recipes
-- =====================================================
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER DEFAULT 4,
  difficulty TEXT CHECK (difficulty IN ('facil', 'media', 'dificil')) DEFAULT 'facil',
  image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  nutrition JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_is_public ON recipes(is_public);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipes_title_search ON recipes USING GIN(to_tsvector('spanish', title));

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view public recipes" ON recipes;
CREATE POLICY "Anyone can view public recipes"
  ON recipes FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own recipes" ON recipes;
CREATE POLICY "Users can create own recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recipes" ON recipes;
CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own recipes" ON recipes;
CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);

-- 3. TABLA: meal_plans
-- =====================================================
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  meals JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_week_start ON meal_plans(week_start_date);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own meal plans" ON meal_plans;
CREATE POLICY "Users can manage own meal plans"
  ON meal_plans FOR ALL
  USING (auth.uid() = user_id);

-- 4. TABLA: shopping_lists
-- =====================================================
CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_id ON shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_meal_plan_id ON shopping_lists(meal_plan_id);

ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own shopping lists" ON shopping_lists;
CREATE POLICY "Users can manage own shopping lists"
  ON shopping_lists FOR ALL
  USING (auth.uid() = user_id);

-- 5. TABLA: collections
-- =====================================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '📁',
  color TEXT DEFAULT '#10b981',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_recipes (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (collection_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_collection_id ON collection_recipes(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_recipe_id ON collection_recipes(recipe_id);

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own collections" ON collections;
CREATE POLICY "Users can manage own collections"
  ON collections FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own collection recipes" ON collection_recipes;
CREATE POLICY "Users can manage own collection recipes"
  ON collection_recipes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_recipes.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- 6. TABLA: reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
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

CREATE INDEX IF NOT EXISTS idx_reviews_recipe_id ON reviews(recipe_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reviews of public recipes" ON reviews;
CREATE POLICY "Anyone can view reviews of public recipes"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = reviews.recipe_id
      AND recipes.is_public = true
    )
  );

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- 7. TABLA: achievements
-- =====================================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  points INTEGER DEFAULT 0,
  criteria JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view achievements" ON achievements;
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can view own unlocked achievements" ON user_achievements;
CREATE POLICY "Users can view own unlocked achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- 8. TRIGGERS
-- =====================================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meal_plans_updated_at ON meal_plans;
CREATE TRIGGER update_meal_plans_updated_at
  BEFORE UPDATE ON meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shopping_lists_updated_at ON shopping_lists;
CREATE TRIGGER update_shopping_lists_updated_at
  BEFORE UPDATE ON shopping_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar rating promedio en recipes
CREATE OR REPLACE FUNCTION update_recipe_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE recipes
    SET 
      rating_avg = COALESCE((SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE recipe_id = OLD.recipe_id), 0),
      rating_count = (SELECT COUNT(*) FROM reviews WHERE recipe_id = OLD.recipe_id)
    WHERE id = OLD.recipe_id;
    RETURN OLD;
  ELSE
    UPDATE recipes
    SET 
      rating_avg = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE recipe_id = NEW.recipe_id),
      rating_count = (SELECT COUNT(*) FROM reviews WHERE recipe_id = NEW.recipe_id)
    WHERE id = NEW.recipe_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS review_rating_trigger ON reviews;
CREATE TRIGGER review_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_rating();

-- 9. FUNCIONES ÚTILES
-- =====================================================

-- Función para generar lista de compra desde meal plan
CREATE OR REPLACE FUNCTION generate_shopping_list(p_meal_plan_id UUID)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
  v_shopping_list_id UUID;
  v_items JSONB;
BEGIN
  SELECT user_id INTO v_user_id
  FROM meal_plans WHERE id = p_meal_plan_id;
  
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', gen_random_uuid()::text,
      'name', ingredient->>'name',
      'quantity', SUM((ingredient->>'quantity')::numeric),
      'unit', ingredient->>'unit',
      'category', COALESCE(ingredient->>'category', 'Otros'),
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
  
  INSERT INTO shopping_lists (user_id, meal_plan_id, items)
  VALUES (v_user_id, p_meal_plan_id, COALESCE(v_items, '[]'::jsonb))
  RETURNING id INTO v_shopping_list_id;
  
  RETURN v_shopping_list_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. DATOS DE EJEMPLO (ACHIEVEMENTS)
-- =====================================================
INSERT INTO achievements (code, name, description, icon, tier, points, criteria) VALUES
('first_recipe', 'Primera Receta', 'Crea tu primera receta', '👨‍🍳', 'bronze', 10, '{"recipes_created": 1}'::jsonb),
('recipe_collector', 'Coleccionista', 'Crea 10 recetas', '📚', 'silver', 30, '{"recipes_created": 10}'::jsonb),
('recipe_master', 'Maestro Cocinero', 'Crea 50 recetas', '🏆', 'gold', 100, '{"recipes_created": 50}'::jsonb),
('social_chef', 'Chef Social', 'Recibe 100 likes en tus recetas', '❤️', 'silver', 50, '{"total_likes": 100}'::jsonb),
('week_planner', 'Planificador', 'Completa un plan semanal', '📅', 'bronze', 20, '{"meal_plans_completed": 1}'::jsonb),
('organized_chef', 'Chef Organizado', 'Completa 10 planes semanales', '🗓️', 'gold', 80, '{"meal_plans_completed": 10}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- ✅ SQL EJECUTADO CORRECTAMENTE
-- =====================================================
-- Próximos pasos:
-- 1. Verifica las tablas en Table Editor
-- 2. Crea el bucket 'recipe-images' en Storage
-- 3. Configura .env.local con tus credenciales
-- 4. ¡Listo para usar Tastebook Pro!
-- =====================================================
