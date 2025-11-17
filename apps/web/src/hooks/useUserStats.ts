import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface UserStats {
  recipesCount: number;
  favoritesCount: number;
  plansCount: number;
}

export function useUserStats(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: async (): Promise<UserStats> => {
      if (!userId) {
        return {
          recipesCount: 0,
          favoritesCount: 0,
          plansCount: 0,
        };
      }

      // Obtener count de recetas del usuario
      const { count: recipesCount } = await supabase
        .from('recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // TODO: Implementar favorites cuando exista la tabla
      // const { count: favoritesCount } = await supabase
      //   .from('favorites')
      //   .select('*', { count: 'exact', head: true })
      //   .eq('user_id', userId);

      // TODO: Implementar plans cuando exista la tabla
      // const { count: plansCount } = await supabase
      //   .from('meal_plans')
      //   .select('*', { count: 'exact', head: true })
      //   .eq('user_id', userId);

      return {
        recipesCount: recipesCount || 0,
        favoritesCount: 0, // TODO
        plansCount: 0, // TODO
      };
    },
    enabled: !!userId,
  });
}
