import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Check, Plus, Share2, Download } from "lucide-react";

export default function ShoppingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set());

  const shoppingList = {
    vegetables: [
      { id: 1, name: "Cebolla", quantity: "4 unidades" },
      { id: 2, name: "Tomate", quantity: "6 unidades" },
      { id: 3, name: "Ajo", quantity: "8 dientes" },
    ],
    meats: [
      { id: 4, name: "Pollo", quantity: "800 g" },
      { id: 5, name: "Salmón", quantity: "400 g" },
    ],
    dairy: [
      { id: 6, name: "Queso", quantity: "350 g" },
      { id: 7, name: "Huevos", quantity: "12 unidades" },
      { id: 8, name: "Leche", quantity: "1 L" },
    ],
    pantry: [
      { id: 9, name: "Pasta", quantity: "800 g" },
      { id: 10, name: "Arroz", quantity: "500 g" },
      { id: 11, name: "Aceite de oliva", quantity: "250 ml" },
    ],
  };

  const categoryLabels = {
    vegetables: { label: "Verduras", icon: "🥬", color: "#10b981" },
    meats: { label: "Carnes y Pescados", icon: "🥩", color: "#ef4444" },
    dairy: { label: "Lácteos", icon: "🥛", color: "#3b82f6" },
    pantry: { label: "Despensa", icon: "🥫", color: "#f59e0b" },
  };

  const toggleItem = (id) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const totalItems = Object.values(shoppingList).flat().length;
  const checkedCount = checkedItems.size;
  const progress = (checkedCount / totalItems) * 100;

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
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="shopping" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Lista de Compra"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Progress Bar */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-xl text-black dark:text-white font-sora">
                  {checkedCount} / {totalItems} items
                </p>
                <p className="text-sm text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                  {Math.round(progress)}% completado
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-all">
                  <Share2 size={18} className="text-black dark:text-white" />
                </button>
                <button className="p-2 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2A2A] transition-all">
                  <Download size={18} className="text-black dark:text-white" />
                </button>
              </div>
            </div>

            <div className="w-full h-3 bg-[#E6E6E6] dark:bg-[#404040] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#10b981] to-[#059669] transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shopping List Categories */}
            {Object.entries(shoppingList).map(([category, items]) => (
              <div
                key={category}
                className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: `${categoryLabels[category].color}20`,
                    }}
                  >
                    {categoryLabels[category].icon}
                  </div>
                  <h3 className="font-bold text-lg text-black dark:text-white font-sora">
                    {categoryLabels[category].label}
                  </h3>
                </div>

                <div className="space-y-2">
                  {items.map((item) => {
                    const isChecked = checkedItems.has(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 ${
                          isChecked
                            ? "border-[#10b981] bg-[#10b981]/5"
                            : "border-[#E6E6E6] dark:border-[#404040] hover:border-[#10b981]/30 hover:bg-[#F8F8F8] dark:hover:bg-[#262626]"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isChecked
                              ? "border-[#10b981] bg-[#10b981]"
                              : "border-[#CCCCCC] dark:border-[#555555]"
                          }`}
                        >
                          {isChecked && (
                            <Check
                              size={14}
                              className="text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p
                            className={`font-semibold text-sm font-inter ${
                              isChecked
                                ? "text-[#6E6E6E] dark:text-[#888888] line-through"
                                : "text-black dark:text-white"
                            }`}
                          >
                            {item.name}
                          </p>
                          <p className="text-xs text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                            {item.quantity}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Add Manual Item */}
          <div className="mt-6 bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Agregar item manualmente..."
                  className="w-full px-4 py-3 rounded-lg border border-[#E6E6E6] dark:border-[#404040] bg-white dark:bg-[#262626] text-black dark:text-white placeholder-[#AAAAAA] focus:border-[#10b981] focus:outline-none transition-all font-inter"
                />
              </div>
              <button className="px-6 py-3 rounded-lg bg-gradient-to-b from-[#10b981] to-[#059669] text-white hover:from-[#0ea573] hover:to-[#047857] transition-all font-inter font-semibold flex items-center gap-2">
                <Plus size={18} />
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
