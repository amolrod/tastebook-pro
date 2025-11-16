'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRecipeSchema, type CreateRecipeInput } from '../../lib/validations/recipe';
import { useCreateRecipe } from '../../hooks/useRecipes';
import { IngredientList } from './IngredientList';
import { StepList } from './StepList';
import { Clock, Users } from 'lucide-react';
import type { Recipe, Ingredient } from '../../types/database';

interface RecipeEditorProps {
  initialData?: Partial<Recipe>;
  onSuccess?: (recipe: Recipe) => void;
  onCancel?: () => void;
}

const COMMON_TAGS = [
  'italiana', 'mexicana', 'española', 'asiática', 'vegetariana', 'vegana',
  'sin gluten', 'postres', 'ensaladas', 'sopas', 'carnes', 'pescados', 'pasta', 'arroz'
];

/**
 * Editor completo de recetas con validación
 * 
 * Features:
 * - Formulario con react-hook-form + Zod
 * - Campos: título, descripción, ingredientes, pasos
 * - Metadata: tiempo, porciones, dificultad
 * - Tags multi-selección
 * - Privacidad (público/privado)
 * - Validación en tiempo real
 * - Integración con React Query
 */
export function RecipeEditor({ initialData, onSuccess, onCancel }: RecipeEditorProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);

  const { mutate: createRecipe, isPending } = useCreateRecipe();

  const { register, handleSubmit, control, formState: { errors } } = useForm<CreateRecipeInput>({
    resolver: zodResolver(CreateRecipeSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      ingredients: initialData?.ingredients || [{ name: '', quantity: 1, unit: '' }],
      instructions: initialData?.instructions || [''],
      servings: initialData?.servings || 4,
      difficulty: initialData?.difficulty || 'media',
      prep_time: initialData?.prep_time || undefined,
      cook_time: initialData?.cook_time || undefined,
      is_public: initialData?.is_public || false,
    }
  });

  // useFieldArray para manejar arrays dinámicos
  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    control,
    name: 'ingredients' as any,
  });

  const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
    control,
    name: 'instructions' as any,
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const onSubmit = (data: CreateRecipeInput) => {
    console.log('🔍 Datos del formulario:', data);
    console.log('🏷️ Tags seleccionados:', selectedTags);
    
    const recipeData: CreateRecipeInput = {
      ...data,
      tags: selectedTags,
    };

    console.log('📦 Datos finales a enviar:', recipeData);

    createRecipe(recipeData, {
      onSuccess: (recipe) => {
        console.log('✅ Receta creada:', recipe);
        onSuccess?.(recipe);
      },
      onError: (error) => {
        console.error('❌ Error creando receta:', error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Título */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Título de la Receta *
        </label>
        <input
          {...register('title')}
          type="text"
          className="w-full px-4 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          placeholder="Ej: Pasta Carbonara Tradicional"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1 font-inter">{errors.title.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Descripción
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter resize-none focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          placeholder="Descripción breve de la receta..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1 font-inter">{errors.description.message}</p>
        )}
      </div>

      {/* Ingredientes */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Ingredientes *
        </label>
        <div className="space-y-3">
          {ingredientFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <input
                {...register(`ingredients.${index}.name` as const)}
                placeholder="Nombre"
                className="flex-1 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              />
              <input
                {...register(`ingredients.${index}.quantity` as const, { valueAsNumber: true })}
                type="number"
                step="0.1"
                placeholder="Cantidad"
                className="w-24 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              />
              <input
                {...register(`ingredients.${index}.unit` as const)}
                placeholder="Unidad"
                className="w-24 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              />
              {ingredientFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => appendIngredient({ name: '', quantity: 1, unit: '' })}
          className="mt-3 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all text-black dark:text-white font-inter font-semibold"
        >
          + Añadir Ingrediente
        </button>
        {errors.ingredients && (
          <p className="text-red-500 text-sm mt-2 font-inter">
            {typeof errors.ingredients === 'string' ? errors.ingredients : errors.ingredients.message}
          </p>
        )}
      </div>

      {/* Pasos */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Pasos de Preparación *
        </label>
        <div className="space-y-3">
          {stepFields.map((field, index) => (
            <div key={field.id} className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <textarea
                  {...register(`instructions.${index}` as const)}
                  rows={2}
                  placeholder={`Paso ${index + 1}`}
                  className="w-full px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter resize-none focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                />
              </div>
              {stepFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => appendStep('')}
          className="mt-3 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all text-black dark:text-white font-inter font-semibold"
        >
          + Añadir Paso
        </button>
        {errors.instructions && (
          <p className="text-red-500 text-sm mt-2 font-inter">
            {typeof errors.instructions === 'string' ? errors.instructions : errors.instructions.message}
          </p>
        )}
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tiempo de preparación */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
            <Clock size={16} className="inline mr-1" />
            Prep. (min)
          </label>
          <input
            {...register('prep_time', { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            placeholder="15"
          />
        </div>

        {/* Tiempo de cocción */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
            <Clock size={16} className="inline mr-1" />
            Cocción (min)
          </label>
          <input
            {...register('cook_time', { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            placeholder="30"
          />
        </div>

        {/* Porciones */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
            <Users size={16} className="inline mr-1" />
            Porciones *
          </label>
          <input
            {...register('servings', { valueAsNumber: true })}
            type="number"
            min="1"
            className="w-full px-4 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          />
          {errors.servings && (
            <p className="text-red-500 text-sm mt-1 font-inter">{errors.servings.message}</p>
          )}
        </div>
      </div>

      {/* Dificultad */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Dificultad *
        </label>
        <div className="flex gap-3">
          {['facil', 'media', 'dificil'].map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                {...register('difficulty')}
                type="radio"
                value={level}
                className="w-4 h-4 text-[#10b981] focus:ring-[#10b981]"
              />
              <span className="text-sm font-inter text-black dark:text-white capitalize">
                {level === 'facil' ? 'Fácil' : level === 'media' ? 'Media' : 'Difícil'}
              </span>
            </label>
          ))}
        </div>
        {errors.difficulty && (
          <p className="text-red-500 text-sm mt-1 font-inter">{errors.difficulty.message}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Categorías
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-sm font-inter transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-[#10b981] text-white'
                  : 'bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] text-black dark:text-white hover:border-[#10b981]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Público/Privado */}
      <div className="flex items-center gap-2">
        <input
          {...register('is_public')}
          type="checkbox"
          id="is_public"
          className="w-4 h-4 text-[#10b981] rounded focus:ring-[#10b981]"
        />
        <label htmlFor="is_public" className="text-sm font-inter text-black dark:text-white">
          Hacer pública esta receta (otros usuarios podrán verla)
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-gradient-to-b from-[#10b981] to-[#059669] hover:from-[#0ea573] hover:to-[#047857] text-white py-3 rounded-lg font-semibold font-inter transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Guardando...' : initialData ? 'Actualizar Receta' : 'Guardar Receta'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="px-8 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg text-black dark:text-white font-semibold font-inter hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
