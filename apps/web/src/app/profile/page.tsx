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
  ArrowLeft,
  Home,
  Trophy,
  Lock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useUserStats } from '../../hooks/useUserStats';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { useUploadAvatar } from '../../hooks/useUploadAvatar';
import { useRecipes } from '../../hooks/useRecipes';
import { useQuery } from '@tanstack/react-query';
import { AchievementService, Achievement, UserAchievement } from '../../lib/api/achievements';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNavigate } from 'react-router';
import { RecipeCard } from '../../components/recipes/RecipeCard';

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

  // Fetch User Recipes
  const { data: userRecipes, isLoading: isLoadingRecipes } = useRecipes({ 
    userId: user?.id 
  });

  // Fetch User Achievements
  const { data: userAchievements = [], isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: () => user?.id ? AchievementService.getUserAchievements(user.id) : [],
    enabled: !!user?.id,
  });

  // Fetch All Achievements (for details)
  const { data: allAchievements = [] } = useQuery({
    queryKey: ['all-achievements'],
    queryFn: () => AchievementService.getAllAchievements(),
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
      {/* Botón de navegación fijo */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate('/recipes')}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] text-gray-700 dark:text-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-200 dark:border-[#333333]"
        >
          <Home size={20} className="text-[#10b981]" />
          <span className="font-semibold font-inter hidden sm:inline">Inicio</span>
        </button>
      </div>

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

                {/* Actions Grid */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => navigate('/recipes')}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#262626] rounded-xl hover:bg-[#10b981]/10 hover:text-[#10b981] transition-all group border border-transparent hover:border-[#10b981]/20"
                  >
                    <div className="p-2 bg-white dark:bg-[#1E1E1E] rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <Home size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-[#10b981]" />
                    </div>
                    <span className="text-xs font-semibold font-inter">Recetas</span>
                  </button>

                  <button
                    onClick={() => navigate('/favorites')}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#262626] rounded-xl hover:bg-[#ff6b35]/10 hover:text-[#ff6b35] transition-all group border border-transparent hover:border-[#ff6b35]/20"
                  >
                    <div className="p-2 bg-white dark:bg-[#1E1E1E] rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <Heart size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-[#ff6b35]" />
                    </div>
                    <span className="text-xs font-semibold font-inter">Favoritos</span>
                  </button>

                  <button
                    onClick={() => {}}
                    className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#262626] rounded-xl hover:bg-[#3b82f6]/10 hover:text-[#3b82f6] transition-all group border border-transparent hover:border-[#3b82f6]/20"
                  >
                    <div className="p-2 bg-white dark:bg-[#1E1E1E] rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <Settings size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-[#3b82f6]" />
                    </div>
                    <span className="text-xs font-semibold font-inter">Ajustes</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all group border border-transparent hover:border-red-200 dark:hover:border-red-800/30"
                  >
                    <div className="p-2 bg-white dark:bg-[#1E1E1E] rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                      <LogOut size={20} className="text-red-500 group-hover:text-red-600" />
                    </div>
                    <span className="text-xs font-semibold font-inter">Salir</span>
                  </button>
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
                  className="text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1E1E1E] rounded-xl p-4 transition-colors"
                  onClick={() => navigate('/favorites')}
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
                  {/* Actividad Reciente / Últimas Recetas */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-6">
                      <h2 className="text-xl font-bold text-black dark:text-white font-sora mb-6 flex items-center gap-2">
                        <ChefHat size={24} className="text-[#10b981]" />
                        Últimas Recetas Publicadas
                      </h2>
                      
                      {isLoadingRecipes ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
                        </div>
                      ) : userRecipes && userRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {userRecipes.slice(0, 2).map((recipe) => (
                            <RecipeCard 
                              key={recipe.id} 
                              recipe={recipe} 
                              onClick={() => navigate(`/recipes/${recipe.id}`)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-gray-50 dark:bg-[#262626] rounded-xl">
                          <ChefHat size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 font-inter mb-4">
                            Aún no has publicado ninguna receta
                          </p>
                          <Button onClick={() => navigate('/recipes/new')}>
                            Crear mi primera receta
                          </Button>
                        </div>
                      )}
                      
                      {userRecipes && userRecipes.length > 2 && (
                        <div className="mt-6 text-center">
                          <Button variant="outline" onClick={() => setActiveTab('recipes')}>
                            Ver todas mis recetas
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Stats & Achievements Preview */}
                  <div className="space-y-6">
                    {/* Resumen Rápido */}
                    <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={100} />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold font-sora text-lg">Tu Impacto</h3>
                          <TrendingUp size={24} />
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <span className="text-white/90 text-sm font-inter">Recetas creadas</span>
                            <span className="text-2xl font-bold font-sora">{stats?.recipesCount || 0}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <span className="text-white/90 text-sm font-inter">Favoritos recibidos</span>
                            <span className="text-2xl font-bold font-sora">{stats?.favoritesCount || 0}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <span className="text-white/90 text-sm font-inter">Planes activos</span>
                            <span className="text-2xl font-bold font-sora">{stats?.plansCount || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logros Recientes Preview */}
                    <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold font-sora text-black dark:text-white">Logros</h3>
                        <Award size={20} className="text-[#f59e0b]" />
                      </div>
                      
                      {userAchievements.length > 0 ? (
                        <div className="space-y-3">
                          {userAchievements.slice(0, 3).map((ua: any) => {
                            const achievement = allAchievements.find(a => a.id === ua.achievement_id);
                            if (!achievement) return null;
                            return (
                              <div key={ua.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#262626] transition-colors">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-400">
                                  <Trophy size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-black dark:text-white truncate">
                                    {achievement.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {new Date(ua.unlocked_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full mt-2 text-[#10b981]"
                            onClick={() => setActiveTab('achievements')}
                          >
                            Ver todos
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Aún no has desbloqueado logros
                          </p>
                          <Button variant="outline" size="sm" onClick={() => setActiveTab('achievements')}>
                            Ver disponibles
                          </Button>
                        </div>
                      )}
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
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-black dark:text-white font-sora">
                      Mis Recetas ({userRecipes?.length || 0})
                    </h2>
                    <Button onClick={() => navigate('/recipes/new')}>
                      <ChefHat size={18} className="mr-2" />
                      Nueva Receta
                    </Button>
                  </div>

                  {isLoadingRecipes ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-80 bg-gray-200 dark:bg-[#262626] rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : userRecipes && userRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userRecipes.map((recipe) => (
                        <RecipeCard 
                          key={recipe.id} 
                          recipe={recipe} 
                          onClick={() => navigate(`/recipes/${recipe.id}`)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg">
                      <ChefHat size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-6" />
                      <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                        No tienes recetas publicadas
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-inter mb-6 max-w-md mx-auto">
                        Comparte tus mejores creaciones culinarias con la comunidad de Tastebook Pro.
                      </p>
                      <Button size="lg" onClick={() => navigate('/recipes/new')}>
                        Crear mi primera receta
                      </Button>
                    </div>
                  )}
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
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-black dark:text-white font-sora mb-2">
                        Logros y Medallas
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 font-inter">
                        Desbloquea medallas completando desafíos culinarios
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-[#10b981] font-sora">
                        {userAchievements.length} / {allAchievements.length}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                        Desbloqueados
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allAchievements.map((achievement) => {
                      const isUnlocked = userAchievements.some((ua: any) => ua.achievement_id === achievement.id);
                      const unlockedData = userAchievements.find((ua: any) => ua.achievement_id === achievement.id);
                      
                      return (
                        <div 
                          key={achievement.id}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            isUnlocked 
                              ? 'border-[#10b981]/20 bg-[#10b981]/5 dark:bg-[#10b981]/10' 
                              : 'border-gray-200 dark:border-[#333333] bg-gray-50 dark:bg-[#262626] opacity-70'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${
                              isUnlocked 
                                ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/30' 
                                : 'bg-gray-200 dark:bg-[#333333] text-gray-400'
                            }`}>
                              {isUnlocked ? <Trophy size={24} /> : <Lock size={24} />}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-bold font-sora mb-1 ${
                                isUnlocked ? 'text-black dark:text-white' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {achievement.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-500 font-inter mb-2 line-clamp-2">
                                {achievement.description}
                              </p>
                              {isUnlocked && (
                                <div className="flex items-center gap-1 text-xs text-[#10b981] font-medium">
                                  <Sparkles size={12} />
                                  <span>Desbloqueado el {new Date(unlockedData.unlocked_at).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
