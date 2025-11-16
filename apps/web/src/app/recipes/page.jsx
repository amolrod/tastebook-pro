'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useRecipes } from '../../hooks/useRecipes';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Filter, Grid3x3, List, Search, Clock, Users, Star, Plus } from 'lucide-react';

export default function RecipesPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Usar nuestro hook useRecipes
  const { data: recipes, isLoading, error, refetch } = useRecipes(
    { search: searchQuery },
    'created_at',
    'desc'
  );

  // Debug: Log para ver el estado
  useEffect(() => {
    console.log('🔍 Estado de recetas:', {
      isLoading,
      hasError: !!error,
      errorMessage: error?.message,
      recipesCount: recipes?.length || 0,
      recipes: recipes?.slice(0, 2) // Solo primeras 2 para no saturar consola
    });
  }, [isLoading, error, recipes]);

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="recipes" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Mis Recetas"
          onCreateClick={() => navigate('/recipes/new')}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Filters and View Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E] dark:text-[#AAAAAA]" />
              <input
                type="text"
                placeholder="Buscar recetas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981] text-black dark:text-white font-inter transition-all"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="px-4 py-2.5 bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all flex items-center gap-2 text-black dark:text-white font-inter font-semibold"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtros</span>
              </button>

              <div className="flex bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-[#10b981] text-white'
                      : 'text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#262626]'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 transition-all ${
                    viewMode === 'list'
                      ? 'bg-[#10b981] text-white'
                      : 'text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#262626]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando recetas...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Error al cargar recetas: {error.message}
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                🔄 Reintentar
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && recipes && recipes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 border border-[#10b981]/20 flex items-center justify-center">
                <span className="text-5xl">🍳</span>
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3 font-sora">
                {searchQuery ? 'No se encontraron recetas' : 'No hay recetas todavía'}
              </h3>
              <p className="text-[#6E6E6E] dark:text-[#AAAAAA] mb-2 max-w-md font-inter">
                {searchQuery
                  ? `No encontramos recetas que coincidan con "${searchQuery}"`
                  : 'La conexión a Supabase funciona correctamente, pero no hay recetas en la base de datos.'}
              </p>
              {!searchQuery && (
                <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] mb-8 max-w-md font-inter">
                  Para agregar recetas de prueba, ejecuta el SQL de <code className="bg-[#F8F8F8] dark:bg-[#262626] px-2 py-1 rounded border border-[#E6E6E6] dark:border-[#404040]">seed_recipes.sql</code> en Supabase Dashboard → SQL Editor
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => refetch()}
                  className="px-6 py-3 bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#404040] text-black dark:text-white rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all font-inter font-semibold"
                >
                  🔄 Refrescar
                </button>
                <button
                  onClick={() => navigate('/recipes/new')}
                  className="px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-all font-inter font-semibold shadow-lg"
                >
                  ➕ Crear Primera Receta
                </button>
              </div>
            </div>
          )}

          {/* Recipes Grid */}
          {!isLoading && !error && recipes && recipes.length > 0 && (
            <>
              {/* Results Count */}
              <div className="mb-4 text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                {recipes.length} {recipes.length === 1 ? 'receta' : 'recetas'}
                {searchQuery && ` encontradas para "${searchQuery}"`}
              </div>

              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {recipes.map((recipe) => {
                  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
                  const difficultyLabels = {
                    facil: 'Fácil',
                    media: 'Media',
                    dificil: 'Difícil'
                  };

                  return (
                    <div
                      key={recipe.id}
                      onClick={() => (window.location.href = `/recipe/${recipe.id}`)}
                      className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-[#F8F8F8] dark:bg-[#262626]">
                        {recipe.image_url ? (
                          <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <span className="text-6xl">🍽️</span>
                          </div>
                        )}
                        
                        {/* Rating Badge */}
                        {recipe.rating_avg && (
                          <div className="absolute top-3 right-3 bg-white dark:bg-[#1E1E1E] px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md border border-[#E6E6E6] dark:border-[#404040]">
                            <Star className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                            <span className="text-sm font-semibold text-black dark:text-white font-inter">
                              {recipe.rating_avg.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Title */}
                        <h3 className="font-bold text-black dark:text-white mb-2 line-clamp-2 group-hover:text-[#10b981] transition-colors font-sora text-lg">
                          {recipe.title}
                        </h3>

                        {/* Description */}
                        {recipe.description && (
                          <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] mb-3 line-clamp-2 font-inter">
                            {recipe.description}
                          </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mb-3 text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                          {totalTime > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{totalTime} min</span>
                            </div>
                          )}
                          
                          {recipe.servings && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{recipe.servings}</span>
                            </div>
                          )}
                        </div>

                        {/* Difficulty Badge */}
                        {recipe.difficulty && (
                          <div className="inline-flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold font-inter ${
                                recipe.difficulty === 'facil'
                                  ? 'bg-[#dcfce7] text-[#16a34a]'
                                  : recipe.difficulty === 'media'
                                  ? 'bg-[#fef3c7] text-[#d97706]'
                                  : 'bg-[#fee2e2] text-[#dc2626]'
                              }`}
                            >
                              {difficultyLabels[recipe.difficulty] || recipe.difficulty}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Floating Action Button para crear recetas */}
      <button
        onClick={() => navigate('/recipes/new')}
        className="fixed bottom-6 right-6 z-30 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 flex items-center justify-center group hover:scale-110"
        aria-label="Crear nueva receta"
      >
        <Plus className="w-7 h-7 md:w-8 md:h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}

// Deshabilitar SSR para esta ruta
export const clientLoader = () => null;
