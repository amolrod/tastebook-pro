import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface ToggleFavoriteData {
  userId: string;
  recipeId: string;
  isFavorite: boolean;
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, recipeId, isFavorite }: ToggleFavoriteData) => {
      if (isFavorite) {
        // Eliminar de favoritos
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('recipe_id', recipeId);

        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Agregar a favoritos
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            recipe_id: recipeId,
          });

        if (error) throw error;
        return { action: 'added' };
      }
    },
    onSuccess: (result) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      queryClient.invalidateQueries({ queryKey: ['is-favorite'] });

      // Toast notification
      if (result.action === 'added') {
        toast.success('Agregado a favoritos');
      } else {
        toast.success('Eliminado de favoritos');
      }
    },
    onError: (error: Error) => {
      console.error('Error toggling favorite:', error);
      toast.error('Error al actualizar favoritos');
    },
  });
}
