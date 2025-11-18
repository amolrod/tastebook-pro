import { useState } from 'react';
import { Star, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCreateReview, useReviews } from '../../hooks/useReviews';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  recipeId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ recipeId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const createReview = useCreateReview();
  const { data: reviews } = useReviews(recipeId);
  
  const userReview = reviews?.find(r => r.user_id === user?.id);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Debes iniciar sesión para dejar una reseña');
      return;
    }

    if (userReview) {
      toast.error('Ya has publicado una reseña para esta receta');
      return;
    }

    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    setIsSubmitting(true);

    try {
      await createReview.mutateAsync({
        recipe_id: recipeId,
        user_id: user.id,
        rating,
        comment,
        images: [] // TODO: Implement image upload for reviews
      });
      
      toast.success('¡Reseña publicada con éxito!');
      setRating(0);
      setComment('');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error posting review:', error);
      if (error.code === '23505' || error.message?.includes('409') || error.status === 409) {
        toast.error('Ya has publicado una reseña para esta receta');
      } else {
        toast.error('Error al publicar la reseña');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        {userReview ? 'Tu reseña' : 'Escribe una reseña'}
      </h3>

      {userReview ? (
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-900/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= userReview.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-zinc-300 dark:text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
              Ya has valorado esta receta
            </span>
          </div>
          {userReview.comment && (
            <p className="text-zinc-600 dark:text-zinc-300 text-sm italic">
              "{userReview.comment}"
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Calificación
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-zinc-300 dark:text-zinc-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Tu opinión
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="¿Qué te pareció esta receta?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Reseña'}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
