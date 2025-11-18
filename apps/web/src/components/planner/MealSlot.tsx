'use client';

import { useState } from 'react';
import { Plus, X, Clock, Users } from 'lucide-react';
import { useRecipe } from '../../hooks/useRecipes';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { MealPlanMeal } from '../../types/database';

interface MealSlotProps {
  day: string;
  mealType: string;
  mealLabel: string;
  mealColor: string;
  meal?: MealPlanMeal;
  onAddRecipe: () => void;
  onRemoveRecipe: () => void;
  isLoading?: boolean;
}

/**
 * Componente de slot de comida en el planificador
 * 
 * Features:
 * - Muestra receta asignada o botón para agregar
 * - Vista previa de la receta
 * - Botón para eliminar
 * - Soporte para drag & drop (futuro)
 */
export function MealSlot({
  day,
  mealType,
  mealLabel,
  mealColor,
  meal,
  onAddRecipe,
  onRemoveRecipe,
  isLoading = false,
}: MealSlotProps) {
  const { data: recipe, isLoading: isLoadingRecipe } = useRecipe(meal?.recipe_id || '', {
    enabled: !!meal?.recipe_id,
  });

  if (isLoading || isLoadingRecipe) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-lg p-3 min-h-[100px] flex items-center justify-center">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (!meal || !recipe) {
    return (
      <button
        onClick={onAddRecipe}
        className="bg-white dark:bg-[#1E1E1E] border-2 border-dashed border-[#E6E6E6] dark:border-[#404040] rounded-lg p-3 min-h-[100px] flex flex-col items-center justify-center gap-2 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] hover:border-[#10b981] dark:hover:border-[#10b981] transition-all group"
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${mealColor}20` }}
        >
          <Plus size={16} style={{ color: mealColor }} />
        </div>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-[#10b981] transition-colors font-inter">
          Agregar receta
        </span>
      </button>
    );
  }

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group relative">
      {/* Remove button */}
      <button
        onClick={onRemoveRecipe}
        className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg"
        title="Eliminar receta"
      >
        <X size={14} />
      </button>

      {/* Image */}
      <div className="relative h-20 overflow-hidden bg-[#F8F8F8] dark:bg-[#262626]">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-3xl">🍽️</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5">
        <h3 className="font-bold text-sm text-black dark:text-white mb-1.5 line-clamp-2 font-sora leading-tight">
          {recipe.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 font-inter">
          {totalTime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{totalTime}min</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{meal.servings}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
