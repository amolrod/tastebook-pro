import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  Flame,
  Calendar,
  ChefHat,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="dashboard" />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Dashboard"
          onCreateClick={() => (window.location.href = "/recipes/new")}
        />

        {/* Content area below header */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Top Row - Streak & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Streak Card */}
            <div className="bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Flame size={32} className="text-white" />
                  <div>
                    <p className="text-white/80 text-sm font-inter">
                      Racha Actual
                    </p>
                    <p className="text-4xl font-bold font-sora">12</p>
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-sm font-inter">
                ¡Increíble! 🎉 Cocina hoy para mantener tu racha
              </p>
            </div>

            {/* This Week Stats */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={24} className="text-[#10b981]" />
                <p className="font-semibold text-black dark:text-white font-inter">
                  Esta Semana
                </p>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white font-sora mb-1">
                5
              </p>
              <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                recetas planeadas
              </p>
            </div>

            {/* Recipes Created */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <ChefHat size={24} className="text-[#f59e0b]" />
                <p className="font-semibold text-black dark:text-white font-inter">
                  Mis Recetas
                </p>
              </div>
              <p className="text-3xl font-bold text-black dark:text-white font-sora mb-1">
                45
              </p>
              <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                recetas creadas
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Larger widgets */}
            <div className="xl:col-span-2 space-y-8">
              {/* What Can I Cook Today Widget */}
              <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
                <h2 className="text-xl font-bold text-black dark:text-white mb-4 font-sora">
                  ¿Qué puedo cocinar hoy?
                </h2>
                <p className="text-[#6E6E6E] dark:text-[#AAAAAA] mb-4 font-inter">
                  Marca los ingredientes que tienes disponibles
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {["Pollo", "Tomate", "Cebolla", "Pasta", "Queso", "Ajo"].map(
                    (ingredient) => (
                      <button
                        key={ingredient}
                        className="px-4 py-2 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] text-black dark:text-white font-inter text-sm transition-all duration-150 hover:border-[#10b981] hover:bg-[#10b981]/5 active:scale-95"
                      >
                        {ingredient}
                      </button>
                    ),
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-black dark:text-white font-inter">
                    Recetas sugeridas (85% match)
                  </p>
                  {["Pasta Carbonara", "Salmón al Horno"].map((recipe, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-3 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-[#F8F8F8] dark:bg-[#262626] hover:bg-white dark:hover:bg-[#2A2A2A] transition-all cursor-pointer"
                    >
                      <img
                        src={
                          idx === 0
                            ? "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=100"
                            : "https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=100"
                        }
                        alt={recipe}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-black dark:text-white font-inter">
                          {recipe}
                        </p>
                        <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                          {idx === 0 ? "25 min" : "35 min"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Plan Preview */}
              <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-black dark:text-white font-sora">
                    Plan Semanal
                  </h2>
                  <button
                    onClick={() => (window.location.href = "/planner")}
                    className="text-sm text-[#10b981] hover:text-[#059669] font-inter font-semibold"
                  >
                    Ver todo →
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      day: "Lunes",
                      meal: "Cena",
                      recipe: "Pasta Carbonara",
                      color: "#3b82f6",
                    },
                    {
                      day: "Martes",
                      meal: "Almuerzo",
                      recipe: "Ensalada César",
                      color: "#f59e0b",
                    },
                    {
                      day: "Miércoles",
                      meal: "Cena",
                      recipe: "Lasaña de Bolognesa",
                      color: "#3b82f6",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#E6E6E6] dark:border-[#404040] hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all cursor-pointer"
                    >
                      <div
                        className="w-1 h-12 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-black dark:text-white font-inter">
                          {item.day} - {item.meal}
                        </p>
                        <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                          {item.recipe}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar widgets */}
            <div className="space-y-8">
              {/* Achievements */}
              <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4 font-sora">
                  Logros Recientes
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      name: "Racha de Fuego",
                      icon: "🔥",
                      desc: "7 días seguidos",
                    },
                    {
                      name: "Explorador Culinario",
                      icon: "🌍",
                      desc: "5 cocinas diferentes",
                    },
                  ].map((achievement, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 border border-[#10b981]/20"
                    >
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <p className="font-semibold text-black dark:text-white font-inter text-sm">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                          {achievement.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Recipes */}
              <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-4 font-sora">
                  Recetas Populares
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      name: "Tacos de Pollo",
                      rating: 5,
                      img: "https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=100",
                    },
                    {
                      name: "Lasaña de Bolognesa",
                      rating: 5,
                      img: "https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg?auto=compress&cs=tinysrgb&w=100",
                    },
                  ].map((recipe, idx) => (
                    <button
                      key={idx}
                      onClick={() => (window.location.href = "/recipes")}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all"
                    >
                      <img
                        src={recipe.img}
                        alt={recipe.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-black dark:text-white font-inter text-sm">
                          {recipe.name}
                        </p>
                        <div className="flex gap-0.5 mt-1">
                          {[...Array(recipe.rating)].map((_, i) => (
                            <span key={i} className="text-[#f59e0b] text-xs">
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => (window.location.href = "/recipes")}
                  className="w-full mt-4 py-2 px-4 rounded-lg border border-[#E6E6E6] dark:border-[#404040] text-sm font-semibold text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-all font-inter"
                >
                  Ver todas →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
