import { useState } from "react";
import { useNavigate } from "react-router";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { AchievementService, Achievement, UserAchievement } from "../../lib/api/achievements";
import { motion } from "framer-motion";
import { Trophy, Lock, ChevronLeft, Sparkles } from "lucide-react";

export default function AchievementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Obtener todos los achievements disponibles
  const { data: allAchievements = [], isLoading: loadingAll } = useQuery({
    queryKey: ['all-achievements'],
    queryFn: () => AchievementService.getAllAchievements(),
  });

  // Obtener achievements desbloqueados del usuario
  const { data: userAchievements = [], isLoading: loadingUser } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: () => user?.id ? AchievementService.getUserAchievements(user.id) : [],
    enabled: !!user?.id,
  });

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'from-[#cd7f32] to-[#b87333]',
      silver: 'from-[#c0c0c0] to-[#a8a8a8]',
      gold: 'from-[#ffd700] to-[#ffb700]',
      platinum: 'from-[#e5e4e2] to-[#b0c4de]'
    };
    return colors[tier as keyof typeof colors] || colors.bronze;
  };

  const getTierBorderColor = (tier: string) => {
    const colors = {
      bronze: 'border-[#cd7f32]',
      silver: 'border-[#c0c0c0]',
      gold: 'border-[#ffd700]',
      platinum: 'border-[#b0c4de]'
    };
    return colors[tier as keyof typeof colors] || colors.bronze;
  };

  const isUnlocked = (achievementId: string) => {
    return userAchievements.some((ua: UserAchievement) => ua.achievement_id === achievementId);
  };

  const getUnlockedDate = (achievementId: string) => {
    const ua = userAchievements.find((ua: UserAchievement) => ua.achievement_id === achievementId);
    if (!ua) return null;
    return new Date(ua.unlocked_at).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalPoints = userAchievements.reduce((sum: number, ua: UserAchievement) => {
    const achievement = allAchievements.find((a: Achievement) => a.id === ua.achievement_id);
    return sum + (achievement?.points || 0);
  }, 0);

  const unlockedCount = userAchievements.length;
  const totalCount = allAchievements.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  if (loadingAll || loadingUser) {
    return (
      <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="achievements" />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            title="Logros"
            onCreateClick={() => navigate("/recipes/new")}
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10b981]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="achievements" />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Logros"
          onCreateClick={() => navigate("/recipes/new")}
        />

        {/* Content area below header */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-[#6E6E6E] dark:text-[#AAAAAA] hover:text-black dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-inter">Volver</span>
          </button>

          {/* Stats Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl p-6 text-white"
            >
              <Trophy size={32} className="mb-3" />
              <p className="text-3xl font-bold font-sora mb-1">{unlockedCount}/{totalCount}</p>
              <p className="text-white/90 font-inter">Logros Desbloqueados</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6"
            >
              <Sparkles size={32} className="text-[#ffd700] mb-3" />
              <p className="text-3xl font-bold text-black dark:text-white font-sora mb-1">{totalPoints}</p>
              <p className="text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">Puntos Totales</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6"
            >
              <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter mb-2">Progreso</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-[#10b981] to-[#059669] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-2xl font-bold text-black dark:text-white font-sora">{Math.round(progress)}%</p>
            </motion.div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAchievements.map((achievement: Achievement, idx: number) => {
              const unlocked = isUnlocked(achievement.id);
              const unlockedDate = getUnlockedDate(achievement.id);

              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`
                    relative rounded-xl p-6 border-2 transition-all duration-300
                    ${unlocked
                      ? `bg-gradient-to-br ${getTierColor(achievement.tier)} ${getTierBorderColor(achievement.tier)} shadow-lg hover:shadow-xl`
                      : 'bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
                    }
                  `}
                >
                  {/* Lock icon for locked achievements */}
                  {!unlocked && (
                    <div className="absolute top-4 right-4">
                      <Lock size={24} className="text-gray-500 dark:text-gray-400" />
                    </div>
                  )}

                  {/* Achievement Icon */}
                  <div className={`text-6xl mb-4 ${!unlocked && 'grayscale'}`}>
                    {achievement.icon}
                  </div>

                  {/* Achievement Info */}
                  <div className={unlocked ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold font-sora">{achievement.name}</h3>
                      <span className={`
                        px-2 py-0.5 text-xs font-bold rounded-full uppercase
                        ${unlocked ? 'bg-white/20' : 'bg-gray-400/20'}
                      `}>
                        {achievement.tier}
                      </span>
                    </div>
                    <p className={`text-sm mb-3 font-inter ${unlocked ? 'text-white/90' : ''}`}>
                      {achievement.description}
                    </p>
                    
                    {unlocked ? (
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-inter">
                          Desbloqueado: {unlockedDate}
                        </p>
                        <p className="text-sm font-bold">+{achievement.points} pts</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">
                          Bloqueado
                        </p>
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                          {achievement.points} pts
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State */}
          {allAchievements.length === 0 && (
            <div className="text-center py-16">
              <Trophy size={64} className="mx-auto mb-4 text-[#6E6E6E] dark:text-[#AAAAAA]" />
              <p className="text-xl font-semibold text-black dark:text-white mb-2">
                No hay logros disponibles
              </p>
              <p className="text-[#6E6E6E] dark:text-[#AAAAAA]">
                Los logros aparecerán aquí cuando estén configurados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
