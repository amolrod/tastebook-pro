import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, User, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useUserStats } from '../../hooks/useUserStats';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading } = useUserProfile(user?.id);
  const { data: stats, isLoading: isLoadingStats } = useUserStats(user?.id);
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
  });

  // Sincronizar formData con profile cuando cargue
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile.mutateAsync(formData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-4xl font-bold border-4 border-white/30">
                {formData.full_name.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white text-green-600 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-white">
              {formData.full_name || 'Usuario'}
            </h1>
            <p className="mt-2 text-green-100">{user.email}</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid gap-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="text-3xl font-bold text-gray-900">
                {isLoadingStats ? '...' : stats?.recipesCount || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Recetas creadas</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="text-3xl font-bold text-gray-900">
                {isLoadingStats ? '...' : stats?.favoritesCount || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Favoritos</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="text-3xl font-bold text-gray-900">
                {isLoadingStats ? '...' : stats?.plansCount || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Planes creados</div>
            </div>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Información del perfil</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {isEditing ? (
                <>
                  <Input
                    label="Nombre completo"
                    leftIcon={<User className="w-5 h-5" />}
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Tu nombre completo"
                  />
                  <Input
                    label="Email"
                    type="email"
                    leftIcon={<Mail className="w-5 h-5" />}
                    value={user.email || ''}
                    disabled
                    helperText="El email no se puede cambiar"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biografía
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                      rows={4}
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Cuéntanos sobre ti..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleSave} 
                      className="flex-1"
                      isLoading={updateProfile.isPending}
                    >
                      Guardar cambios
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                      disabled={updateProfile.isPending}
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Nombre completo</div>
                      <div className="font-medium text-gray-900">
                        {formData.full_name || 'No especificado'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Email</div>
                      <div className="font-medium text-gray-900">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-600">Miembro desde</div>
                      <div className="font-medium text-gray-900">
                        {new Date(user.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  {formData.bio && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">Biografía</div>
                      <p className="text-gray-900">{formData.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Settings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                <div>
                  <div className="font-medium">Cerrar sesión</div>
                  <div className="text-sm text-red-500">
                    Salir de tu cuenta de Tastebook Pro
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
