import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface UploadAvatarData {
  file: File;
  userId: string;
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, userId }: UploadAvatarData) => {
      // Validar tamaño (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('La imagen debe pesar menos de 2MB');
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      // TEMPORALMENTE: Convertir imagen a base64 y guardar en la BD
      // TODO: Cuando se configure Storage en Supabase, cambiar a usar bucket
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Image = await base64Promise;

      // Actualizar usuario con base64
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: base64Image })
        .eq('id', userId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      return base64Image;
    },
    onSuccess: () => {
      toast.success('Avatar actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: Error) => {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Error al subir el avatar');
    },
  });
}
