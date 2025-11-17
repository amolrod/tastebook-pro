import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../hooks/useFavorites';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { Heart, ChefHat, ArrowLeft, Sparkles, TrendingUp, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: favorites = [], isLoading, error, refetch } = useFavorites(user?.id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);

  // Filtrar favoritos por búsqueda y dificultad
  const filteredFavorites = favorites.filter((fav) => {
    const matchesSearch = fav.recipe.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty
      ? fav.recipe.difficulty === filterDifficulty
      : true;
    return matchesSearch && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-inter">
            Cargando tus favoritos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] p-4">
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Hero Header con Gradiente */}
      <div className="relative bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 overflow-hidden">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </div>

        {/* Contenido del Header */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Botón Volver */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/recipes')}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-8 font-inter backdrop-blur-sm bg-white/10 px-4 py-2 rounded-xl"
          >
            <ArrowLeft size={20} />
            Volver a recetas
          </motion.button>

          {/* Título Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <Heart className="w-12 h-12 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white font-sora tracking-tight">
                Mis Favoritos
              </h1>
              <p className="text-white/80 text-lg font-inter mt-2">
                {favorites.length}{' '}
                {favorites.length === 1 ? 'receta guardada' : 'recetas guardadas'}
              </p>
            </div>
          </motion.div>

          {/* Stats Quick */}
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <Sparkles className="w-6 h-6 text-white/80 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white font-sora">
                  {favorites.filter((f) => f.recipe.difficulty === 'facil').length}
                </p>
                <p className="text-white/70 text-sm font-inter">Fáciles</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <TrendingUp className="w-6 h-6 text-white/80 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white font-sora">
                  {favorites.filter((f) => f.recipe.difficulty === 'media').length}
                </p>
                <p className="text-white/70 text-sm font-inter">Intermedias</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <ChefHat className="w-6 h-6 text-white/80 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white font-sora">
                  {favorites.filter((f) => f.recipe.difficulty === 'dificil').length}
                </p>
                <p className="text-white/70 text-sm font-inter">Avanzadas</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {favorites.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center">
              <Heart className="w-16 h-16 text-red-500" />
            </div>

            <h2 className="text-3xl font-bold text-black dark:text-white mb-4 font-sora">
              Aún no tienes favoritos
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto font-inter text-lg leading-relaxed">
              Explora nuestra colección de recetas y guarda las que más te gusten
              haciendo clic en el corazón{' '}
              <Heart className="inline w-5 h-5 text-red-500 fill-red-500" />
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/recipes')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-xl font-semibold font-inter shadow-lg hover:shadow-xl transition-all"
            >
              <ChefHat size={24} />
              Explorar Recetas
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Barra de Filtros y Búsqueda */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Búsqueda */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar en favoritos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#F8F8F8] dark:bg-[#262626] border border-transparent focus:border-[#10b981] rounded-xl text-black dark:text-white font-inter transition-all focus:outline-none"
                  />
                </div>

                {/* Filtro de Dificultad */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilterDifficulty(null)}
                    className={`px-4 py-3 rounded-xl font-inter font-semibold transition-all ${
                      filterDifficulty === null
                        ? 'bg-[#10b981] text-white shadow-lg'
                        : 'bg-[#F8F8F8] dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333333]'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setFilterDifficulty('facil')}
                    className={`px-4 py-3 rounded-xl font-inter font-semibold transition-all ${
                      filterDifficulty === 'facil'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-[#F8F8F8] dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333333]'
                    }`}
                  >
                    Fácil
                  </button>
                  <button
                    onClick={() => setFilterDifficulty('media')}
                    className={`px-4 py-3 rounded-xl font-inter font-semibold transition-all ${
                      filterDifficulty === 'media'
                        ? 'bg-amber-500 text-white shadow-lg'
                        : 'bg-[#F8F8F8] dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333333]'
                    }`}
                  >
                    Media
                  </button>
                  <button
                    onClick={() => setFilterDifficulty('dificil')}
                    className={`px-4 py-3 rounded-xl font-inter font-semibold transition-all ${
                      filterDifficulty === 'dificil'
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-[#F8F8F8] dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333333]'
                    }`}
                  >
                    Difícil
                  </button>
                </div>
              </div>

              {/* Resultados */}
              {searchQuery && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-inter">
                  {filteredFavorites.length} resultado
                  {filteredFavorites.length !== 1 ? 's' : ''} encontrado
                  {filteredFavorites.length !== 1 ? 's' : ''}
                </p>
              )}
            </motion.div>

            {/* Grid de Recetas */}
            <AnimatePresence mode="wait">
              {filteredFavorites.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-12 text-center"
                >
                  <Filter className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-2 font-sora">
                    No se encontraron recetas
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-inter">
                    Intenta ajustar tus filtros de búsqueda
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredFavorites.map((favorite, index) => (
                    <motion.div
                      key={favorite.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <RecipeCard
                        recipe={favorite.recipe}
                        onClick={() => navigate(`/recipes/${favorite.recipe_id}`)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
