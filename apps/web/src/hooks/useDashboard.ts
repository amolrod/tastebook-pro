import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StreakService } from '../lib/api/streak';
import { AchievementService } from '../lib/api/achievements';
import { IngredientMatcherService } from '../lib/api/ingredient-matcher';
import { supabase } from '../lib/supabase';
import type { Recipe } from '../types/database';

/**
 * Hook para obtener y gestionar racha del usuario
 */
export function useStreak(userId: string | undefined) {
  return useQuery({
    queryKey: ['streak', userId],
    queryFn: async () => {
      if (!userId) return 0;
      return await StreakService.getCurrentStreak(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para registrar actividad del usuario
 */
export function useRecordActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      activityType,
    }: {
      userId: string;
      activityType: 'login' | 'recipe_created' | 'meal_planned';
    }) => {
      await StreakService.recordActivity(userId, activityType);
    },
    onSuccess: (_, variables) => {
      // Invalidar caché de racha
      queryClient.invalidateQueries({ queryKey: ['streak', variables.userId] });
      // Verificar achievements
      queryClient.invalidateQueries({ queryKey: ['achievements', variables.userId] });
    },
  });
}

/**
 * Hook para obtener estadísticas del dashboard
 */
export function useDashboardStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: async () => {
      if (!userId) {
        return {
          recipesCount: 0,
          favoritesCount: 0,
          plannedMealsThisWeek: 0,
          totalCookingTime: 0,
        };
      }

      // Obtener count de recetas
      const { count: recipesCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Obtener count de favoritos
      const { count: favoritesCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Obtener comidas planeadas para esta semana
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      const weekStart = monday.toISOString().split('T')[0];

      const { data: mealPlan } = await supabase
        .from('meal_plans')
        .select('meals')
        .eq('user_id', userId)
        .eq('week_start_date', weekStart)
        .single();

      let plannedMealsThisWeek = 0;
      if (mealPlan?.meals) {
        const meals = mealPlan.meals as Record<string, Record<string, any>>;
        Object.values(meals).forEach(dayMeals => {
          plannedMealsThisWeek += Object.keys(dayMeals).length;
        });
      }

      // Calcular tiempo total de cocina (suma de prep_time + cook_time)
      const { data: userRecipes } = await supabase
        .from('recipes')
        .select('prep_time, cook_time')
        .eq('user_id', userId);

      const totalCookingTime = (userRecipes || []).reduce((sum, recipe) => {
        return sum + (recipe.prep_time || 0) + (recipe.cook_time || 0);
      }, 0);

      return {
        recipesCount: recipesCount || 0,
        favoritesCount: favoritesCount || 0,
        plannedMealsThisWeek,
        totalCookingTime,
      };
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para obtener próximas comidas del plan semanal
 */
export function useUpcomingMeals(userId: string | undefined, limit: number = 3) {
  return useQuery({
    queryKey: ['upcoming-meals', userId, limit],
    queryFn: async () => {
      if (!userId) return [];

      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - today.getDay() + 1);
      const weekStart = monday.toISOString().split('T')[0];

      // Obtener plan semanal
      const { data: mealPlan } = await supabase
        .from('meal_plans')
        .select('meals')
        .eq('user_id', userId)
        .eq('week_start_date', weekStart)
        .single();

      if (!mealPlan?.meals) return [];

      const meals = mealPlan.meals as Record<string, Record<string, { recipe_id: string; servings: number }>>;
      const upcomingMeals: Array<{
        date: string;
        day: string;
        mealType: string;
        recipe: Recipe;
        servings: number;
      }> = [];

      const mealTypeOrder = ['desayuno', 'comida', 'cena', 'snack'];
      const todayStr = today.toISOString().split('T')[0];

      // Extraer todas las comidas futuras
      for (const [date, dayMeals] of Object.entries(meals)) {
        if (date >= todayStr) {
          for (const mealType of mealTypeOrder) {
            if (dayMeals[mealType]) {
              const { recipe_id, servings } = dayMeals[mealType];
              
              // Fetch recipe data
              const { data: recipe } = await supabase
                .from('recipes')
                .select('*')
                .eq('id', recipe_id)
                .single();

              if (recipe) {
                const dateObj = new Date(date);
                const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                
                upcomingMeals.push({
                  date,
                  day: dayNames[dateObj.getDay()],
                  mealType,
                  recipe,
                  servings,
                });
              }
            }
          }
        }
      }

      // Ordenar por fecha y hora de comida
      upcomingMeals.sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        return mealTypeOrder.indexOf(a.mealType) - mealTypeOrder.indexOf(b.mealType);
      });

      return upcomingMeals.slice(0, limit);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener recetas populares (mejor rating)
 */
export function usePopularRecipes(limit: number = 5) {
  return useQuery({
    queryKey: ['popular-recipes', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)
        .not('rating_avg', 'is', null)
        .order('rating_avg', { ascending: false })
        .order('rating_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching popular recipes:', error);
        return [];
      }

      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para obtener achievements recientes
 */
export function useRecentAchievements(userId: string | undefined, limit: number = 3) {
  return useQuery({
    queryKey: ['recent-achievements', userId, limit],
    queryFn: async () => {
      if (!userId) return [];
      return await AchievementService.getRecentAchievements(userId, limit);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para verificar y desbloquear achievements
 */
export function useCheckAchievements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return await AchievementService.checkAndUnlockAchievements(userId);
    },
    onSuccess: (newAchievements, userId) => {
      // Invalidar caché de achievements
      queryClient.invalidateQueries({ queryKey: ['recent-achievements', userId] });
      queryClient.invalidateQueries({ queryKey: ['achievements', userId] });
      
      return newAchievements;
    },
  });
}

/**
 * Hook para matching de ingredientes
 */
export function useIngredientMatcher() {
  return useMutation({
    mutationFn: async (selectedIngredients: string[]) => {
      return await IngredientMatcherService.findMatchingRecipes(
        selectedIngredients,
        5, // límite de resultados
        30 // mínimo 30% de match
      );
    },
  });
}

/**
 * Hook para obtener ingredientes comunes (sugerencias)
 */
export function useCommonIngredients(limit: number = 20) {
  return useQuery({
    queryKey: ['common-ingredients', limit],
    queryFn: async () => {
      return await IngredientMatcherService.getCommonIngredients(limit);
    },
    staleTime: 60 * 60 * 1000, // 1 hora
  });
}
