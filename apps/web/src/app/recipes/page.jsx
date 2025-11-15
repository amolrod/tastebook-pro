import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Clock, Users, Star, Filter, Grid3x3, List } from "lucide-react";

export default function RecipesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  const recipes = [
    {
      id: 1,
      title: "Pasta Carbonara",
      image:
        "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=600",
      time: 25,
      servings: 4,
      difficulty: "easy",
      rating: 5,
      tags: ["italiana", "pasta"],
    },
    {
      id: 2,
      title: "Salmón al Horno",
      image:
        "https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=600",
      time: 35,
      servings: 2,
      difficulty: "easy",
      rating: 5,
      tags: ["saludable", "pescado"],
    },
    {
      id: 3,
      title: "Lasaña de Bolognesa",
      image:
        "https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg?auto=compress&cs=tinysrgb&w=600",
      time: 75,
      servings: 6,
      difficulty: "medium",
      rating: 5,
      tags: ["italiana", "comfort food"],
    },
    {
      id: 4,
      title: "Ensalada César",
      image:
        "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600",
      time: 15,
      servings: 2,
      difficulty: "easy",
      rating: 4,
      tags: ["ensalada", "saludable"],
    },
    {
      id: 5,
      title: "Tacos de Pollo",
      image:
        "https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=600",
      time: 35,
      servings: 4,
      difficulty: "easy",
      rating: 5,
      tags: ["mexicana", "pollo"],
    },
  ];

  const difficultyColors = {
    easy: { bg: "#dcfce7", text: "#16a34a", label: "Fácil" },
    medium: { bg: "#fef3c7", text: "#d97706", label: "Media" },
    hard: { bg: "#fee2e2", text: "#dc2626", label: "Difícil" },
  };

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="recipes" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Mis Recetas"
          onCreateClick={() => (window.location.href = "/recipes/new")}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Filters and View Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-all font-inter text-sm"
              >
                <Filter size={16} />
                Filtros
              </button>

              <div className="flex gap-2">
                {["Todas", "Fácil", "Rápidas", "Saludables"].map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] text-black dark:text-white hover:border-[#10b981] hover:bg-[#10b981]/5 transition-all font-inter"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#10b981] text-white" : "bg-white dark:bg-[#262626] text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A]"}`}
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#10b981] text-white" : "bg-white dark:bg-[#262626] text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A]"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Recipes Grid */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {recipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => (window.location.href = `/recipes/${recipe.id}`)}
                className={`group bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] text-left ${viewMode === "list" ? "flex gap-4" : ""}`}
              >
                <div
                  className={`relative ${viewMode === "list" ? "w-48 h-36" : "w-full h-48"} overflow-hidden`}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-semibold font-inter"
                      style={{
                        backgroundColor: difficultyColors[recipe.difficulty].bg,
                        color: difficultyColors[recipe.difficulty].text,
                      }}
                    >
                      {difficultyColors[recipe.difficulty].label}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <h3 className="font-bold text-lg text-black dark:text-white mb-2 font-sora group-hover:text-[#10b981] transition-colors">
                    {recipe.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-3 text-sm text-[#6E6E6E] dark:text-[#AAAAAA]">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span className="font-inter">{recipe.time} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span className="font-inter">{recipe.servings} pers</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < recipe.rating
                              ? "text-[#f59e0b] fill-[#f59e0b]"
                              : "text-[#E6E6E6] dark:text-[#404040]"
                          }
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      {recipe.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-xs bg-[#F3F3F3] dark:bg-[#262626] text-[#6E6E6E] dark:text-[#AAAAAA] font-inter"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <button className="px-6 py-3 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] text-black dark:text-white hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-all font-inter font-semibold">
              Cargar más recetas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
