import { supabase } from '../supabase';
import type { Database } from '../../types/database';

export type Review = Database['public']['Tables']['reviews']['Row'] & {
  user?: {
    full_name: string | null;
    avatar_url: string | null;
  };
};

export type CreateReviewDTO = {
  recipe_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  images?: string[];
};

export const ReviewService = {
  async getByRecipeId(recipeId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(full_name, avatar_url)
      `)
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(review: CreateReviewDTO): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select(`
        *,
        user:users(full_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    // Recalculate and update recipe stats
    await this.updateRecipeStats(review.recipe_id);

    return data;
  },

  async delete(reviewId: string): Promise<void> {
    // Get recipe_id before deleting
    const { data: review } = await supabase
      .from('reviews')
      .select('recipe_id')
      .eq('id', reviewId)
      .single();

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) throw error;

    if (review) {
      await this.updateRecipeStats(review.recipe_id);
    }
  },

  async updateRecipeStats(recipeId: string): Promise<void> {
    const { data: ratings } = await supabase
      .from('reviews')
      .select('rating')
      .eq('recipe_id', recipeId);

    if (ratings) {
      const count = ratings.length;
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      const average = count > 0 ? sum / count : 0;

      await supabase
        .from('recipes')
        .update({ 
          rating_avg: average,
          rating_count: count 
        })
        .eq('id', recipeId);
    }
  },

  async getAverageRating(recipeId: string): Promise<{ average: number; count: number }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('recipe_id', recipeId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
    const average = sum / data.length;

    // Self-healing: Update recipe table with calculated stats
    // This ensures the list view is always up to date when the detail page is visited
    await supabase
      .from('recipes')
      .update({ 
        rating_avg: average,
        rating_count: data.length 
      })
      .eq('id', recipeId);

    return { average, count: data.length };
  }
};
