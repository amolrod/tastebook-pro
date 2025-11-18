import { supabase } from '../supabase';
import type { Recipe, Ingredient } from '../../types/database';
import { normalizeIngredientName } from '../constants/ingredients';

export interface RecipeMatch {
  recipe: Recipe;
  matchPercentage: number;
  matchingIngredients: string[];
  missingIngredients: Ingredient[];
  totalIngredients: number;
}

/**
 * IngredientMatcherService - Encuentra recetas según ingredientes disponibles
 */
export const IngredientMatcherService = {
  /**
   * Buscar recetas que coincidan con ingredientes seleccionados
   */
  async findMatchingRecipes(
    selectedIngredients: string[],
    limit: number = 10,
    minMatchPercentage: number = 0
  ): Promise<RecipeMatch[]> {
    // Normalizar ingredientes seleccionados
    const normalizedSelected = selectedIngredients.map(normalizeIngredientName);

    // Obtener todas las recetas públicas
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)
      .order('rating_avg', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }

    if (!recipes) return [];

    // Calcular matches para cada receta
    const matches: RecipeMatch[] = recipes.map(recipe => {
      const recipeIngredients = (recipe.ingredients as Ingredient[]) || [];
      const totalIngredients = recipeIngredients.length;

      if (totalIngredients === 0) {
        return {
          recipe,
          matchPercentage: 0,
          matchingIngredients: [],
          missingIngredients: recipeIngredients,
          totalIngredients: 0
        };
      }

      // Encontrar ingredientes que coinciden
      const matchingIngredients: string[] = [];
      const missingIngredients: Ingredient[] = [];

      recipeIngredients.forEach(ing => {
        const normalizedIngName = normalizeIngredientName(ing.name);
        
        // Verificar si algún ingrediente seleccionado coincide
        const hasMatch = normalizedSelected.some(selected => {
          return (
            normalizedIngName.includes(selected) ||
            selected.includes(normalizedIngName) ||
            normalizedIngName === selected
          );
        });

        if (hasMatch) {
          matchingIngredients.push(ing.name);
        } else {
          missingIngredients.push(ing);
        }
      });

      const matchPercentage = (matchingIngredients.length / totalIngredients) * 100;

      return {
        recipe,
        matchPercentage,
        matchingIngredients,
        missingIngredients,
        totalIngredients
      };
    });

    // Filtrar por porcentaje mínimo y ordenar
    return matches
      .filter(m => m.matchPercentage >= minMatchPercentage)
      .sort((a, b) => {
        // Primero por porcentaje de match
        if (b.matchPercentage !== a.matchPercentage) {
          return b.matchPercentage - a.matchPercentage;
        }
        // Luego por rating
        return (b.recipe.rating_avg || 0) - (a.recipe.rating_avg || 0);
      })
      .slice(0, limit);
  },

  /**
   * Obtener lista de ingredientes comunes para sugerencias
   */
  async getCommonIngredients(limit: number = 50): Promise<string[]> {
    const { data: recipes } = await supabase
      .from('recipes')
      .select('ingredients')
      .eq('is_public', true)
      .limit(100);

    if (!recipes) return [];

    // Contar frecuencia de cada ingrediente
    const ingredientFrequency = new Map<string, number>();

    recipes.forEach(recipe => {
      const ingredients = (recipe.ingredients as Ingredient[]) || [];
      ingredients.forEach(ing => {
        const normalized = normalizeIngredientName(ing.name);
        ingredientFrequency.set(
          normalized,
          (ingredientFrequency.get(normalized) || 0) + 1
        );
      });
    });

    // Ordenar por frecuencia y retornar top N
    return Array.from(ingredientFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([ingredient]) => ingredient);
  }
};
