import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewService, type CreateReviewDTO } from '../lib/api/reviews';

export function useReviews(recipeId: string) {
  return useQuery({
    queryKey: ['reviews', recipeId],
    queryFn: () => ReviewService.getByRecipeId(recipeId),
    enabled: !!recipeId,
  });
}

export function useReviewStats(recipeId: string) {
  return useQuery({
    queryKey: ['reviewStats', recipeId],
    queryFn: () => ReviewService.getAverageRating(recipeId),
    enabled: !!recipeId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: CreateReviewDTO) => ReviewService.create(review),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.recipe_id] });
      queryClient.invalidateQueries({ queryKey: ['reviewStats', variables.recipe_id] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => ReviewService.delete(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviewStats'] });
    },
  });
}
