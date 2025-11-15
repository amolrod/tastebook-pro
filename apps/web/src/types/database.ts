/**
 * Tipos TypeScript generados para la base de datos de Supabase.
 * 
 * Este archivo define la estructura completa de la base de datos
 * incluyendo todas las tablas, columnas, relaciones y tipos.
 * 
 * @generated Este archivo puede ser regenerado con el CLI de Supabase:
 * `npx supabase gen types typescript --project-id <project-id> > src/types/database.ts`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          preferences: Json;
          stats: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          preferences?: Json;
          stats?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          preferences?: Json;
          stats?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          ingredients: Json;
          steps: Json;
          prep_time: number | null;
          cook_time: number | null;
          servings: number;
          difficulty: 'facil' | 'media' | 'dificil' | null;
          image_url: string | null;
          tags: string[];
          nutrition: Json;
          is_public: boolean;
          views_count: number;
          favorites_count: number;
          rating_avg: number | null;
          rating_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          ingredients: Json;
          steps: Json;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number;
          difficulty?: 'facil' | 'media' | 'dificil' | null;
          image_url?: string | null;
          tags?: string[];
          nutrition?: Json;
          is_public?: boolean;
          views_count?: number;
          favorites_count?: number;
          rating_avg?: number | null;
          rating_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          ingredients?: Json;
          steps?: Json;
          prep_time?: number | null;
          cook_time?: number | null;
          servings?: number;
          difficulty?: 'facil' | 'media' | 'dificil' | null;
          image_url?: string | null;
          tags?: string[];
          nutrition?: Json;
          is_public?: boolean;
          views_count?: number;
          favorites_count?: number;
          rating_avg?: number | null;
          rating_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          week_start_date: string;
          meals: Json;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_start_date: string;
          meals: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_start_date?: string;
          meals?: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_lists: {
        Row: {
          id: string;
          user_id: string;
          meal_plan_id: string | null;
          items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meal_plan_id?: string | null;
          items: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meal_plan_id?: string | null;
          items?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          icon: string;
          color: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          icon?: string;
          color?: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          icon?: string;
          color?: string;
          is_default?: boolean;
          created_at?: string;
        };
      };
      collection_recipes: {
        Row: {
          collection_id: string;
          recipe_id: string;
          added_at: string;
        };
        Insert: {
          collection_id: string;
          recipe_id: string;
          added_at?: string;
        };
        Update: {
          collection_id?: string;
          recipe_id?: string;
          added_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          recipe_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          icon: string | null;
          tier: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
          points: number;
          criteria: Json;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
          points?: number;
          criteria: Json;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
          points?: number;
          criteria?: Json;
        };
      };
      user_achievements: {
        Row: {
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// ============================================
// TIPOS DE DOMINIO (DOMAIN TYPES)
// ============================================

/**
 * Ingrediente de una receta
 */
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category?: string;
}

/**
 * Información nutricional
 */
export interface Nutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

/**
 * Comida en el planificador
 */
export interface MealPlanMeal {
  recipe_id: string;
  servings: number;
}

/**
 * Día del planificador
 */
export interface MealPlanDay {
  desayuno?: MealPlanMeal;
  comida?: MealPlanMeal;
  cena?: MealPlanMeal;
  snack?: MealPlanMeal;
}

/**
 * Item de lista de compra
 */
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  from_recipes?: string[];
}

/**
 * Preferencias de usuario
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
  measurement_system?: 'metric' | 'imperial';
}

/**
 * Estadísticas de usuario
 */
export interface UserStats {
  recipes_created: number;
  recipes_cooked: number;
  achievements_earned: number;
  total_likes?: number;
  meal_plans_completed?: number;
}

/**
 * Criterios de logro
 */
export interface AchievementCriteria {
  recipes_created?: number;
  recipes_cooked?: number;
  total_likes?: number;
  meal_plans_completed?: number;
  [key: string]: number | undefined;
}

// ============================================
// TIPOS HELPER
// ============================================

/**
 * Tipo de dificultad de receta
 */
export type RecipeDifficulty = 'facil' | 'media' | 'dificil';

/**
 * Tier de logro
 */
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

/**
 * Tipo de comida
 */
export type MealType = 'desayuno' | 'comida' | 'cena' | 'snack';

/**
 * Receta completa (Row con tipos parseados)
 */
export type Recipe = Omit<Database['public']['Tables']['recipes']['Row'], 'ingredients' | 'steps' | 'nutrition'> & {
  ingredients: Ingredient[];
  steps: string[];
  nutrition: Nutrition;
};

/**
 * Plan de comidas completo (Row con tipos parseados)
 */
export type MealPlan = Omit<Database['public']['Tables']['meal_plans']['Row'], 'meals'> & {
  meals: Record<string, MealPlanDay>;
};

/**
 * Lista de compra completa (Row con tipos parseados)
 */
export type ShoppingList = Omit<Database['public']['Tables']['shopping_lists']['Row'], 'items'> & {
  items: ShoppingListItem[];
};

/**
 * Usuario completo (Row con tipos parseados)
 */
export type User = Omit<Database['public']['Tables']['users']['Row'], 'preferences' | 'stats'> & {
  preferences: UserPreferences;
  stats: UserStats;
};
