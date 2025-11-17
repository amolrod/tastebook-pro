import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useIsFavorite(userId: string | undefined, recipeId: string | undefined) {
  return useQuery({
    queryKey: ['is-favorite', userId, recipeId],
    queryFn: async (): Promise<boolean> => {
      if (!userId || !recipeId) return false;

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)
        .maybeSingle();

      if (error) {
        console.error('Error checking favorite:', error);
        return false;
      }

      return !!data;
    },
    enabled: !!userId && !!recipeId,
  });
}
