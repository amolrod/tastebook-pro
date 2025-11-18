import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import {
  useStreak,
  useDashboardStats,
  useUpcomingMeals,
  usePopularRecipes,
  useRecentAchievements,
  useIngredientMatcher,
  useCommonIngredients,
  useCheckAchievements,
} from "../hooks/useDashboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Calendar,
  ChefHat,
  TrendingUp,
  Clock,
  Users,
  Trophy,
  Star,
  Plus,
  X,
  Search,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hooks de datos
  const { data: streak = 0, isLoading: loadingStreak } = useStreak(user?.id);
  const { data: stats, isLoading: loadingStats } = useDashboardStats(user?.id);
  const { data: upcomingMeals = [], isLoading: loadingMeals } = useUpcomingMeals(user?.id, 3);
  const { data: popularRecipes = [], isLoading: loadingPopular } = usePopularRecipes(5);
  const { data: recentAchievements = [], isLoading: loadingAchievements } = useRecentAchievements(user?.id, 2);
  const { data: commonIngredients = [] } = useCommonIngredients(15);
  
  const ingredientMatcher = useIngredientMatcher();
  const checkAchievements = useCheckAchievements();

  // Verificar achievements al cargar
  useEffect(() => {
    if (user?.id) {
      checkAchievements.mutate(user.id, {
        onSuccess: (newAchievements) => {
          // Mostrar toast por cada achievement nuevo
          newAchievements.forEach(achievement => {
            if (achievement.just_unlocked) {
              toast.success(`🎉 ¡Logro desbloqueado!`, {
                description: achievement.achievement_name,
                duration: 5000,
              });
            }
          });
        }
      });
    }
  }, [user?.id, stats?.recipesCount, stats?.plannedMealsThisWeek]);

  const handleIngredientToggle = (ingredient) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      }
      return [...prev, ingredient];
    });
  };

  const handleFindRecipes = async () => {
    if (selectedIngredients.length === 0) {
      toast.error('Selecciona al menos un ingrediente');
      return;
    }

    ingredientMatcher.mutate(selectedIngredients);
  };

  const getMealTypeLabel = (type) => {
    const labels = {
      desayuno: 'Desayuno',
      comida: 'Almuerzo',
      cena: 'Cena',
      snack: 'Snack'
    };
    return labels[type] || type;
  };

  const getMealTypeColor = (type) => {
    const colors = {
      desayuno: '#f59e0b',
      comida: '#10b981',
      cena: '#3b82f6',
      snack: '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const getTierColor = (tier) => {
    const colors = {
      bronze: 'bg-gradient-to-br from-[#cd7f32] to-[#b87333]',
      silver: 'bg-gradient-to-br from-[#c0c0c0] to-[#a8a8a8]',
      gold: 'bg-gradient-to-br from-[#ffd700] to-[#ffb700]',
      platinum: 'bg-gradient-to-br from-[#e5e4e2] to-[#b0c4de]'
    };
    return colors[tier?.toLowerCase()] || colors.bronze;
  };

  const getTierBadge = (tier) => {
    const badges = {
      bronze: 'bg-[#cd7f32]/10 text-[#cd7f32]',
      silver: 'bg-[#c0c0c0]/10 text-[#808080]',
      gold: 'bg-[#ffd700]/10 text-[#daa520]',
      platinum: 'bg-[#e5e4e2]/10 text-[#4682b4]'
    };
    return badges[tier?.toLowerCase()] || badges.bronze;
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${rating}-${i}`} size={14} className="fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <Star key={`half-${rating}`} size={14} className="fill-amber-200 text-amber-400" />
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${rating}-${i}`} size={14} className="text-gray-300 dark:text-gray-600" />
        ))}
      </div>
    );
  };

  const achievements = recentAchievements || [];

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="dashboard" />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Dashboard"
          onCreateClick={() => navigate("/recipes/new")}
        />

        {/* Content area below header */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Top Row - Streak & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Streak Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Flame size={32} className="text-white" />
                  </motion.div>
                  <div>
                    <p className="text-white/80 text-sm font-inter">
                      Racha Actual
                    </p>
                    {loadingStreak ? (
                      <div className="h-10 w-16 bg-white/20 rounded animate-pulse" />
                    ) : (
                      <p className="text-4xl font-bold font-sora">{streak}</p>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-sm font-inter">
                {streak === 0 
                  ? "¡Empieza tu racha hoy! 🚀"
                  : streak === 1
                  ? "¡Buen comienzo! Vuelve mañana 🎉"
                  : streak < 7
                  ? `¡Sigue así! ${7 - streak} días para el próximo logro 🔥`
                  : "¡Increíble racha! Eres un maestro 👑"
                }
              </p>
            </motion.div>

            {/* This Week Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={24} className="text-[#10b981]" />
                <p className="font-semibold text-black dark:text-white font-inter">
                  Esta Semana
                </p>
              </div>
              {loadingStats ? (
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-bold text-black dark:text-white font-sora mb-1">
                  {stats?.plannedMealsThisWeek || 0}
                </p>
              )}
              <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                comidas planeadas
              </p>
              {!loadingStats && stats && stats.plannedMealsThisWeek === 0 && (
                <button
                  onClick={() => navigate('/planner')}
                  className="mt-3 text-sm text-[#10b981] hover:text-[#059669] font-semibold flex items-center gap-1"
                >
                  Planificar comidas
                  <ChevronRight size={16} />
                </button>
              )}
            </motion.div>

            {/* Recipes Created */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <ChefHat size={24} className="text-[#f59e0b]" />
                <p className="font-semibold text-black dark:text-white font-inter">
                  Mis Recetas
                </p>
              </div>
              {loadingStats ? (
                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-bold text-black dark:text-white font-sora mb-1">
                  {stats?.recipesCount || 0}
                </p>
              )}
              <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                recetas creadas
              </p>
              {!loadingStats && stats && stats.totalCookingTime > 0 && (
                <p className="mt-2 text-xs text-[#6E6E6E] dark:text-[#AAAAAA] font-inter flex items-center gap-1">
                  <Clock size={12} />
                  {Math.round(stats.totalCookingTime / 60)}h de cocina total
                </p>
              )}
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Larger widgets */}
            <div className="xl:col-span-2 space-y-8">
              {/* What Can I Cook Today Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={24} className="text-[#10b981]" />
                  <h2 className="text-xl font-bold text-black dark:text-white font-sora">
                    ¿Qué puedo cocinar hoy?
                  </h2>
                </div>
                <p className="text-[#6E6E6E] dark:text-[#AAAAAA] mb-4 font-inter">
                  Selecciona los ingredientes que tienes disponibles
                </p>

                {/* Ingredientes disponibles */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {commonIngredients.slice(0, 12).map((ingredient) => {
                      const isSelected = selectedIngredients.includes(ingredient);
                      return (
                        <button
                          key={ingredient}
                          onClick={() => handleIngredientToggle(ingredient)}
                          className={`px-4 py-2 rounded-lg border font-inter text-sm transition-all duration-150 hover:scale-105 active:scale-95 ${
                            isSelected
                              ? 'bg-[#10b981] border-[#10b981] text-white shadow-md'
                              : 'border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] text-black dark:text-white hover:border-[#10b981]'
                          }`}
                        >
                          {ingredient}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleFindRecipes}
                      disabled={selectedIngredients.length === 0 || ingredientMatcher.isPending}
                      className="px-6 py-2 bg-[#10b981] text-white rounded-lg font-semibold hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      {ingredientMatcher.isPending ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Buscando...
                        </>
                      ) : (
                        <>
                          <Search size={18} />
                          Buscar recetas ({selectedIngredients.length})
                        </>
                      )}
                    </button>
                    
                    {selectedIngredients.length > 0 && (
                      <button
                        onClick={() => setSelectedIngredients([])}
                        className="px-4 py-2 border border-[#E6E6E6] dark:border-[#404040] rounded-lg font-semibold text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>

                {/* Resultados */}
                <AnimatePresence mode="wait">
                  {ingredientMatcher.data && ingredientMatcher.data.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <p className="text-sm font-semibold text-black dark:text-white font-inter flex items-center gap-2">
                        <Sparkles size={16} className="text-[#10b981]" />
                        {ingredientMatcher.data.length} recetas encontradas
                      </p>
                      {ingredientMatcher.data.map((match, idx) => (
                        <motion.div
                          key={match.recipe.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={() => navigate(`/recipes/${match.recipe.id}`)}
                          className="flex items-center gap-4 p-3 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-[#F8F8F8] dark:bg-[#262626] hover:bg-white dark:hover:bg-[#2A2A2A] transition-all cursor-pointer group"
                        >
                          <img
                            src={match.recipe.image_url || 'https://via.placeholder.com/80'}
                            alt={match.recipe.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-black dark:text-white font-inter group-hover:text-[#10b981] transition-colors">
                                {match.recipe.title}
                              </p>
                              <span className="px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] text-xs font-bold rounded-full">
                                {Math.round(match.matchPercentage)}% match
                              </span>
                            </div>
                            <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                              {(match.recipe.prep_time || 0) + (match.recipe.cook_time || 0)} min
                              {match.missingIngredients.length > 0 && (
                                <span className="ml-2">
                                  • Faltan: {match.missingIngredients.slice(0, 2).map(i => i.name).join(', ')}
                                  {match.missingIngredients.length > 2 && ` +${match.missingIngredients.length - 2}`}
                                </span>
                              )}
                            </p>
                          </div>
                          <ChevronRight size={20} className="text-[#6E6E6E] group-hover:text-[#10b981] transition-colors" />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {ingredientMatcher.data && ingredientMatcher.data.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <p className="text-[#6E6E6E] dark:text-[#AAAAAA] mb-2">
                        No se encontraron recetas con esos ingredientes
                      </p>
                      <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA]">
                        Intenta con menos ingredientes o diferentes combinaciones
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Weekly Plan Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black dark:text-white font-sora">
                    Próximas Comidas
                  </h2>
                  <button
                    onClick={() => navigate("/planner")}
                    className="text-sm text-[#10b981] hover:text-[#059669] font-inter font-semibold flex items-center gap-1"
                  >
                    Ver planner
                    <ChevronRight size={16} />
                  </button>
                </div>

                {loadingMeals ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={`meal-skeleton-${i}`} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : upcomingMeals.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingMeals.map((item, idx) => (
                      <motion.div
                        key={`${item.date}-${item.mealType}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => navigate(`/recipes/${item.recipe.id}`)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[#E6E6E6] dark:border-[#404040] hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all cursor-pointer group"
                      >
                        <div
                          className="w-1 h-12 rounded-full"
                          style={{ backgroundColor: getMealTypeColor(item.mealType) }}
                        />
                        {item.recipe.image_url && (
                          <img
                            src={item.recipe.image_url}
                            alt={item.recipe.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-black dark:text-white font-inter group-hover:text-[#10b981] transition-colors">
                            {item.day} - {getMealTypeLabel(item.mealType)}
                          </p>
                          <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                            {item.recipe.title}
                          </p>
                        </div>
                        <ChevronRight size={20} className="text-[#6E6E6E] group-hover:text-[#10b981] transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar size={48} className="mx-auto mb-3 text-[#6E6E6E] dark:text-[#AAAAAA]" />
                    <p className="text-[#6E6E6E] dark:text-[#AAAAAA] mb-4">
                      No tienes comidas planeadas esta semana
                    </p>
                    <button
                      onClick={() => navigate('/planner')}
                      className="px-6 py-2 bg-[#10b981] text-white rounded-lg font-semibold hover:bg-[#059669] transition-all"
                    >
                      Crear plan semanal
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Sidebar widgets */}
            <div className="space-y-8">
              {/* Recent Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black dark:text-white font-sora">
                    Logros Recientes
                  </h2>
                  <button
                    onClick={() => navigate('/achievements')}
                    className="text-sm text-[#10b981] hover:text-[#059669] font-inter font-semibold flex items-center gap-1"
                  >
                    Ver todos
                    <ChevronRight size={16} />
                  </button>
                </div>

                {loadingAchievements ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={`achievement-skeleton-${i}`} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : achievements.length > 0 ? (
                  <div className="space-y-3">
                    {achievements.map((achievement, idx) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-[#F8F8F8] dark:bg-[#262626] hover:bg-white dark:hover:bg-[#2A2A2A] transition-all cursor-pointer"
                      >
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${getTierColor(achievement.tier)}`}
                        >
                          <span className="text-2xl">{achievement.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-black dark:text-white font-inter text-sm">
                              {achievement.name}
                            </p>
                            <span
                              className={`px-2 py-0.5 text-xs font-bold rounded-full ${getTierBadge(achievement.tier)}`}
                            >
                              {achievement.tier}
                            </span>
                          </div>
                          <p className="text-xs text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                            {achievement.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy size={48} className="mx-auto mb-3 text-[#6E6E6E] dark:text-[#AAAAAA]" />
                    <p className="text-[#6E6E6E] dark:text-[#AAAAAA] mb-4">
                      Aún no tienes logros desbloqueados
                    </p>
                    <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA]">
                      Crea recetas y planifica comidas para desbloquear logros
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Popular Recipes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black dark:text-white font-sora">
                    Recetas Populares
                  </h2>
                  <button
                    onClick={() => navigate('/recipes')}
                    className="text-sm text-[#10b981] hover:text-[#059669] font-inter font-semibold flex items-center gap-1"
                  >
                    Explorar
                    <ChevronRight size={16} />
                  </button>
                </div>

                {loadingPopular ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={`popular-skeleton-${i}`} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : popularRecipes.length > 0 ? (
                  <div className="space-y-3">
                    {popularRecipes.map((recipe, idx) => (
                      <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => navigate(`/recipes/${recipe.id}`)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-[#E6E6E6] dark:border-[#404040] hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all cursor-pointer group"
                      >
                        {recipe.image_url && (
                          <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-black dark:text-white font-inter text-sm group-hover:text-[#10b981] transition-colors">
                            {recipe.title}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(recipe.rating_avg || 0)}
                            <span className="text-xs text-[#6E6E6E] dark:text-[#AAAAAA] ml-1">
                              ({recipe.rating_count || 0})
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-[#6E6E6E] group-hover:text-[#10b981] transition-colors" />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star size={48} className="mx-auto mb-3 text-[#6E6E6E] dark:text-[#AAAAAA]" />
                    <p className="text-[#6E6E6E] dark:text-[#AAAAAA] mb-4">
                      No hay recetas valoradas aún
                    </p>
                    <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA]">
                      Sé el primero en valorar recetas
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
