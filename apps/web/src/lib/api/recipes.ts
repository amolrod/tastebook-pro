import { supabase } from '../supabase';
import type { Database, Recipe, Ingredient, Nutrition, RecipeDifficulty } from '../../types/database';

// Re-exportar tipos para uso externo
export type {
  Recipe,
  Ingredient,
  Nutrition,
  RecipeDifficulty,
} from '../../types/database';

/**
 * Tipos de input para operaciones CRUD
 */

/**
 * Filtros para búsqueda de recetas
 */
export interface RecipeFilters {
  /** Búsqueda por texto en título y descripción */
  search?: string;
  /** Filtrar por tags específicos */
  tags?: string[];
  /** Tiempo máximo de preparación + cocción (minutos) */
  maxTime?: number;
  /** Nivel de dificultad */
  difficulty?: 'facil' | 'media' | 'dificil';
  /** Calorías máximas por porción */
  maxCalories?: number;
  /** Solo recetas públicas */
  isPublic?: boolean;
  /** Usuario específico (para ver recetas propias) */
  userId?: string;
}

/**
 * Input para crear una nueva receta
 */
export type CreateRecipeInput = Omit<
  Database['public']['Tables']['recipes']['Insert'],
  'id' | 'created_at' | 'updated_at' | 'views_count' | 'favorites_count' | 'rating_avg' | 'rating_count' | 'user_id'
>;

/**
 * Input para actualizar una receta existente
 */
export type UpdateRecipeInput = Partial<CreateRecipeInput>;

/**
 * Opciones de ordenamiento
 */
export type RecipeSortBy = 'created_at' | 'rating_avg' | 'views_count' | 'favorites_count';
export type SortOrder = 'asc' | 'desc';

/**
 * RecipeService - Servicio para todas las operaciones CRUD de recetas.
 * 
 * Proporciona métodos para:
 * - Listar y buscar recetas con filtros avanzados
 * - Obtener detalles de una receta específica
 * - Crear nuevas recetas
 * - Actualizar recetas existentes
 * - Eliminar recetas
 * - Subir imágenes a Supabase Storage
 * 
 * Todos los métodos manejan errores y devuelven promesas tipadas.
 */
export const RecipeService = {
  /**
   * Obtener lista de recetas con filtros opcionales.
   * 
   * @param filters - Filtros de búsqueda (opcionales)
   * @param sortBy - Campo por el que ordenar (default: 'created_at')
   * @param sortOrder - Orden ascendente o descendente (default: 'desc')
   * @returns Promise con array de recetas
   * 
   * @example
   * ```typescript
   * // Obtener todas las recetas públicas
   * const recipes = await RecipeService.fetchRecipes();
   * 
   * // Buscar recetas vegetarianas de menos de 30 minutos
   * const quickVeggieRecipes = await RecipeService.fetchRecipes({
   *   tags: ['vegetariano'],
   *   maxTime: 30
   * });
   * 
   * // Buscar por texto
   * const results = await RecipeService.fetchRecipes({
   *   search: 'pasta'
   * });
   * ```
   */
  async fetchRecipes(
    filters: RecipeFilters = {},
    sortBy: RecipeSortBy = 'created_at',
    sortOrder: SortOrder = 'desc'
  ): Promise<Recipe[]> {
    try {
      // Construir query base
      let query = supabase
        .from('recipes')
        .select('*');

      // Aplicar filtro de recetas públicas o del usuario
      if (filters.isPublic !== false) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        } else {
          // Por defecto, mostrar públicas o del usuario autenticado
          if (user) {
            query = query.or(`is_public.eq.true,user_id.eq.${user.id}`);
          } else {
            query = query.eq('is_public', true);
          }
        }
      }

      // Filtro por tags
      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      // Filtro por dificultad
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      // Filtro por búsqueda de texto
      if (filters.search) {
        // Búsqueda full-text en PostgreSQL
        query = query.textSearch('title', filters.search, {
          type: 'websearch',
          config: 'spanish',
        });
      }

      // Ordenamiento
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Ejecutar query
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recipes:', error);
        throw new Error(`Error al obtener recetas: ${error.message}`);
      }

      // Filtrar por tiempo total (en memoria, ya que es suma de campos)
      let recipes = data as Recipe[];
      
      if (filters.maxTime) {
        recipes = recipes.filter((recipe) => {
          const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
          return totalTime <= filters.maxTime!;
        });
      }

      // Filtrar por calorías (en memoria, campo JSON)
      if (filters.maxCalories) {
        recipes = recipes.filter((recipe) => {
          const nutrition = recipe.nutrition as { calories?: number };
          return !nutrition.calories || nutrition.calories <= filters.maxCalories!;
        });
      }

      return recipes;
    } catch (error) {
      console.error('Error in fetchRecipes:', error);
      throw error;
    }
  },

  /**
   * Obtener una receta por su ID.
   * 
   * @param id - UUID de la receta
   * @returns Promise con la receta o null si no existe
   * 
   * @example
   * ```typescript
   * const recipe = await RecipeService.fetchRecipeById('uuid-here');
   * if (recipe) {
   *   console.log(recipe.title);
   * }
   * ```
   */
  async fetchRecipeById(id: string): Promise<Recipe | null> {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No encontrado
          return null;
        }
        console.error('Error fetching recipe by ID:', error);
        throw new Error(`Error al obtener receta: ${error.message}`);
      }

      // Incrementar contador de vistas
      await supabase
        .from('recipes')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id);

      return data as Recipe;
    } catch (error) {
      console.error('Error in fetchRecipeById:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva receta.
   * 
   * @param input - Datos de la receta a crear
   * @returns Promise con la receta creada
   * 
   * @example
   * ```typescript
   * const newRecipe = await RecipeService.createRecipe({
   *   user_id: 'user-uuid',
   *   title: 'Pasta Carbonara',
   *   description: 'Receta italiana clásica',
   *   ingredients: [
   *     { name: 'Pasta', quantity: 400, unit: 'g', category: 'Despensa' },
   *     { name: 'Huevos', quantity: 3, unit: 'unidad', category: 'Lácteos' }
   *   ],
   *   instructions: [
   *     'Hervir agua con sal',
   *     'Cocinar pasta 8-10 minutos',
   *     'Mezclar con huevos batidos'
   *   ],
   *   prep_time: 10,
   *   cook_time: 15,
   *   servings: 4,
   *   difficulty: 'media',
   *   is_public: true,
   *   tags: ['italiana', 'pasta']
   * });
   * ```
   */
  async createRecipe(input: CreateRecipeInput): Promise<Recipe> {
    try {
      // Obtener usuario autenticado si existe
      const { data: { user } } = await supabase.auth.getUser();
      
      // Preparar el input - solo incluir user_id si hay sesión
      const recipeInput = user?.id 
        ? { ...input, user_id: user.id }
        : input; // Sin user_id para desarrollo (será NULL en la DB)

      const { data, error } = await supabase
        .from('recipes')
        .insert(recipeInput)
        .select()
        .single();

      if (error) {
        console.error('Error creating recipe:', error);
        throw new Error(`Error al crear receta: ${error.message}`);
      }

      return data as Recipe;
    } catch (error) {
      console.error('Error in createRecipe:', error);
      throw error;
    }
  },

  /**
   * Actualizar una receta existente.
   * 
   * @param id - UUID de la receta a actualizar
   * @param input - Campos a actualizar (parcial)
   * @returns Promise con la receta actualizada
   * 
   * @example
   * ```typescript
   * const updated = await RecipeService.updateRecipe('recipe-uuid', {
   *   title: 'Nuevo título',
   *   is_public: true
   * });
   * ```
   */
  async updateRecipe(id: string, input: UpdateRecipeInput): Promise<Recipe> {
    try {
      // Validar que el usuario esté autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Debes estar autenticado para actualizar una receta');
      }

      // Verificar que la receta pertenece al usuario
      const existing = await this.fetchRecipeById(id);
      if (!existing) {
        throw new Error('Receta no encontrada');
      }
      
      if (existing.user_id !== user.id) {
        throw new Error('No tienes permisos para actualizar esta receta');
      }

      const { data, error } = await supabase
        .from('recipes')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating recipe:', error);
        throw new Error(`Error al actualizar receta: ${error.message}`);
      }

      return data as Recipe;
    } catch (error) {
      console.error('Error in updateRecipe:', error);
      throw error;
    }
  },

  /**
   * Eliminar una receta.
   * 
   * @param id - UUID de la receta a eliminar
   * @returns Promise<void>
   * 
   * @example
   * ```typescript
   * await RecipeService.deleteRecipe('recipe-uuid');
   * ```
   */
  async deleteRecipe(id: string): Promise<void> {
    try {
      // Validar que el usuario esté autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Debes estar autenticado para eliminar una receta');
      }

      // Verificar que la receta pertenece al usuario
      const existing = await this.fetchRecipeById(id);
      if (!existing) {
        throw new Error('Receta no encontrada');
      }
      
      if (existing.user_id !== user.id) {
        throw new Error('No tienes permisos para eliminar esta receta');
      }

      // Eliminar imagen de Storage si existe
      if (existing.image_url) {
        const imagePath = existing.image_url.split('/').pop();
        if (imagePath) {
          await supabase.storage
            .from('recipe-images')
            .remove([`${user.id}/${imagePath}`]);
        }
      }

      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting recipe:', error);
        throw new Error(`Error al eliminar receta: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteRecipe:', error);
      throw error;
    }
  },

  /**
   * Subir imagen de receta a Supabase Storage.
   * 
   * @param file - Archivo de imagen (File object)
   * @param recipeId - UUID de la receta (opcional, se genera si no existe)
   * @returns Promise con URL pública de la imagen
   * 
   * @example
   * ```typescript
   * const imageUrl = await RecipeService.uploadRecipeImage(fileInput.files[0]);
   * // Usar imageUrl en createRecipe o updateRecipe
   * ```
   */
  async uploadRecipeImage(file: File, recipeId?: string): Promise<string> {
    try {
      // Validar que el usuario esté autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Debes estar autenticado para subir imágenes');
      }

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de archivo no permitido. Usa JPEG, PNG o WebP.');
      }

      // Validar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('El archivo es demasiado grande. Máximo 5MB.');
      }

      // Generar nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${recipeId || Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Subir a Storage
      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Error al subir imagen: ${uploadError.message}`);
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadRecipeImage:', error);
      throw error;
    }
  },
};
