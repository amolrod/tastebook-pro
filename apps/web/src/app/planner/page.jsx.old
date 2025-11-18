'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMealPlan, useAddRecipeToMealPlan, useRemoveRecipeFromMealPlan } from '../../hooks/useMealPlans';
import { formatWeekStart, getMonday, getWeekRange } from '../../lib/api/meal-plans';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { MealSlot } from '../../components/planner/MealSlot';
import { RecipeSelectorModal } from '../../components/planner/RecipeSelectorModal';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function PlannerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const days = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const meals = ["breakfast", "lunch", "dinner", "snack"];
  const mealLabels = {
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    dinner: "Cena",
    snack: "Snack",
  };
  const mealColors = {
    breakfast: "#fbbf24",
    lunch: "#f59e0b",
    dinner: "#3b82f6",
    snack: "#a78bfa",
  };

  const planData = {
    0: {
      dinner: {
        title: "Pasta Carbonara",
        image:
          "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=100",
      },
    },
    1: {
      lunch: {
        title: "Ensalada César",
        image:
          "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=100",
      },
    },
    2: {
      dinner: {
        title: "Lasaña de Bolognesa",
        image:
          "https://images.pexels.com/photos/4079520/pexels-photo-4079520.jpeg?auto=compress&cs=tinysrgb&w=100",
      },
    },
    3: {
      lunch: {
        title: "Salmón al Horno",
        image:
          "https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?auto=compress&cs=tinysrgb&w=100",
      },
    },
    4: {
      dinner: {
        title: "Tacos de Pollo",
        image:
          "https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=100",
      },
    },
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
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="planner" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Planificador Semanal"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Week Navigator */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-all">
                <ChevronLeft size={20} className="text-black dark:text-white" />
              </button>
              <div className="text-center">
                <p className="font-bold text-lg text-black dark:text-white font-sora">
                  14 - 20 Noviembre 2025
                </p>
                <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                  Semana 46
                </p>
              </div>
              <button className="p-2 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-all">
                <ChevronRight
                  size={20}
                  className="text-black dark:text-white"
                />
              </button>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#10b981] bg-[#10b981]/5 text-[#10b981] hover:bg-[#10b981]/10 transition-all font-inter font-semibold text-sm">
                <Sparkles size={16} />
                Generar Plan Automático
              </button>
              <button
                onClick={() => (window.location.href = "/shopping")}
                className="px-4 py-2 rounded-lg bg-gradient-to-b from-[#10b981] to-[#059669] text-white hover:from-[#0ea573] hover:to-[#047857] transition-all font-inter font-semibold text-sm"
              >
                Crear Lista de Compra
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-8 border-b border-[#E6E6E6] dark:border-[#333333]">
              <div className="p-4 bg-[#F8F8F8] dark:bg-[#262626] border-r border-[#E6E6E6] dark:border-[#333333]">
                <p className="text-sm font-semibold text-black dark:text-white font-inter">
                  Comida
                </p>
              </div>
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className="p-4 text-center bg-[#F8F8F8] dark:bg-[#262626] border-r border-[#E6E6E6] dark:border-[#333333] last:border-r-0"
                >
                  <p className="text-sm font-semibold text-black dark:text-white font-inter">
                    {day}
                  </p>
                  <p className="text-xs text-[#6E6E6E] dark:text-[#AAAAAA] font-inter mt-1">
                    {14 + idx} Nov
                  </p>
                </div>
              ))}
            </div>

            {/* Meal Rows */}
            {meals.map((meal, mealIdx) => (
              <div
                key={meal}
                className="grid grid-cols-8 border-b border-[#E6E6E6] dark:border-[#333333] last:border-b-0"
              >
                {/* Meal Label */}
                <div
                  className="p-4 flex items-center gap-2 border-r border-[#E6E6E6] dark:border-[#333333]"
                  style={{ backgroundColor: `${mealColors[meal]}10` }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: mealColors[meal] }}
                  />
                  <p className="text-sm font-semibold text-black dark:text-white font-inter">
                    {mealLabels[meal]}
                  </p>
                </div>

                {/* Day Cells */}
                {days.map((_, dayIdx) => {
                  const recipe = planData[dayIdx]?.[meal];
                  return (
                    <div
                      key={dayIdx}
                      className="p-2 border-r border-[#E6E6E6] dark:border-[#333333] last:border-r-0 min-h-[100px] hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-colors cursor-pointer"
                    >
                      {recipe ? (
                        <div className="bg-white dark:bg-[#2A2A2A] rounded-lg p-2 border-l-4 border-[#10b981] hover:shadow-md transition-all">
                          <div className="flex gap-2">
                            <img
                              src={recipe.image}
                              alt={recipe.title}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-black dark:text-white font-inter line-clamp-2">
                                {recipe.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-xs text-[#AAAAAA] dark:text-[#666666] font-inter">
                            + Agregar
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Nutrition Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: "Calorías Totales",
                value: "12,450",
                unit: "kcal",
                color: "#10b981",
              },
              { label: "Proteínas", value: "580", unit: "g", color: "#f59e0b" },
              {
                label: "Carbohidratos",
                value: "1,250",
                unit: "g",
                color: "#3b82f6",
              },
              { label: "Grasas", value: "420", unit: "g", color: "#ef4444" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-4"
              >
                <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] mb-1 font-inter">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-black dark:text-white font-sora">
                  {stat.value}
                  <span className="text-sm font-normal text-[#6E6E6E] dark:text-[#AAAAAA] ml-1">
                    {stat.unit}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
