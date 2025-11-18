import { supabase } from '../supabase';

/**
 * StreakService - Gestión de racha de días consecutivos
 * 
 * Registra actividad del usuario y calcula racha actual
 */
export const StreakService = {
  /**
   * Registrar actividad del usuario (login, crear receta, planificar comida)
   */
  async recordActivity(
    userId: string,
    activityType: 'login' | 'recipe_created' | 'meal_planned'
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await supabase
      .from('user_activity')
      .upsert({
        user_id: userId,
        activity_date: today,
        activity_type: activityType,
      }, {
        onConflict: 'user_id,activity_date,activity_type',
        ignoreDuplicates: true
      });
    
    if (error) {
      console.error('Error recording activity:', error);
      throw error;
    }
  },

  /**
   * Obtener racha actual del usuario usando función SQL
   */
  async getCurrentStreak(userId: string): Promise<number> {
    const { data, error } = await supabase
      .rpc('calculate_user_streak', {
        p_user_id: userId
      });
    
    if (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
    
    return data || 0;
  },

  /**
   * Obtener historial de actividad (para heatmap)
   */
  async getActivityHistory(userId: string, days: number = 365): Promise<Date[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('user_activity')
      .select('activity_date')
      .eq('user_id', userId)
      .eq('activity_type', 'login')
      .gte('activity_date', startDate.toISOString().split('T')[0])
      .order('activity_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching activity history:', error);
      return [];
    }
    
    return (data || []).map(d => new Date(d.activity_date));
  }
};
