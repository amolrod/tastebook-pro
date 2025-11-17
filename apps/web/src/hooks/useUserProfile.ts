import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });
}
