import { useParams, useNavigate } from 'react-router';
import { useRecipe, useDeleteRecipe } from '../../hooks/useRecipes';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Clock, Users, ChefHat, Edit, Trash2, ArrowLeft, Share2, Heart, BookOpen, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';
import type { Recipe } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';
import { useIsFavorite } from '../../hooks/useIsFavorite';
import { useToggleFavorite } from '../../hooks/useToggleFavorite';

const DIFFICULTY_LABELS = {
  facil: 'Fácil',
  media: 'Media',
  dificil: 'Difícil',
};

const DIFFICULTY_COLORS = {
  facil: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  media: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  dificil: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: recipe, isLoading, error, refetch } = useRecipe(id!);
  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { user } = useAuth();
  const { data: isFavorite = false, isLoading: isFavoriteLoading } = useIsFavorite(user?.id, id);
  const toggleFavorite = useToggleFavorite();

  const handleFavoriteClick = () => {
    if (!user || !id) {
      toast.error('Debes iniciar sesión para guardar favoritos');
      return;
    }
    
    toggleFavorite.mutate({
      userId: user.id,
      recipeId: id,
      isFavorite,
    });
  };

  const handleDelete = () => {
    if (!id) return;
    
    deleteRecipe(id, {
      onSuccess: () => {
        toast.success('Receta eliminada exitosamente');
        navigate('/recipes');
      },
      onError: () => {
        toast.error('Error al eliminar la receta');
      },
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.title,
          text: recipe?.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado al portapapeles');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] p-4">
        <ErrorMessage
          error={error || new Error('Receta no encontrada')}
          onRetry={refetch}
        />
      </div>
    );
  }

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Hero Image Section */}
      <div className="relative h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-900 dark:to-black">
        {recipe.image_url ? (
          <>
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat size={120} className="text-gray-400 dark:text-gray-700" />
          </div>
        )}

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/recipes')}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline font-inter font-semibold">Volver</span>
        </motion.button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3">
          {user && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavoriteClick}
              disabled={toggleFavorite.isPending || isFavoriteLoading}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold font-inter shadow-lg backdrop-blur-md transition-all ${
                isFavorite
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-white/90 dark:bg-[#1E1E1E]/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1E1E1E]'
              } ${
                toggleFavorite.isPending || isFavoriteLoading
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {toggleFavorite.isPending || isFavoriteLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      isFavorite ? 'fill-white' : ''
                    }`}
                  />
                  <span className="hidden sm:inline">
                    {isFavorite ? 'Favorito' : 'Guardar'}
                  </span>
                </>
              )}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="p-3 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Share2 size={20} className="text-gray-700 dark:text-gray-300" />
          </motion.button>

          {user?.id === recipe.user_id && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/recipes/${id}/edit`)}
                className="p-3 bg-white/90 dark:bg-[#1E1E1E]/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Edit size={20} className="text-gray-700 dark:text-gray-300" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(true)}
                className="p-3 bg-red-500/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all hover:bg-red-600"
              >
                <Trash2 size={20} className="text-white" />
              </motion.button>
            </>
          )}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white mb-4 font-sora"
            >
              {recipe.title}
            </motion.h1>
            {recipe.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-white/90 font-inter max-w-3xl"
              >
                {recipe.description}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Meta Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 text-center shadow-lg"
          >
            <Clock className="w-8 h-8 text-[#10b981] mx-auto mb-3" />
            <p className="text-3xl font-bold text-black dark:text-white mb-1 font-sora">
              {totalTime}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">minutos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 text-center shadow-lg"
          >
            <Users className="w-8 h-8 text-[#10b981] mx-auto mb-3" />
            <p className="text-3xl font-bold text-black dark:text-white mb-1 font-sora">
              {recipe.servings}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">porciones</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 text-center shadow-lg"
          >
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-black dark:text-white mb-1 font-sora">
              {recipe.difficulty ? DIFFICULTY_LABELS[recipe.difficulty] : 'N/A'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">dificultad</p>
          </motion.div>

          {recipe.calories && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 text-center shadow-lg"
            >
              <Flame className="w-8 h-8 text-amber-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-black dark:text-white mb-1 font-sora">
                {recipe.calories}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">calorías</p>
            </motion.div>
          )}
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-sm bg-[#10b981]/10 text-[#10b981] font-semibold font-inter"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Ingredients and Instructions Grid */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Ingredients */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#10b981]/10 rounded-xl">
                <BookOpen className="w-6 h-6 text-[#10b981]" />
              </div>
              <h2 className="text-2xl font-bold text-black dark:text-white font-sora">
                Ingredientes
              </h2>
            </div>
            <ul className="space-y-3">
              {recipe.ingredients?.map((ingredient, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-colors"
                >
                  <div className="w-2 h-2 bg-[#10b981] rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-inter">
                    <span className="font-semibold">
                      {ingredient.quantity} {ingredient.unit}
                    </span>{' '}
                    {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#10b981]/10 rounded-xl">
                <ChefHat className="w-6 h-6 text-[#10b981]" />
              </div>
              <h2 className="text-2xl font-bold text-black dark:text-white font-sora">
                Instrucciones
              </h2>
            </div>
            <ol className="space-y-4">
              {recipe.instructions?.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#10b981] to-[#059669] text-white rounded-full flex items-center justify-center font-bold font-sora">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-inter leading-relaxed pt-2">
                    {instruction}
                  </p>
                </li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-black dark:text-white mb-4 font-sora">
                ¿Eliminar receta?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-inter">
                Esta acción no se puede deshacer. La receta se eliminará permanentemente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold font-inter transition-all disabled:opacity-50"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-[#262626] dark:hover:bg-[#333333] text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold font-inter transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
