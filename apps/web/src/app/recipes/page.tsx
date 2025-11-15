'use client';

import { useState } from 'react';
import { useRecipes } from '../../hooks/useRecipes';
import { RecipeCard } from '../../components/recipes/RecipeCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Filter, Grid3x3, List, Search } from 'lucide-react';

export default function RecipesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Usar nuestro hook useRecipes
  const { data: recipes, isLoading, error, refetch } = useRecipes(
    { search: searchQuery },
    'created_at',
    'desc'
  );

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
          onCreateClick={() => (window.location.href = '/recipes/new')}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Filters and View Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar recetas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="px-4 py-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtros</span>
              </button>

              <div className="flex bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${
                    viewMode === 'grid'
                      ? 'bg-[#10b981] text-white'
                      : 'hover:bg-gray-50 dark:hover:bg-[#252525]'
                  } transition-colors`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${
                    viewMode === 'list'
                      ? 'bg-[#10b981] text-white'
                      : 'hover:bg-gray-50 dark:hover:bg-[#252525]'
                  } transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <LoadingSpinner size="lg" message="Cargando recetas..." />
          )}

          {/* Error State */}
          {error && (
            <ErrorMessage
              error={error as Error}
              onRetry={() => refetch()}
            />
          )}

          {/* Empty State */}
          {!isLoading && !error && recipes && recipes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-4xl">🍳</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">No hay recetas</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                {searchQuery
                  ? `No encontramos recetas que coincidan con "${searchQuery}"`
                  : 'Comienza agregando tu primera receta deliciosa'}
              </p>
              <button
                onClick={() => (window.location.href = '/recipes/new')}
                className="px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg transition-colors"
              >
                Crear Primera Receta
              </button>
            </div>
          )}

          {/* Recipes Grid */}
          {!isLoading && !error && recipes && recipes.length > 0 && (
            <>
              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
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
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => (window.location.href = `/recipe/${recipe.id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
