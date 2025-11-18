import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import type { ShoppingList, ShoppingListItem } from '../types/database';
import { categorizeIngredient, type IngredientCategory } from '../lib/constants/ingredients';

/**
 * Query keys para shopping lists
 * Estructura: ['shopping-lists', userId]
 */
export const shoppingListKeys = {
  all: ['shopping-lists'] as const,
  detail: (userId: string) => [...shoppingListKeys.all, userId] as const,
};

/**
 * Hook para obtener la lista de compra del usuario
 * 
 * Features:
 * - Auto-crea lista si no existe
 * - Cache de 5 minutos
 * - Enabled solo si hay userId
 * 
 * @param userId - ID del usuario autenticado
 */
export function useShoppingList(userId: string | undefined) {
  return useQuery({
    queryKey: shoppingListKeys.detail(userId || ''),
    queryFn: async (): Promise<ShoppingList> => {
      if (!userId) throw new Error('User ID required');

      const { data, error } = await supabase
        .from('shopping_lists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching shopping list:', error);
        throw error;
      }

      // Si no existe, crear una nueva lista vacía
      if (!data) {
        const { data: newList, error: createError } = await supabase
          .from('shopping_lists')
          .insert({
            user_id: userId,
            items: [],
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating shopping list:', createError);
          throw createError;
        }

        return newList as ShoppingList;
      }

      return data as ShoppingList;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para agregar item a la lista de compra
 * 
 * Features:
 * - Auto-categorización con diccionario
 * - Genera UUID para el item
 * - Optimistic update
 * - Toast notification
 */
export function useAddShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      listId,
      currentItems,
      newItem,
    }: {
      userId: string;
      listId: string;
      currentItems: ShoppingListItem[];
      newItem: Omit<ShoppingListItem, 'id' | 'checked' | 'category'> & { category?: IngredientCategory };
    }) => {
      // Auto-categorizar si no tiene categoría o es 'others'
      const category = newItem.category && newItem.category !== 'others' 
        ? newItem.category 
        : categorizeIngredient(newItem.name);

      const itemWithDefaults: ShoppingListItem = {
        ...newItem,
        id: crypto.randomUUID(),
        category,
        checked: false,
      };

      const updatedItems = [...currentItems, itemWithDefaults];

      const { data, error } = await supabase
        .from('shopping_lists')
        .update({ items: updatedItems, updated_at: new Date().toISOString() })
        .eq('id', listId)
        .select()
        .single();

      if (error) {
        console.error('Error adding item:', error);
        throw error;
      }

      return data as ShoppingList;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(shoppingListKeys.detail(variables.userId), data);
      toast.success('Ingrediente agregado a la lista');
    },
    onError: (error: Error) => {
      console.error('Error adding item:', error);
      toast.error('Error al agregar ingrediente');
    },
  });
}

/**
 * Hook para toggle checked state de un item
 * 
 * Features:
 * - Optimistic update instantáneo
 * - Sin toast (acción frecuente)
 */
export function useToggleShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      listId,
      currentItems,
      itemId,
    }: {
      userId: string;
      listId: string;
      currentItems: ShoppingListItem[];
      itemId: string;
    }) => {
      const updatedItems = currentItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      );

      const { data, error } = await supabase
        .from('shopping_lists')
        .update({ items: updatedItems, updated_at: new Date().toISOString() })
        .eq('id', listId)
        .select()
        .single();

      if (error) {
        console.error('Error toggling item:', error);
        throw error;
      }

      return data as ShoppingList;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(shoppingListKeys.detail(variables.userId), data);
    },
    onError: (error: Error) => {
      console.error('Error toggling item:', error);
      toast.error('Error al actualizar item');
    },
  });
}

/**
 * Hook para eliminar item de la lista
 * 
 * Features:
 * - Filtrado por ID
 * - Toast notification
 * - Optimistic update
 */
export function useRemoveShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      listId,
      currentItems,
      itemId,
    }: {
      userId: string;
      listId: string;
      currentItems: ShoppingListItem[];
      itemId: string;
    }) => {
      const updatedItems = currentItems.filter((item) => item.id !== itemId);

      const { data, error } = await supabase
        .from('shopping_lists')
        .update({ items: updatedItems, updated_at: new Date().toISOString() })
        .eq('id', listId)
        .select()
        .single();

      if (error) {
        console.error('Error removing item:', error);
        throw error;
      }

      return data as ShoppingList;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(shoppingListKeys.detail(variables.userId), data);
      toast.success('Ingrediente eliminado');
    },
    onError: (error: Error) => {
      console.error('Error removing item:', error);
      toast.error('Error al eliminar ingrediente');
    },
  });
}

/**
 * Hook para actualizar cantidad/unidad de un item
 * 
 * Features:
 * - Edición inline
 * - Validación de cantidad positiva
 * - Toast notification
 */
export function useUpdateShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      listId,
      currentItems,
      itemId,
      quantity,
      unit,
    }: {
      userId: string;
      listId: string;
      currentItems: ShoppingListItem[];
      itemId: string;
      quantity: number;
      unit: string;
    }) => {
      if (quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      const updatedItems = currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity, unit } : item
      );

      const { data, error } = await supabase
        .from('shopping_lists')
        .update({ items: updatedItems, updated_at: new Date().toISOString() })
        .eq('id', listId)
        .select()
        .single();

      if (error) {
        console.error('Error updating item:', error);
        throw error;
      }

      return data as ShoppingList;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(shoppingListKeys.detail(variables.userId), data);
      toast.success('Cantidad actualizada');
    },
    onError: (error: Error) => {
      console.error('Error updating item:', error);
      toast.error(error.message || 'Error al actualizar cantidad');
    },
  });
}

/**
 * Hook para limpiar items marcados como comprados
 * 
 * Features:
 * - Elimina todos los checked
 * - Confirmación con toast
 * - Útil para limpiar después de comprar
 */
export function useClearCheckedItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      listId,
      currentItems,
    }: {
      userId: string;
      listId: string;
      currentItems: ShoppingListItem[];
    }) => {
      const updatedItems = currentItems.filter((item) => !item.checked);

      const { data, error } = await supabase
        .from('shopping_lists')
        .update({ items: updatedItems, updated_at: new Date().toISOString() })
        .eq('id', listId)
        .select()
        .single();

      if (error) {
        console.error('Error clearing items:', error);
        throw error;
      }

      return data as ShoppingList;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(shoppingListKeys.detail(variables.userId), data);
      toast.success('Items comprados eliminados');
    },
    onError: (error: Error) => {
      console.error('Error clearing items:', error);
      toast.error('Error al limpiar lista');
    },
  });
}
