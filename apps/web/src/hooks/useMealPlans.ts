import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MealPlanService, formatWeekStart } from '../lib/api/meal-plans';
import type { MealPlan, MealPlanDay } from '../types/database';
import { toast } from 'sonner';

/**
 * Query keys para meal plans
 */
export const mealPlanKeys = {
  all: ['meal-plans'] as const,
  lists: () => [...mealPlanKeys.all, 'list'] as const,
  list: (userId: string) => [...mealPlanKeys.lists(), userId] as const,
  details: () => [...mealPlanKeys.all, 'detail'] as const,
  detail: (userId: string, weekStart: string) => 
    [...mealPlanKeys.details(), userId, weekStart] as const,
};

/**
 * Hook para obtener o crear plan de comidas de una semana
 */
export function useMealPlan(userId: string | undefined, weekStartDate: string) {
  return useQuery({
    queryKey: mealPlanKeys.detail(userId || '', weekStartDate),
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      return await MealPlanService.getOrCreateMealPlan(userId, weekStartDate);
    },
    enabled: !!userId && !!weekStartDate,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener todos los planes de un usuario
 */
export function useUserMealPlans(userId: string | undefined) {
  return useQuery({
    queryKey: mealPlanKeys.list(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      return await MealPlanService.getUserMealPlans(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para agregar receta al plan
 */
export function useAddRecipeToMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      currentMeals,
      day,
      mealType,
      recipeId,
      servings = 1,
    }: {
      planId: string;
      currentMeals: Record<string, MealPlanDay>;
      day: string;
      mealType: keyof MealPlanDay;
      recipeId: string;
      servings?: number;
    }) => {
      return await MealPlanService.addRecipeToMealPlan(
        planId,
        currentMeals,
        day,
        mealType,
        recipeId,
        servings
      );
    },
    onSuccess: (data, variables) => {
      // Actualizar cache
      queryClient.setQueryData(
        mealPlanKeys.detail(data.user_id, data.week_start_date),
        data
      );
      
      // Invalidar lista
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.lists() });
      
      toast.success('Receta agregada al plan');
    },
    onError: (error: Error) => {
      console.error('Error adding recipe:', error);
      toast.error('Error al agregar receta al plan');
    },
  });
}

/**
 * Hook para eliminar receta del plan
 */
export function useRemoveRecipeFromMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      currentMeals,
      day,
      mealType,
    }: {
      planId: string;
      currentMeals: Record<string, MealPlanDay>;
      day: string;
      mealType: keyof MealPlanDay;
    }) => {
      return await MealPlanService.removeRecipeFromMealPlan(
        planId,
        currentMeals,
        day,
        mealType
      );
    },
    onSuccess: (data) => {
      // Actualizar cache
      queryClient.setQueryData(
        mealPlanKeys.detail(data.user_id, data.week_start_date),
        data
      );
      
      // Invalidar lista
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.lists() });
      
      toast.success('Receta eliminada del plan');
    },
    onError: (error: Error) => {
      console.error('Error removing recipe:', error);
      toast.error('Error al eliminar receta del plan');
    },
  });
}

/**
 * Hook para actualizar plan completo
 */
export function useUpdateMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      meals,
      notes,
    }: {
      planId: string;
      meals: Record<string, MealPlanDay>;
      notes?: string;
    }) => {
      return await MealPlanService.updateMealPlan(planId, meals, notes);
    },
    onSuccess: (data) => {
      // Actualizar cache
      queryClient.setQueryData(
        mealPlanKeys.detail(data.user_id, data.week_start_date),
        data
      );
      
      // Invalidar lista
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.lists() });
      
      toast.success('Plan actualizado');
    },
    onError: (error: Error) => {
      console.error('Error updating meal plan:', error);
      toast.error('Error al actualizar el plan');
    },
  });
}

/**
 * Hook para eliminar plan
 */
export function useDeleteMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      return await MealPlanService.deleteMealPlan(planId);
    },
    onSuccess: () => {
      // Invalidar todas las queries de meal plans
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.all });
      
      toast.success('Plan eliminado');
    },
    onError: (error: Error) => {
      console.error('Error deleting meal plan:', error);
      toast.error('Error al eliminar el plan');
    },
  });
}
