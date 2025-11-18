import { supabase } from '../supabase';
import type { MealPlan, MealPlanDay, MealPlanMeal } from '../../types/database';

/**
 * Servicio para gestionar planes de comidas
 * 
 * Características:
 * - CRUD completo de meal plans
 * - Navegación por semanas
 * - Agregar/eliminar recetas del plan
 * - Soporte para múltiples comidas por slot
 */

/**
 * Obtener el lunes de una semana específica
 */
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Formatear fecha para week_start_date (YYYY-MM-DD)
 */
export function formatWeekStart(date: Date): string {
  const monday = getMonday(date);
  return monday.toISOString().split('T')[0];
}

/**
 * Obtener rango de fechas de una semana
 */
export function getWeekRange(weekStart: string): { start: Date; end: Date } {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

export const MealPlanService = {
  /**
   * Obtener plan de comidas de una semana específica
   */
  async getMealPlan(userId: string, weekStartDate: string): Promise<MealPlan | null> {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('week_start_date', weekStartDate)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No existe el plan, retornar null
          return null;
        }
        throw error;
      }

      return data as MealPlan;
    } catch (error) {
      console.error('Error getting meal plan:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo plan de comidas
   */
  async createMealPlan(userId: string, weekStartDate: string): Promise<MealPlan> {
    try {
      const emptyMeals: Record<string, MealPlanDay> = {
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {},
      };

      const { data, error } = await supabase
        .from('meal_plans')
        .insert({
          user_id: userId,
          week_start_date: weekStartDate,
          meals: emptyMeals,
        })
        .select()
        .single();

      if (error) throw error;

      return data as MealPlan;
    } catch (error) {
      console.error('Error creating meal plan:', error);
      throw error;
    }
  },

  /**
   * Obtener o crear plan de comidas
   */
  async getOrCreateMealPlan(userId: string, weekStartDate: string): Promise<MealPlan> {
    try {
      let plan = await this.getMealPlan(userId, weekStartDate);
      
      if (!plan) {
        plan = await this.createMealPlan(userId, weekStartDate);
      }

      return plan;
    } catch (error) {
      console.error('Error getting or creating meal plan:', error);
      throw error;
    }
  },

  /**
   * Actualizar plan de comidas completo
   */
  async updateMealPlan(
    planId: string,
    meals: Record<string, MealPlanDay>,
    notes?: string
  ): Promise<MealPlan> {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .update({
          meals,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', planId)
        .select()
        .single();

      if (error) throw error;

      return data as MealPlan;
    } catch (error) {
      console.error('Error updating meal plan:', error);
      throw error;
    }
  },

  /**
   * Agregar receta a un día y comida específica
   */
  async addRecipeToMealPlan(
    planId: string,
    currentMeals: Record<string, MealPlanDay>,
    day: string,
    mealType: keyof MealPlanDay,
    recipeId: string,
    servings: number = 1
  ): Promise<MealPlan> {
    try {
      console.log('💾 API saving with servings:', servings);
      
      const updatedMeals = { ...currentMeals };
      
      if (!updatedMeals[day]) {
        updatedMeals[day] = {};
      }

      // Agregar la receta al slot
      updatedMeals[day][mealType] = {
        recipe_id: recipeId,
        servings,
      };

      console.log('💾 Final meal object:', updatedMeals[day][mealType]);

      return await this.updateMealPlan(planId, updatedMeals);
    } catch (error) {
      console.error('Error adding recipe to meal plan:', error);
      throw error;
    }
  },

  /**
   * Eliminar receta de un día y comida específica
   */
  async removeRecipeFromMealPlan(
    planId: string,
    currentMeals: Record<string, MealPlanDay>,
    day: string,
    mealType: keyof MealPlanDay
  ): Promise<MealPlan> {
    try {
      const updatedMeals = { ...currentMeals };
      
      if (updatedMeals[day] && updatedMeals[day][mealType]) {
        delete updatedMeals[day][mealType];
      }

      return await this.updateMealPlan(planId, updatedMeals);
    } catch (error) {
      console.error('Error removing recipe from meal plan:', error);
      throw error;
    }
  },

  /**
   * Eliminar plan de comidas completo
   */
  async deleteMealPlan(planId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      throw error;
    }
  },

  /**
   * Obtener todos los planes de comidas de un usuario
   */
  async getUserMealPlans(userId: string): Promise<MealPlan[]> {
    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', userId)
        .order('week_start_date', { ascending: false });

      if (error) throw error;

      return (data as MealPlan[]) || [];
    } catch (error) {
      console.error('Error getting user meal plans:', error);
      throw error;
    }
  },
};
