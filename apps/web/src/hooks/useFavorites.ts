import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface Favorite {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
  recipe: {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    prep_time: number | null;
    cook_time: number | null;
    servings: number;
    difficulty: string | null;
    tags: string[];
  };
}

export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ['favorites', userId],
    queryFn: async (): Promise<Favorite[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          user_id,
          recipe_id,
          created_at,
          recipe:recipes (
            id,
            title,
            description,
            image_url,
            prep_time,
            cook_time,
            servings,
            difficulty,
            tags
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!userId,
  });
}
