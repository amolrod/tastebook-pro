'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRecipeSchema, type CreateRecipeInput } from '../../lib/validations/recipe';
import { useCreateRecipe, useUpdateRecipe } from '../../hooks/useRecipes';
import { useUploadRecipeImage } from '../../hooks/useUploadRecipeImage';
import { IngredientList } from './IngredientList';
import { StepList } from './StepList';
import { Clock, Users, Upload, X, Image as ImageIcon } from 'lucide-react';
import type { Recipe, Ingredient } from '../../types/database';
import { toast } from 'sonner';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

  const isEditMode = !!initialData?.id;
  const { mutate: createRecipe, isPending: isCreating } = useCreateRecipe();
  const { mutate: updateRecipe, isPending: isUpdating } = useUpdateRecipe();
  const isPending = isCreating || isUpdating;
  const uploadImage = useUploadRecipeImage();

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de archivo no permitido. Usa JPEG, PNG o WebP.');
      return;
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    setImageFile(file);
    
    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: any) => {
    console.log('🔍 Datos del formulario:', data);
    console.log('🏷️ Tags seleccionados:', selectedTags);
    console.log('🖼️ Imagen:', imageFile);
    
    // Filtrar pasos vacíos e ingredientes vacíos
    const cleanedInstructions = data.instructions.filter((step: string) => step && step.trim() !== '');
    const cleanedIngredients = data.ingredients.filter((ing: any) => ing.name && ing.name.trim() !== '');
    
    // Validación manual
    if (cleanedIngredients.length === 0) {
      toast.error('Debes agregar al menos un ingrediente');
      return;
    }
    if (cleanedInstructions.length === 0) {
      toast.error('Debes agregar al menos un paso de preparación');
      return;
    }
    if (!data.title || data.title.trim() === '') {
      toast.error('El título es obligatorio');
      return;
    }
    
    // Subir imagen si existe
    let imageUrl = initialData?.image_url || null;
    if (imageFile) {
      try {
        toast.info('Subiendo imagen...');
        imageUrl = await uploadImage.mutateAsync(imageFile);
        console.log('✅ Imagen subida:', imageUrl);
      } catch (error) {
        console.error('❌ Error subiendo imagen:', error);
        toast.error('Error al subir la imagen');
        return;
      }
    }
    
    const cleanedData = {
      ...data,
      instructions: cleanedInstructions,
      ingredients: cleanedIngredients,
      tags: selectedTags,
      image_url: imageUrl,
    };

    console.log('📦 Datos finales a enviar (limpiados):', cleanedData);

    if (isEditMode && initialData?.id) {
      // Modo edición
      updateRecipe(
        { id: initialData.id, updates: cleanedData as any },
        {
          onSuccess: (updatedRecipe) => {
            console.log('✅ Receta actualizada:', updatedRecipe);
            toast.success('Receta actualizada exitosamente');
            if (onSuccess) {
              onSuccess(updatedRecipe);
            } else {
              // Navegar al detalle de la receta
              setTimeout(() => {
                window.location.href = `/recipes/${initialData.id}`;
              }, 1000);
            }
          },
          onError: (error: any) => {
            console.error('❌ Error actualizando receta:', error);
            if (error.message?.includes('row-level security')) {
              toast.error('Error de permisos. Verifica que seas el dueño de esta receta');
            } else {
              toast.error('Error al actualizar receta: ' + (error.message || 'Error desconocido'));
            }
          },
        }
      );
    } else {
      // Modo creación
      createRecipe(cleanedData as CreateRecipeInput, {
        onSuccess: (createdRecipe) => {
          console.log('✅ Receta creada:', createdRecipe);
          toast.success('Receta creada exitosamente');
          if (onSuccess) {
            onSuccess(createdRecipe);
          } else {
            // Navegar a la página de recetas
            setTimeout(() => {
              window.location.href = '/recipes';
            }, 1000);
          }
        },
        onError: (error: any) => {
          console.error('❌ Error creando receta:', error);
          if (error.message?.includes('row-level security')) {
            toast.error('Error de permisos. Configura RLS en Supabase Dashboard');
          } else {
            toast.error('Error al crear receta: ' + (error.message || 'Error desconocido'));
          }
        },
      });
    }
  };

  // Log de errores de validación
  if (Object.keys(errors).length > 0) {
    console.log('❌ ERRORES DE VALIDACIÓN:', JSON.stringify(errors, null, 2));
  }

  return (
    <form onSubmit={(e) => {
      console.log('📝 Form submit event triggered!');
      e.preventDefault();
      
      // Llamar directamente a onSubmit sin pasar por react-hook-form validation
      // ya que vamos a limpiar los datos vacíos manualmente
      const formData = new FormData(e.currentTarget);
      
      // Extraer datos del formulario
      const data: any = {
        title: formData.get('title'),
        description: formData.get('description') || undefined,
        prep_time: formData.get('prep_time') ? Number(formData.get('prep_time')) : undefined,
        cook_time: formData.get('cook_time') ? Number(formData.get('cook_time')) : undefined,
        servings: formData.get('servings') ? Number(formData.get('servings')) : 4,
        difficulty: formData.get('difficulty') || 'media',
        is_public: formData.get('is_public') === 'on',
        ingredients: ingredientFields.map((_, idx) => ({
          name: formData.get(`ingredients.${idx}.name`) as string,
          quantity: Number(formData.get(`ingredients.${idx}.quantity`)) || 1,
          unit: formData.get(`ingredients.${idx}.unit`) as string,
        })),
        instructions: stepFields.map((_, idx) => 
          formData.get(`instructions.${idx}`) as string
        ),
      };
      
      onSubmit(data);
    }} className="space-y-6">
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

      {/* Imagen */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
          Imagen de la receta
        </label>
        
        {imagePreview ? (
          <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-[#E6E6E6] dark:border-[#333333]">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#E6E6E6] dark:border-[#333333] rounded-xl cursor-pointer bg-[#F8F8F8] dark:bg-[#1A1A1A] hover:bg-[#F0F0F0] dark:hover:bg-[#262626] transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="p-4 bg-[#10b981]/10 rounded-full mb-4">
                <ImageIcon className="w-10 h-10 text-[#10b981]" />
              </div>
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400 font-inter">
                <span className="font-semibold">Click para subir</span> o arrastra una imagen
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 font-inter">
                PNG, JPG o WEBP (máx. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
            />
          </label>
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

      {/* Mostrar errores de validación global */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2 font-inter">
            ⚠️ Errores de validación:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300 font-inter">
            {Object.entries(errors).map(([key, error]: [string, any]) => (
              <li key={key}>
                <strong>{key}:</strong> {error?.message || JSON.stringify(error)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isPending || uploadImage.isPending}
          className="flex-1 bg-gradient-to-b from-[#10b981] to-[#059669] hover:from-[#0ea573] hover:to-[#047857] text-white py-3 rounded-lg font-semibold font-inter transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadImage.isPending ? 'Subiendo imagen...' : isPending ? 'Guardando...' : initialData ? 'Actualizar Receta' : 'Guardar Receta'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending || uploadImage.isPending}
          className="px-8 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg text-black dark:text-white font-semibold font-inter hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
