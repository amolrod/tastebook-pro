import { supabase } from '../supabase';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: {
    recipes_created?: number;
    favorites_count?: number;
    plans_created?: number;
    streak_days?: number;
  };
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement: Achievement;
}

/**
 * AchievementService - Sistema de logros gamificados
 */
export const AchievementService = {
  /**
   * Obtener todos los achievements disponibles
   */
  async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('tier', { ascending: true });
    
    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Obtener achievements desbloqueados del usuario
   */
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Obtener achievements recientes (últimos 3)
   */
  async getRecentAchievements(userId: string, limit: number = 3): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent achievements:', error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Verificar y desbloquear achievements automáticamente
   * Usa función SQL para eficiencia
   */
  async checkAndUnlockAchievements(userId: string): Promise<{
    achievement_id: string;
    achievement_name: string;
    just_unlocked: boolean;
  }[]> {
    const { data, error } = await supabase
      .rpc('check_and_unlock_achievements', {
        p_user_id: userId
      });
    
    if (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
    
    return data || [];
  },

  /**
   * Obtener progreso hacia próximo achievement por categoría
   */
  async getAchievementProgress(userId: string): Promise<{
    recipes: { current: number; next: Achievement | null };
    favorites: { current: number; next: Achievement | null };
    plans: { current: number; next: Achievement | null };
    streak: { current: number; next: Achievement | null };
  }> {
    // Obtener estadísticas actuales
    const [recipesCount, favoritesCount, plansCount] = await Promise.all([
      supabase.from('recipes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('meal_plans').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    // Obtener racha actual
    const { data: streakData } = await supabase
      .rpc('calculate_user_streak', { p_user_id: userId });

    // Obtener achievements desbloqueados
    const unlocked = await this.getUserAchievements(userId);
    const unlockedIds = new Set(unlocked.map(ua => ua.achievement_id));

    // Obtener todos los achievements
    const all = await this.getAllAchievements();

    // Encontrar próximo achievement por categoría
    const findNext = (criteria: keyof Achievement['criteria'], current: number) => {
      return all
        .filter(a => a.criteria[criteria] && !unlockedIds.has(a.id))
        .filter(a => (a.criteria[criteria] || 0) > current)
        .sort((a, b) => (a.criteria[criteria] || 0) - (b.criteria[criteria] || 0))[0] || null;
    };

    return {
      recipes: {
        current: recipesCount.count || 0,
        next: findNext('recipes_created', recipesCount.count || 0)
      },
      favorites: {
        current: favoritesCount.count || 0,
        next: findNext('favorites_count', favoritesCount.count || 0)
      },
      plans: {
        current: plansCount.count || 0,
        next: findNext('plans_created', plansCount.count || 0)
      },
      streak: {
        current: streakData || 0,
        next: findNext('streak_days', streakData || 0)
      }
    };
  }
};
