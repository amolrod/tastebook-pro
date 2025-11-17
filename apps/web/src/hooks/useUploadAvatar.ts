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

      // Generar nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      // Eliminar avatar anterior si existe
      const { data: profile } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (profile?.avatar_url && profile.avatar_url.includes('supabase.co/storage')) {
        // Extraer nombre del archivo de la URL de storage
        const urlParts = profile.avatar_url.split('/');
        const oldFileName = urlParts[urlParts.length - 1];
        if (oldFileName && oldFileName.includes(userId)) {
          await supabase.storage.from('avatars').remove([oldFileName]);
        }
      }

      // Subir nueva imagen al bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Actualizar usuario
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      return publicUrl;
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
