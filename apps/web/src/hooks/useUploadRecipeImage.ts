import { useMutation } from '@tanstack/react-query';
import { RecipeService } from '../lib/api/recipes';
import { toast } from 'sonner';

/**
 * Hook para subir imágenes de recetas a Supabase Storage
 * 
 * @returns Mutation de React Query con helpers de carga
 * 
 * @example
 * ```tsx
 * const uploadImage = useUploadRecipeImage();
 * 
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     const url = await uploadImage.mutateAsync(file);
 *     console.log('Image URL:', url);
 *   }
 * };
 * ```
 */
export function useUploadRecipeImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const url = await RecipeService.uploadRecipeImage(file);
      return url;
    },
    onError: (error: Error) => {
      console.error('Error uploading recipe image:', error);
      toast.error(error.message || 'Error al subir la imagen');
    },
  });
}
