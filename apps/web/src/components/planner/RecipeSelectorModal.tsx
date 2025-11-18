'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clock, Users, Star, Heart } from 'lucide-react';
import { useRecipes } from '../../hooks/useRecipes';
import { useFavorites } from '../../hooks/useFavorites';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Recipe } from '../../types/database';

interface RecipeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipeId: string, servings: number) => void;
  title?: string;
}

/**
 * Modal para seleccionar recetas del catálogo
 * 
 * Features:
 * - Búsqueda de recetas
 * - Filtros por dificultad
 * - Vista previa con info
 * - Selector de porciones
 */
export function RecipeSelectorModal({
  isOpen,
  onClose,
  onSelectRecipe,
  title = 'Seleccionar Receta',
}: RecipeSelectorModalProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServings, setSelectedServings] = useState(1);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [timeFilter, setTimeFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [servingsFilter, setServingsFilter] = useState('');

  const { data: allRecipes, isLoading } = useRecipes({}, 'created_at', 'desc');
  const { data: favorites } = useFavorites(user?.id);

  // Obtener todos los tags únicos de las recetas
  const allTags = [...new Set(allRecipes?.flatMap(recipe => recipe.tags || []) || [])];
  const favoriteRecipeIds = new Set(favorites?.map(fav => fav.recipe_id) || []);

  // Filtrado local
  const recipes = allRecipes?.filter((recipe) => {
    const matchesSearch =
      !searchQuery ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = !difficultyFilter || recipe.difficulty === difficultyFilter;

    const matchesFavorites = !showOnlyFavorites || favoriteRecipeIds.has(recipe.id);

    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    const matchesTime = !timeFilter || 
      (timeFilter === '15' && totalTime <= 15) ||
      (timeFilter === '30' && totalTime <= 30) ||
      (timeFilter === '60' && totalTime <= 60) ||
      (timeFilter === '60+' && totalTime > 60);

    const matchesTag = !tagFilter || (recipe.tags && recipe.tags.includes(tagFilter));

    const matchesServings = !servingsFilter || recipe.servings === Number(servingsFilter);

    return matchesSearch && matchesDifficulty && matchesFavorites && matchesTime && matchesTag && matchesServings;
  });

  const handleSelectRecipe = (recipeId: string) => {
    onSelectRecipe(recipeId, selectedServings);
    onClose();
    setSearchQuery('');
    setDifficultyFilter('');
    setShowOnlyFavorites(false);
    setTimeFilter('');
    setTagFilter('');
    setServingsFilter('');
    setSelectedServings(1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#E6E6E6] dark:border-[#333333]">
            <h2 className="text-2xl font-bold text-black dark:text-white font-sora">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="p-6 border-b border-[#E6E6E6] dark:border-[#333333] space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar recetas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              />
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              {/* Filtro de favoritos */}
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`px-4 py-2 border rounded-lg font-inter text-sm transition-all flex items-center gap-2 ${
                  showOnlyFavorites
                    ? 'bg-[#10b981] border-[#10b981] text-white'
                    : 'border-[#E6E6E6] dark:border-[#333333] bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:border-[#10b981]'
                }`}
              >
                <Heart size={16} className={showOnlyFavorites ? 'fill-white' : ''} />
                Favoritas
              </button>

              {/* Filtro de dificultad */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              >
                <option value="">Todas las dificultades</option>
                <option value="facil">Fácil</option>
                <option value="media">Media</option>
                <option value="dificil">Difícil</option>
              </select>

              {/* Filtro de tiempo */}
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              >
                <option value="">Cualquier tiempo</option>
                <option value="15">≤ 15 min</option>
                <option value="30">≤ 30 min</option>
                <option value="60">≤ 1 hora</option>
                <option value="60+">&gt; 1 hora</option>
              </select>

              {/* Filtro de tags */}
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              >
                <option value="">Todos los tipos</option>
                {allTags.sort().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>

              {/* Filtro de porciones */}
              <select
                value={servingsFilter}
                onChange={(e) => setServingsFilter(e.target.value)}
                className="px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              >
                <option value="">Todas las porciones</option>
                <option value="1">1 porción</option>
                <option value="2">2 porciones</option>
                <option value="3">3 porciones</option>
                <option value="4">4 porciones</option>
                <option value="5">5 porciones</option>
                <option value="6">6 porciones</option>
                <option value="8">8 porciones</option>
                <option value="10">10 porciones</option>
                <option value="12">12 porciones</option>
              </select>
            </div>

            {/* Selector de porciones (fuera de filtros) */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#E6E6E6] dark:border-[#333333]">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-inter">
                Porciones a preparar:
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={selectedServings}
                onChange={(e) => setSelectedServings(Number(e.target.value))}
                className="w-20 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-inter">(Aplicará a la receta seleccionada)</span>
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : recipes && recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => handleSelectRecipe(recipe.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 font-inter">
                  No se encontraron recetas
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function RecipeCard({ recipe, onClick }: { recipe: Recipe; onClick: () => void }) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-[#262626] border border-[#E6E6E6] dark:border-[#404040] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 text-left group"
    >
      {/* Image */}
      <div className="relative h-32 overflow-hidden bg-[#F8F8F8] dark:bg-[#1A1A1A]">
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

        {recipe.rating_avg && (
          <div className="absolute top-2 right-2 bg-white dark:bg-[#1E1E1E] px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
            <span className="text-xs font-semibold text-black dark:text-white font-inter">
              {recipe.rating_avg.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-black dark:text-white mb-2 line-clamp-2 group-hover:text-[#10b981] transition-colors font-sora">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 font-inter">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{totalTime}min</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{recipe.servings}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
