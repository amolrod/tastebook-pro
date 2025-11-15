import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RecipeService } from '../lib/api/recipes';
import type {
  Recipe,
  RecipeFilters,
  CreateRecipeInput,
  UpdateRecipeInput,
  RecipeSortBy,
  SortOrder,
} from '../lib/api/recipes';

/**
 * Query keys para React Query.
 * Facilitan la invalidación y refetch de queries específicas.
 */
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (filters: RecipeFilters) => [...recipeKeys.lists(), filters] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};

/**
 * Hook para obtener lista de recetas con filtros opcionales.
 * 
 * Características:
 * - Cache automático con React Query
 * - Refetch en background
 * - Stale time de 5 minutos
 * - Estados: loading, error, success
 * 
 * @param filters - Filtros de búsqueda (opcionales)
 * @param sortBy - Campo por el que ordenar (default: 'created_at')
 * @param sortOrder - Orden ascendente o descendente (default: 'desc')
 * @param options - Opciones adicionales de React Query
 * 
 * @example
 * ```typescript
 * function RecipeList() {
 *   const { data: recipes, isLoading, error } = useRecipes();
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   
 *   return (
 *     <div>
 *       {recipes?.map(recipe => (
 *         <RecipeCard key={recipe.id} recipe={recipe} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Con filtros
 * const { data: veggieRecipes } = useRecipes({
 *   tags: ['vegetariano'],
 *   maxTime: 30
 * });
 * ```
 */
export function useRecipes(
  filters: RecipeFilters = {},
  sortBy: RecipeSortBy = 'created_at',
  sortOrder: SortOrder = 'desc',
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: recipeKeys.list(filters),
    queryFn: () => RecipeService.fetchRecipes(filters, sortBy, sortOrder),
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: true,
    ...options,
  });
}

/**
 * Hook para obtener una receta por su ID.
 * 
 * @param id - UUID de la receta
 * @param options - Opciones adicionales de React Query
 * 
 * @example
 * ```typescript
 * function RecipeDetail({ recipeId }: { recipeId: string }) {
 *   const { data: recipe, isLoading, error } = useRecipe(recipeId);
 *   
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *   if (!recipe) return <NotFound />;
 *   
 *   return (
 *     <div>
 *       <h1>{recipe.title}</h1>
 *       <p>{recipe.description}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useRecipe(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => RecipeService.fetchRecipeById(id),
    staleTime: 10 * 60 * 1000, // 10 minutos
    enabled: !!id && options?.enabled !== false,
  });
}

/**
 * Hook para crear una nueva receta.
 * 
 * Características:
 * - Optimistic update (UI se actualiza inmediatamente)
 * - Invalidación automática de lista de recetas
 * - Manejo de errores con rollback
 * 
 * @example
 * ```typescript
 * function CreateRecipeForm() {
 *   const createRecipe = useCreateRecipe();
 *   
 *   const handleSubmit = async (data: CreateRecipeInput) => {
 *     try {
 *       const newRecipe = await createRecipe.mutateAsync(data);
 *       navigate(`/recipe/${newRecipe.id}`);
 *       toast.success('Receta creada exitosamente');
 *     } catch (error) {
 *       toast.error('Error al crear receta');
 *     }
 *   };
 *   
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {/* form fields * /}
 *       <button type="submit" disabled={createRecipe.isPending}>
 *         {createRecipe.isPending ? 'Guardando...' : 'Crear receta'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRecipeInput) => RecipeService.createRecipe(input),
    onSuccess: (newRecipe) => {
      // Invalidar todas las listas de recetas para que se refresquen
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      
      // Añadir la receta al cache de detalle
      queryClient.setQueryData(recipeKeys.detail(newRecipe.id), newRecipe);
    },
    onError: (error) => {
      console.error('Error creating recipe:', error);
    },
  });
}

/**
 * Hook para actualizar una receta existente.
 * 
 * Características:
 * - Optimistic update
 * - Rollback en caso de error
 * - Invalidación de queries relacionadas
 * 
 * @example
 * ```typescript
 * function EditRecipeForm({ recipeId }: { recipeId: string }) {
 *   const updateRecipe = useUpdateRecipe();
 *   const { data: recipe } = useRecipe(recipeId);
 *   
 *   const handleSubmit = async (data: UpdateRecipeInput) => {
 *     try {
 *       await updateRecipe.mutateAsync({
 *         id: recipeId,
 *         data
 *       });
 *       toast.success('Receta actualizada');
 *     } catch (error) {
 *       toast.error('Error al actualizar');
 *     }
 *   };
 *   
 *   return <form onSubmit={handleSubmit}>{ /* form * / }</form>;
 * }
 * ```
 */
export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecipeInput }) =>
      RecipeService.updateRecipe(id, data),
    onMutate: async ({ id, data }) => {
      // Cancelar queries en curso para evitar sobrescribir optimistic update
      await queryClient.cancelQueries({ queryKey: recipeKeys.detail(id) });

      // Snapshot del valor anterior para rollback
      const previousRecipe = queryClient.getQueryData<Recipe>(recipeKeys.detail(id));

      // Optimistic update
      if (previousRecipe) {
        queryClient.setQueryData<Recipe>(recipeKeys.detail(id), {
          ...previousRecipe,
          ...data,
          updated_at: new Date().toISOString(),
        });
      }

      return { previousRecipe };
    },
    onError: (_error, { id }, context) => {
      // Rollback en caso de error
      if (context?.previousRecipe) {
        queryClient.setQueryData(recipeKeys.detail(id), context.previousRecipe);
      }
    },
    onSuccess: (updatedRecipe, { id }) => {
      // Actualizar cache con datos del servidor
      queryClient.setQueryData(recipeKeys.detail(id), updatedRecipe);
      
      // Invalidar listas para refrescar
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

/**
 * Hook para eliminar una receta.
 * 
 * Características:
 * - Optimistic update (elimina de UI inmediatamente)
 * - Rollback en caso de error
 * - Limpieza de cache
 * 
 * @example
 * ```typescript
 * function DeleteRecipeButton({ recipeId }: { recipeId: string }) {
 *   const deleteRecipe = useDeleteRecipe();
 *   
 *   const handleDelete = async () => {
 *     if (!confirm('¿Estás seguro de eliminar esta receta?')) return;
 *     
 *     try {
 *       await deleteRecipe.mutateAsync(recipeId);
 *       navigate('/recipes');
 *       toast.success('Receta eliminada');
 *     } catch (error) {
 *       toast.error('Error al eliminar');
 *     }
 *   };
 *   
 *   return (
 *     <button
 *       onClick={handleDelete}
 *       disabled={deleteRecipe.isPending}
 *     >
 *       {deleteRecipe.isPending ? 'Eliminando...' : 'Eliminar'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => RecipeService.deleteRecipe(id),
    onMutate: async (id) => {
      // Cancelar queries relacionadas
      await queryClient.cancelQueries({ queryKey: recipeKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: recipeKeys.lists() });

      // Snapshot para rollback
      const previousRecipe = queryClient.getQueryData<Recipe>(recipeKeys.detail(id));

      // Optimistic delete: remover de cache
      queryClient.removeQueries({ queryKey: recipeKeys.detail(id) });
      
      // Optimistic delete: remover de listas
      queryClient.setQueriesData<Recipe[]>(
        { queryKey: recipeKeys.lists() },
        (old) => old?.filter((recipe) => recipe.id !== id)
      );

      return { previousRecipe };
    },
    onError: (_error, id, context) => {
      // Rollback
      if (context?.previousRecipe) {
        queryClient.setQueryData(recipeKeys.detail(id), context.previousRecipe);
      }
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
    onSuccess: (_data, id) => {
      // Limpiar cache definitivamente
      queryClient.removeQueries({ queryKey: recipeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

/**
 * Hook para subir imagen de receta.
 * 
 * @example
 * ```typescript
 * function ImageUploader({ recipeId }: { recipeId?: string }) {
 *   const uploadImage = useUploadRecipeImage();
 *   
 *   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *     const file = e.target.files?.[0];
 *     if (!file) return;
 *     
 *     try {
 *       const imageUrl = await uploadImage.mutateAsync({ file, recipeId });
 *       console.log('Image uploaded:', imageUrl);
 *     } catch (error) {
 *       toast.error('Error al subir imagen');
 *     }
 *   };
 *   
 *   return (
 *     <input
 *       type="file"
 *       accept="image/*"
 *       onChange={handleFileChange}
 *       disabled={uploadImage.isPending}
 *     />
 *   );
 * }
 * ```
 */
export function useUploadRecipeImage() {
  return useMutation({
    mutationFn: ({ file, recipeId }: { file: File; recipeId?: string }) =>
      RecipeService.uploadRecipeImage(file, recipeId),
  });
}

/**
 * Hook compuesto que combina todos los hooks de recetas.
 * Útil cuando necesitas múltiples operaciones en un mismo componente.
 * 
 * @param filters - Filtros para la lista de recetas
 * 
 * @example
 * ```typescript
 * function RecipeManager() {
 *   const {
 *     recipes,
 *     isLoading,
 *     createRecipe,
 *     updateRecipe,
 *     deleteRecipe,
 *   } = useRecipesActions();
 *   
 *   // Acceso a todos los métodos CRUD
 * }
 * ```
 */
export function useRecipesActions(filters: RecipeFilters = {}) {
  const recipesQuery = useRecipes(filters);
  const createMutation = useCreateRecipe();
  const updateMutation = useUpdateRecipe();
  const deleteMutation = useDeleteRecipe();
  const uploadImageMutation = useUploadRecipeImage();

  return {
    // Query data
    recipes: recipesQuery.data,
    isLoading: recipesQuery.isLoading,
    error: recipesQuery.error,
    
    // Refetch manual
    refetch: recipesQuery.refetch,
    
    // Mutations
    createRecipe: createMutation.mutateAsync,
    updateRecipe: updateMutation.mutateAsync,
    deleteRecipe: deleteMutation.mutateAsync,
    uploadImage: uploadImageMutation.mutateAsync,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploading: uploadImageMutation.isPending,
  };
}
