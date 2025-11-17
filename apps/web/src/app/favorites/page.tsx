import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../hooks/useFavorites';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { Heart, ChefHat, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: favorites = [], isLoading, error, refetch } = useFavorites(user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/recipes')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#10b981] dark:hover:text-[#10b981] transition-colors mb-6 font-inter"
        >
          <ArrowLeft size={20} />
          Volver a recetas
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white font-sora">
              Mis Favoritos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-inter mt-1">
              {favorites.length} {favorites.length === 1 ? 'receta guardada' : 'recetas guardadas'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-[#1E1E1E] rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-400 dark:text-gray-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-black dark:text-white mb-3 font-sora">
            No tienes favoritos aún
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto font-inter">
            Explora recetas y guarda las que más te gusten haciendo clic en el corazón ❤️
          </p>

          <button
            onClick={() => navigate('/recipes')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl font-semibold transition-all transform hover:scale-105"
          >
            <ChefHat size={20} />
            Explorar Recetas
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {favorites.map((favorite, index) => (
            <motion.div
              key={favorite.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RecipeCard
                recipe={favorite.recipe}
                onClick={() => navigate(`/recipes/${favorite.recipe_id}`)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
