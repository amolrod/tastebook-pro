import { useParams, useNavigate } from 'react-router';
import { useRecipe, useDeleteRecipe } from '../../hooks/useRecipes';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { Clock, Users, ChefHat, Edit, Trash2, ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import type { Recipe } from '../../types/database';

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
          text: recipe?.description || undefined,
          url: window.location.href,
        });
      } catch (error) {
        // Usuario canceló o error
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href);
      toast.success('URL copiada al portapapeles');
    }
  };

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

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Receta no encontrada</p>
      </div>
    );
  }

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con botones de acción */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/recipes')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#10b981] dark:hover:text-[#10b981] transition-colors font-inter"
        >
          <ArrowLeft size={20} />
          Volver a recetas
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-lg border border-[#E6E6E6] dark:border-[#333333] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors"
            title="Compartir"
          >
            <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
          
          <button
            onClick={() => navigate(`/recipes/${id}/edit`)}
            className="p-2 rounded-lg border border-[#E6E6E6] dark:border-[#333333] hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors"
            title="Editar"
          >
            <Edit size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-lg border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={20} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* Imagen principal */}
      {recipe.image_url && (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-6">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Título y metadata */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-4 font-sora">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 font-inter">
            {recipe.description}
          </p>
        )}

        {/* Badges y stats */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {recipe.difficulty && (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
              <ChefHat size={14} className="inline mr-1" />
              {DIFFICULTY_LABELS[recipe.difficulty]}
            </span>
          )}

          {!recipe.is_public && (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
              🔒 Privada
            </span>
          )}
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-[#1E1E1E] rounded-xl">
          {recipe.prep_time && (
            <div className="text-center">
              <Clock size={20} className="mx-auto mb-1 text-[#10b981]" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Preparación</p>
              <p className="font-semibold text-black dark:text-white font-inter">{recipe.prep_time} min</p>
            </div>
          )}

          {recipe.cook_time && (
            <div className="text-center">
              <Clock size={20} className="mx-auto mb-1 text-[#10b981]" />
              <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Cocción</p>
              <p className="font-semibold text-black dark:text-white font-inter">{recipe.cook_time} min</p>
            </div>
          )}

          <div className="text-center">
            <Users size={20} className="mx-auto mb-1 text-[#10b981]" />
            <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">Porciones</p>
            <p className="font-semibold text-black dark:text-white font-inter">{recipe.servings}</p>
          </div>
        </div>

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] text-gray-700 dark:text-gray-300 font-inter"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Ingredientes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4 font-sora">
          Ingredientes
        </h2>
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-6 border border-[#E6E6E6] dark:border-[#333333]">
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-3 font-inter">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#10b981] mt-2"></span>
                <span className="text-black dark:text-white">
                  <span className="font-semibold">{ingredient.quantity} {ingredient.unit}</span>
                  {' de '}
                  {ingredient.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4 font-sora">
          Instrucciones
        </h2>
        <div className="space-y-4">
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 bg-white dark:bg-[#1E1E1E] rounded-xl p-4 border border-[#E6E6E6] dark:border-[#333333]">
                <p className="text-black dark:text-white font-inter">{instruction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4 font-sora">
              ¿Eliminar receta?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-inter">
              Esta acción no se puede deshacer. La receta será eliminada permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-lg border border-[#E6E6E6] dark:border-[#333333] text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors font-inter font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-inter font-semibold disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
