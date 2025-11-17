import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Mail,
  User,
  Calendar,
  Settings,
  LogOut,
  Edit2,
  Check,
  X,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Heart,
  ChefHat,
  Flame,
  Target,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useUserStats } from '../../hooks/useUserStats';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { useUploadAvatar } from '../../hooks/useUploadAvatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router';

type TabType = 'overview' | 'recipes' | 'achievements';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useUserProfile(user?.id);
  const { data: stats, isLoading: isLoadingStats } = useUserStats(user?.id);
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
  });

  // Sincronizar formData con profile
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
      });
    }
  }, [profile]);

  const handleSaveName = async () => {
    await updateProfile.mutateAsync({ full_name: formData.full_name });
    setIsEditingName(false);
  };

  const handleSaveBio = async () => {
    await updateProfile.mutateAsync({ bio: formData.bio });
    setIsEditingBio(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user?.id) {
      uploadAvatar.mutate({ file, userId: user.id });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  const displayName = formData.full_name || 'Usuario';
  const displayBio = formData.bio || '';

  return (
    <div className="min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Hero Section con Cover + Avatar */}
      <div className="relative">
        {/* Cover Image con Gradiente */}
        <div className="h-64 bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] relative overflow-hidden">
          {/* Pattern decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          </div>

          {/* Iconos decorativos flotantes */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-12 right-24 text-white/20"
            >
              <ChefHat size={48} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-12 left-24 text-white/20"
            >
              <BookOpen size={40} />
            </motion.div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-32 pb-8">
            {/* Card con Avatar y Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl p-8 mb-6"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="relative group">
                  <div className="relative">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={displayName}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-white dark:ring-[#333333]"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center text-white text-5xl font-bold ring-4 ring-white dark:ring-[#333333]">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Upload Button */}
                    <button
                      onClick={handleAvatarClick}
                      disabled={uploadAvatar.isPending}
                      className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#10b981] text-white flex items-center justify-center shadow-lg hover:bg-[#059669] transition-all transform hover:scale-110 disabled:opacity-50"
                    >
                      {uploadAvatar.isPending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Info Personal */}
                <div className="flex-1 text-center md:text-left">
                  {/* Nombre */}
                  <div className="mb-3">
                    {isEditingName ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({ ...formData, full_name: e.target.value })
                          }
                          placeholder="Tu nombre"
                          className="max-w-md"
                        />
                        <Button
                          size="sm"
                          onClick={handleSaveName}
                          disabled={updateProfile.isPending}
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingName(false)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                        <h1 className="text-3xl font-bold text-black dark:text-white font-sora">
                          {displayName}
                        </h1>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="p-2 text-gray-400 hover:text-[#10b981] transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626]"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="mb-4">
                    {isEditingBio ? (
                      <div className="flex items-start gap-2">
                        <textarea
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData({ ...formData, bio: e.target.value })
                          }
                          placeholder="Cuéntanos sobre ti..."
                          rows={3}
                          className="flex-1 max-w-2xl px-4 py-2 border border-gray-200 dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-black dark:text-white font-inter resize-none focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                        />
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={handleSaveBio}
                            disabled={updateProfile.isPending}
                          >
                            <Check size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditingBio(false)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : displayBio ? (
                      <div className="flex items-start gap-3 justify-center md:justify-start">
                        <p className="text-gray-600 dark:text-gray-400 font-inter max-w-2xl">
                          {displayBio}
                        </p>
                        <button
                          onClick={() => setIsEditingBio(true)}
                          className="p-2 text-gray-400 hover:text-[#10b981] transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626]"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsEditingBio(true)}
                        className="text-gray-400 hover:text-[#10b981] font-inter text-sm flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        Agregar biografía
                      </button>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 justify-center md:justify-start">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-[#10b981]" />
                      <span className="font-inter">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#10b981]" />
                      <span className="font-inter">
                        Miembro desde{' '}
                        {new Date(profile?.created_at || '').toLocaleDateString('es-ES', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    <Settings size={16} className="mr-2" />
                    Configuración
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-[#333333]">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-[#10b981]/10">
                    <BookOpen size={24} className="text-[#10b981]" />
                  </div>
                  <p className="text-3xl font-bold text-black dark:text-white font-sora">
                    {isLoadingStats ? '...' : stats?.recipesCount || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mt-1">
                    Recetas
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-[#ff6b35]/10">
                    <Heart size={24} className="text-[#ff6b35]" />
                  </div>
                  <p className="text-3xl font-bold text-black dark:text-white font-sora">
                    {isLoadingStats ? '...' : stats?.favoritesCount || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mt-1">
                    Favoritos
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-[#f7931e]/10">
                    <Target size={24} className="text-[#f7931e]" />
                  </div>
                  <p className="text-3xl font-bold text-black dark:text-white font-sora">
                    {isLoadingStats ? '...' : stats?.plansCount || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mt-1">
                    Planes
                  </p>
                </motion.div>


              </div>
              </motion.div>

            {/* Tabs Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-2 mb-6"
            >
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold font-inter transition-all ${
                    activeTab === 'overview'
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262626]'
                  }`}
                >
                  <TrendingUp size={18} className="inline mr-2" />
                  Resumen
                </button>
                <button
                  onClick={() => setActiveTab('recipes')}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold font-inter transition-all ${
                    activeTab === 'recipes'
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262626]'
                  }`}
                >
                  <ChefHat size={18} className="inline mr-2" />
                  Mis Recetas
                </button>
                <button
                  onClick={() => setActiveTab('achievements')}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold font-inter transition-all ${
                    activeTab === 'achievements'
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262626]'
                  }`}
                >
                  <Award size={18} className="inline mr-2" />
                  Logros
                </button>
              </div>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                  {/* Actividad Reciente */}
                  <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-black dark:text-white font-sora mb-6 flex items-center gap-2">
                      <Clock size={24} className="text-[#10b981]" />
                      Actividad Reciente
                    </h2>
                    <div className="text-center py-12">
                      <Clock size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 font-inter">
                        Tu actividad aparecerá aquí cuando empieces a usar la app
                      </p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-6">
                    {/* Resumen Rápido */}
                    <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl shadow-lg p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold font-sora">Tu Actividad</h3>
                        <TrendingUp size={24} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-sm font-inter">Recetas creadas</span>
                          <span className="text-2xl font-bold font-sora">{stats?.recipesCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-sm font-inter">Favoritos</span>
                          <span className="text-2xl font-bold font-sora">{stats?.favoritesCount || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/80 text-sm font-inter">Planes</span>
                          <span className="text-2xl font-bold font-sora">{stats?.plansCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'recipes' && (
                <motion.div
                  key="recipes"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold text-black dark:text-white font-sora mb-6">
                    Mis Recetas Publicadas
                  </h2>
                  <div className="text-center py-12">
                    <ChefHat size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-inter mb-4">
                      Aún no has publicado recetas
                    </p>
                    <Button onClick={() => navigate('/recipes')}>
                      Ver Todas las Recetas
                    </Button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-6"
                >
                  <h2 className="text-xl font-bold text-black dark:text-white font-sora mb-6">
                    Logros Desbloqueados
                  </h2>
                  <div className="text-center py-12">
                    <Award size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-inter mb-2">
                      Los logros estarán disponibles próximamente
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 font-inter">
                      Sigue cocinando para desbloquear badges especiales
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
