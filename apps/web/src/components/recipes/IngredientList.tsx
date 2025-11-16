'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Ingredient } from '../../types/database';

interface IngredientListProps {
  ingredients: Ingredient[];
  onChange: (ingredients: Ingredient[]) => void;
  errors?: string;
}

/**
 * Componente para gestionar lista dinámica de ingredientes
 * 
 * Features:
 * - Añadir/remover ingredientes
 * - Campos: nombre, cantidad, unidad
 * - Validación en tiempo real
 * - Diseño responsive
 */
export function IngredientList({ ingredients, onChange, errors }: IngredientListProps) {
  const addIngredient = () => {
    onChange([...ingredients, { name: '', quantity: 1, unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-black dark:text-white font-inter">
          Ingredientes *
        </label>
        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-1 text-sm text-[#10b981] hover:text-[#059669] font-semibold transition-colors"
        >
          <Plus size={16} />
          Añadir
        </button>
      </div>

      {ingredients.map((ingredient, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            placeholder="Ingrediente"
            value={ingredient.name}
            onChange={(e) => updateIngredient(index, 'name', e.target.value)}
            className="flex-1 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          />
          <input
            type="number"
            placeholder="Cant."
            value={ingredient.quantity}
            onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
            className="w-20 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            min="0"
            step="0.1"
          />
          <input
            type="text"
            placeholder="Unidad"
            value={ingredient.unit}
            onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
            className="w-24 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          />
          <button
            type="button"
            onClick={() => removeIngredient(index)}
            className="p-2 text-red-500 hover:text-red-700 transition-colors"
            aria-label="Eliminar ingrediente"
          >
            <X size={20} />
          </button>
        </div>
      ))}

      {errors && (
        <p className="text-red-500 text-sm mt-1 font-inter">{errors}</p>
      )}
    </div>
  );
}
