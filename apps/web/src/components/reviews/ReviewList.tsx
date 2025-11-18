import { useReviews } from '../../hooks/useReviews';
import { Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ReviewListProps {
  recipeId: string;
}

export function ReviewList({ recipeId }: ReviewListProps) {
  const { data: reviews, isLoading } = useReviews(recipeId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
        <p>No hay reseñas todavía. ¡Sé el primero en opinar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div 
          key={review.id}
          className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center overflow-hidden">
                {review.user?.avatar_url ? (
                  <img 
                    src={review.user.avatar_url} 
                    alt={review.user.full_name || 'Usuario'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100">
                  {review.user?.full_name || 'Usuario anónimo'}
                </h4>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDistanceToNow(new Date(review.created_at || ''), { addSuffix: true, locale: es })}
                </span>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-zinc-300 dark:text-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {review.comment && (
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
