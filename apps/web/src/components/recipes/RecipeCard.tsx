import { Clock, Users, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Recipe } from '../../lib/api/recipes';
import { useAuth } from '../../contexts/AuthContext';
import { useIsFavorite } from '../../hooks/useIsFavorite';
import { useToggleFavorite } from '../../hooks/useToggleFavorite';
import { toast } from 'sonner';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const difficultyConfig: Record<string, { bg: string; text: string; label: string }> = {
  facil: { bg: '#dcfce7', text: '#16a34a', label: 'Fácil' },
  media: { bg: '#fef3c7', text: '#d97706', label: 'Media' },
  dificil: { bg: '#fee2e2', text: '#dc2626', label: 'Difícil' },
};

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const difficulty = recipe.difficulty || 'facil';
  const difficultyStyle = difficultyConfig[difficulty];
  
  const { user } = useAuth();
  const { data: isFavorite = false, isLoading: isFavoriteLoading } = useIsFavorite(user?.id, recipe.id);
  const toggleFavorite = useToggleFavorite();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Debes iniciar sesión para guardar favoritos');
      return;
    }
    
    toggleFavorite.mutate({
      userId: user.id,
      recipeId: recipe.id,
      isFavorite,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white dark:bg-[#1A1A1A] rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🍽️</span>
          </div>
        )}

        {/* Overlay gradiente en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Favorite Button - Mejorado */}
        {user && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            disabled={toggleFavorite.isPending || isFavoriteLoading}
            className={`absolute top-3 right-3 p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 ${
              isFavorite
                ? 'bg-red-500/90 hover:bg-red-600'
                : 'bg-white/90 dark:bg-[#1A1A1A]/90 hover:bg-white dark:hover:bg-[#1A1A1A]'
            } ${
              toggleFavorite.isPending || isFavoriteLoading
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {toggleFavorite.isPending || isFavoriteLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  isFavorite
                    ? 'fill-white text-white scale-110'
                    : 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500'
                }`}
              />
            )}
          </motion.button>
        )}
        
        {/* Rating Badge */}
        {recipe.rating_avg && recipe.rating_avg > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-amber-400 text-white px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
            <Star className="w-4 h-4 fill-white" />
            <span className="font-bold text-sm">{recipe.rating_avg.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-black dark:text-white mb-3 font-sora line-clamp-2 group-hover:text-[#10b981] transition-colors">
          {recipe.title}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 font-inter leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {totalTime > 0 && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#10b981]" />
                <span className="font-inter font-medium">{totalTime} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#10b981]" />
                <span className="font-inter font-medium">{recipe.servings}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#F3F3F3] dark:bg-[#262626] text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold font-inter hover:bg-[#10b981] hover:text-white transition-colors"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="px-3 py-1 bg-[#F3F3F3] dark:bg-[#262626] text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold font-inter">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Tags and Difficulty */}
        <div className="flex items-center justify-between">
          {/* Difficulty Badge */}
          {recipe.difficulty && (
            <span
              className="px-4 py-1.5 rounded-full text-xs font-bold font-inter"
              style={{
                backgroundColor: difficultyStyle.bg,
                color: difficultyStyle.text,
              }}
            >
              {difficultyStyle.label}
            </span>
          )}

          {/* Hover indicator */}
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
          >
            <span className="text-[#10b981] text-sm font-semibold font-inter">
              Ver receta →
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
