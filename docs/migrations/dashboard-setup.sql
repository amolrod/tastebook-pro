-- ============================================
-- DASHBOARD SETUP - Tastebook Pro
-- Fecha: 18 Nov 2025
-- ============================================

-- 1. Tabla user_activity para tracking de racha
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL, -- 'login', 'recipe_created', 'meal_planned'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, activity_date, activity_type)
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_date ON user_activity(user_id, activity_date DESC);

COMMENT ON TABLE user_activity IS 'Registro de actividad del usuario para calcular rachas y achievements';
COMMENT ON COLUMN user_activity.activity_type IS 'Tipo: login, recipe_created, meal_planned';

-- 1.5. Añadir constraint único a user_achievements si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_activity_unique_per_day'
  ) THEN
    ALTER TABLE user_activity 
    ADD CONSTRAINT user_activity_unique_per_day 
    UNIQUE(user_id, activity_date, activity_type);
  END IF;
END $$;

-- 2. Insertar achievements predefinidos (solo si no existen)
INSERT INTO achievements (code, name, description, icon, tier, points, criteria) VALUES
  ('first_recipe', 'Primera Receta', 'Crea tu primera receta', '👨‍🍳', 'bronze', 10, '{"recipes_created": 1}'),
  ('recipe_master_5', 'Chef Amateur', 'Crea 5 recetas', '⭐', 'silver', 25, '{"recipes_created": 5}'),
  ('recipe_master_10', 'Chef Experto', 'Crea 10 recetas', '🌟', 'gold', 50, '{"recipes_created": 10}'),
  ('recipe_master_25', 'Maestro Culinario', 'Crea 25 recetas', '👑', 'platinum', 100, '{"recipes_created": 25}'),
  ('first_plan', 'Planificador', 'Completa tu primer plan semanal', '📅', 'bronze', 10, '{"plans_created": 1}'),
  ('planner_pro', 'Organizador Pro', '10 planes semanales', '📆', 'silver', 50, '{"plans_created": 10}'),
  ('streak_3', 'Constante', '3 días seguidos', '🔥', 'bronze', 15, '{"streak_days": 3}'),
  ('streak_7', 'Racha de Fuego', '7 días seguidos', '🔥', 'silver', 30, '{"streak_days": 7}'),
  ('streak_30', 'Dedicación Total', '30 días seguidos', '💎', 'platinum', 150, '{"streak_days": 30}'),
  ('first_favorite', 'Favorito', 'Guarda tu primera receta favorita', '❤️', 'bronze', 5, '{"favorites_count": 1}'),
  ('collector', 'Coleccionista', '25 recetas favoritas', '💝', 'gold', 75, '{"favorites_count": 25}')
ON CONFLICT (code) DO NOTHING;

-- 3. Función para calcular racha actual
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_check_date DATE;
  v_activity_exists BOOLEAN;
BEGIN
  -- Empezar desde hoy y retroceder
  LOOP
    v_check_date := v_current_date - v_streak;
    
    -- Verificar si hay actividad en esta fecha
    SELECT EXISTS(
      SELECT 1 FROM user_activity
      WHERE user_id = p_user_id
        AND activity_date = v_check_date
        AND activity_type = 'login'
    ) INTO v_activity_exists;
    
    -- Si no hay actividad, terminar
    IF NOT v_activity_exists THEN
      EXIT;
    END IF;
    
    v_streak := v_streak + 1;
    
    -- Límite de seguridad (máximo 365 días)
    IF v_streak >= 365 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;

-- 4. Función para verificar y desbloquear achievements automáticamente
-- Primero hacer DROP si existe con signature antigua
DROP FUNCTION IF EXISTS check_and_unlock_achievements(uuid);

CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id UUID)
RETURNS TABLE(achievement_code TEXT, achievement_name TEXT, just_unlocked BOOLEAN) AS $$
DECLARE
  v_recipes_count INTEGER;
  v_favorites_count INTEGER;
  v_plans_count INTEGER;
  v_streak_days INTEGER;
  r_achievement RECORD;
  v_already_unlocked BOOLEAN;
BEGIN
  -- Obtener estadísticas del usuario
  SELECT COUNT(*) INTO v_recipes_count
  FROM recipes WHERE user_id = p_user_id;
  
  SELECT COUNT(*) INTO v_favorites_count
  FROM favorites WHERE user_id = p_user_id;
  
  SELECT COUNT(*) INTO v_plans_count
  FROM meal_plans WHERE user_id = p_user_id;
  
  v_streak_days := calculate_user_streak(p_user_id);
  
  -- Revisar cada achievement
  FOR r_achievement IN 
    SELECT a.id, a.code, a.name, a.criteria
    FROM achievements a
  LOOP
    -- Verificar si ya está desbloqueado
    SELECT EXISTS(
      SELECT 1 FROM user_achievements
      WHERE user_id = p_user_id AND achievement_id = r_achievement.id
    ) INTO v_already_unlocked;
    
    -- Si no está desbloqueado, verificar criterios
    IF NOT v_already_unlocked THEN
      -- Verificar criterio de recetas
      IF (r_achievement.criteria->>'recipes_created')::INTEGER IS NOT NULL THEN
        IF v_recipes_count >= (r_achievement.criteria->>'recipes_created')::INTEGER THEN
          INSERT INTO user_achievements (user_id, achievement_id)
          VALUES (p_user_id, r_achievement.id);
          
          RETURN QUERY SELECT r_achievement.code, r_achievement.name, TRUE;
          CONTINUE;
        END IF;
      END IF;
      
      -- Verificar criterio de favoritos
      IF (r_achievement.criteria->>'favorites_count')::INTEGER IS NOT NULL THEN
        IF v_favorites_count >= (r_achievement.criteria->>'favorites_count')::INTEGER THEN
          INSERT INTO user_achievements (user_id, achievement_id)
          VALUES (p_user_id, r_achievement.id);
          
          RETURN QUERY SELECT r_achievement.code, r_achievement.name, TRUE;
          CONTINUE;
        END IF;
      END IF;
      
      -- Verificar criterio de planes
      IF (r_achievement.criteria->>'plans_created')::INTEGER IS NOT NULL THEN
        IF v_plans_count >= (r_achievement.criteria->>'plans_created')::INTEGER THEN
          INSERT INTO user_achievements (user_id, achievement_id)
          VALUES (p_user_id, r_achievement.id);
          
          RETURN QUERY SELECT r_achievement.code, r_achievement.name, TRUE;
          CONTINUE;
        END IF;
      END IF;
      
      -- Verificar criterio de racha
      IF (r_achievement.criteria->>'streak_days')::INTEGER IS NOT NULL THEN
        IF v_streak_days >= (r_achievement.criteria->>'streak_days')::INTEGER THEN
          INSERT INTO user_achievements (user_id, achievement_id)
          VALUES (p_user_id, r_achievement.id);
          
          RETURN QUERY SELECT r_achievement.code, r_achievement.name, TRUE;
          CONTINUE;
        END IF;
      END IF;
    END IF;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- 5. Políticas RLS para user_activity
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity"
  ON user_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- TESTING - Descomentar para probar
-- ============================================
/*
-- Insertar actividad de prueba
INSERT INTO user_activity (user_id, activity_date, activity_type)
VALUES 
  (auth.uid(), CURRENT_DATE, 'login'),
  (auth.uid(), CURRENT_DATE - 1, 'login'),
  (auth.uid(), CURRENT_DATE - 2, 'login');

-- Calcular racha
SELECT calculate_user_streak(auth.uid());

-- Verificar achievements
SELECT * FROM check_and_unlock_achievements(auth.uid());

-- Ver achievements desbloqueados
SELECT 
  ua.unlocked_at,
  a.name,
  a.description,
  a.icon,
  a.tier
FROM user_achievements ua
JOIN achievements a ON a.id = ua.achievement_id
WHERE ua.user_id = auth.uid()
ORDER BY ua.unlocked_at DESC;
*/
