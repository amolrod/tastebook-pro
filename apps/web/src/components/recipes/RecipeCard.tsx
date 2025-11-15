import { Clock, Users, Star } from 'lucide-react';
import type { Recipe } from '@/lib/api/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const difficultyConfig = {
  facil: { bg: '#dcfce7', text: '#16a34a', label: 'Fácil' },
  media: { bg: '#fef3c7', text: '#d97706', label: 'Media' },
  dificil: { bg: '#fee2e2', text: '#dc2626', label: 'Difícil' },
};

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const difficulty = recipe.difficulty || 'facil';
  const difficultyStyle = difficultyConfig[difficulty];

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#1A1A1A] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        
        {/* Rating Badge */}
        {recipe.rating_avg && (
          <div className="absolute top-3 right-3 bg-white dark:bg-[#1A1A1A] px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{recipe.rating_avg.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#10b981] transition-colors">
          {recipe.title}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {recipe.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{totalTime} min</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} personas</span>
          </div>
        </div>

        {/* Tags and Difficulty */}
        <div className="flex items-center justify-between gap-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs rounded-full text-gray-700 dark:text-gray-300">
                +{recipe.tags.length - 2}
              </span>
            )}
          </div>

          {/* Difficulty */}
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: difficultyStyle.bg,
              color: difficultyStyle.text,
            }}
          >
            {difficultyStyle.label}
          </span>
        </div>
      </div>
    </div>
  );
}
