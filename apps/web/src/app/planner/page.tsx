'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  useMealPlan,
  useAddRecipeToMealPlan,
  useRemoveRecipeFromMealPlan,
} from '../../hooks/useMealPlans';
import { formatWeekStart, getWeekRange } from '../../lib/api/meal-plans';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { MealSlot } from '../../components/planner/MealSlot';
import { RecipeSelectorModal } from '../../components/planner/RecipeSelectorModal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

/**
 * Página principal del planificador semanal
 * 
 * Features:
 * - Navegación entre semanas
 * - Vista de calendario con días reales
 * - Agregar/eliminar recetas
 * - Modal de selección de recetas
 * - Datos reales desde Supabase
 */
export default function PlannerPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    mealType: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Verificar si el usuario ya vio el tip
  useEffect(() => {
    const tipSeen = localStorage.getItem('planner-tip-seen');
    if (!tipSeen) {
      setShowTip(true);
    }
  }, []);

  // Función para cerrar el tip permanentemente
  const dismissTip = () => {
    localStorage.setItem('planner-tip-seen', 'true');
    setShowTip(false);
  };

  // Calcular week start date
  const weekStartDate = useMemo(() => formatWeekStart(currentDate), [currentDate]);
  const { start: weekStart, end: weekEnd } = useMemo(
    () => getWeekRange(weekStartDate),
    [weekStartDate]
  );

  // Obtener o crear plan de la semana
  const {
    data: mealPlan,
    isLoading,
    error,
  } = useMealPlan(user?.id, weekStartDate);

  const addRecipeMutation = useAddRecipeToMealPlan();
  const removeRecipeMutation = useRemoveRecipeFromMealPlan();

  // Días de la semana
  const weekDays = useMemo(() => {
    const days = [];
    const start = new Date(weekStart);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    
    return days;
  }, [weekStart]);

  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const mealTypes = [
    { key: 'desayuno', label: 'Desayuno', color: '#fbbf24' },
    { key: 'comida', label: 'Comida', color: '#f59e0b' },
    { key: 'cena', label: 'Cena', color: '#3b82f6' },
    { key: 'snack', label: 'Snack', color: '#a78bfa' },
  ];

  // Navegación de semanas
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  // Abrir modal para agregar receta
  const handleAddRecipe = (day: string, mealType: string) => {
    setSelectedSlot({ day, mealType });
    setIsModalOpen(true);
  };

  // Agregar receta al plan
  const handleSelectRecipe = async (recipeId: string, servings: number) => {
    if (!mealPlan || !selectedSlot) return;

    console.log('📝 Saving to plan with servings:', servings);
    
    addRecipeMutation.mutate({
      planId: mealPlan.id,
      currentMeals: mealPlan.meals,
      day: selectedSlot.day,
      mealType: selectedSlot.mealType,
      recipeId,
      servings,
    });

    setSelectedSlot(null);
  };

  // Eliminar receta del plan
  const handleRemoveRecipe = (day: string, mealType: string) => {
    if (!mealPlan) return;

    removeRecipeMutation.mutate({
      planId: mealPlan.id,
      currentMeals: mealPlan.meals,
      day,
      mealType,
    });
  };

  // Formatear rango de fechas
  const formatDateRange = () => {
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const startMonth = weekStart.toLocaleDateString('es-ES', { month: 'long' });
    const endMonth = weekEnd.toLocaleDateString('es-ES', { month: 'long' });
    const year = weekStart.getFullYear();

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth} ${year}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
    }
  };

  // Obtener número de semana
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <p className="text-gray-600 dark:text-gray-400 font-inter">
          Debes iniciar sesión para usar el planificador
        </p>
      </div>
    );
  }

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
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="planner" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} title="Planificador Semanal" hideSearch={true} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Week Navigator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousWeek}
                className="p-2 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-all"
              >
                <ChevronLeft size={20} className="text-black dark:text-white" />
              </button>

              <div className="text-center">
                <p className="font-bold text-lg text-black dark:text-white font-sora">
                  {formatDateRange()}
                </p>
                <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                  Semana {getWeekNumber(weekStart)}
                </p>
              </div>

              <button
                onClick={goToNextWeek}
                className="p-2 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-all"
              >
                <ChevronRight size={20} className="text-black dark:text-white" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={goToCurrentWeek}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-all font-inter font-semibold text-sm text-black dark:text-white"
              >
                <Calendar size={16} />
                Semana Actual
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
              <p className="text-red-600 dark:text-red-400">
                Error al cargar el plan: {error.message}
              </p>
            </div>
          )}

          {/* Calendar Grid */}
          {mealPlan && !isLoading && (
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] overflow-hidden">
              {/* Header Row */}
              <div className="grid grid-cols-8 border-b border-[#E6E6E6] dark:border-[#333333]">
                <div className="p-4 bg-[#F8F8F8] dark:bg-[#262626] border-r border-[#E6E6E6] dark:border-[#333333]">
                  <p className="text-sm font-semibold text-black dark:text-white font-inter">
                    Comida
                  </p>
                </div>
                {weekDays.map((date, idx) => (
                  <div
                    key={idx}
                    className="p-4 text-center bg-[#F8F8F8] dark:bg-[#262626] border-r border-[#E6E6E6] dark:border-[#333333] last:border-r-0"
                  >
                    <p className="text-sm font-semibold text-black dark:text-white font-inter">
                      {dayLabels[idx]}
                    </p>
                    <p className="text-xs text-[#6E6E6E] dark:text-[#AAAAAA] font-inter mt-1">
                      {date.getDate()} {date.toLocaleDateString('es-ES', { month: 'short' })}
                    </p>
                  </div>
                ))}
              </div>

              {/* Meal Rows */}
              {mealTypes.map((mealType) => (
                <div
                  key={mealType.key}
                  className="grid grid-cols-8 border-b border-[#E6E6E6] dark:border-[#333333] last:border-b-0"
                >
                  {/* Meal Label */}
                  <div
                    className="p-4 flex items-center gap-2 border-r border-[#E6E6E6] dark:border-[#333333]"
                    style={{ backgroundColor: `${mealType.color}10` }}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: mealType.color }}
                    />
                    <p className="text-sm font-semibold text-black dark:text-white font-inter">
                      {mealType.label}
                    </p>
                  </div>

                  {/* Day Cells */}
                  {dayKeys.map((dayKey) => {
                    const meal = mealPlan.meals[dayKey]?.[mealType.key];
                    return (
                      <div
                        key={dayKey}
                        className="p-2 border-r border-[#E6E6E6] dark:border-[#333333] last:border-r-0"
                      >
                        <MealSlot
                          day={dayKey}
                          mealType={mealType.key}
                          mealLabel={mealType.label}
                          mealColor={mealType.color}
                          meal={meal}
                          onAddRecipe={() => handleAddRecipe(dayKey, mealType.key)}
                          onRemoveRecipe={() => handleRemoveRecipe(dayKey, mealType.key)}
                          isLoading={
                            addRecipeMutation.isPending || removeRecipeMutation.isPending
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Info Note - Solo se muestra una vez */}
          {showTip && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 relative">
              <button
                onClick={dismissTip}
                className="absolute top-2 right-2 p-1 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded-full transition-colors"
                title="Cerrar"
              >
                <X size={16} className="text-blue-600 dark:text-blue-400" />
              </button>
              <p className="text-sm text-blue-800 dark:text-blue-300 font-inter pr-6">
                <strong>Tip:</strong> Haz click en "Agregar receta" para añadir comidas a tu plan
                semanal. Puedes agregar recetas propias o públicas de otros usuarios.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Selector Modal */}
      <RecipeSelectorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
        onSelectRecipe={handleSelectRecipe}
        title="Seleccionar Receta para el Plan"
      />
    </div>
  );
}

// Deshabilitar SSR
export const clientLoader = () => null;
