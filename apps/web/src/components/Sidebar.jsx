import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ShoppingCart,
  FolderOpen,
  User,
  ChefHat,
} from "lucide-react";

export default function Sidebar({ onClose, activePage = "dashboard" }) {
  const [activeItem, setActiveItem] = useState(activePage);

  const handleItemClick = (itemName, href) => {
    setActiveItem(itemName);
    if (href && typeof window !== "undefined") {
      window.location.href = href;
    }
    if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  const navigationItems = [
    { name: "dashboard", icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { name: "recipes", icon: ChefHat, label: "Recetas", href: "/recipes" },
    {
      name: "planner",
      icon: Calendar,
      label: "Planificador",
      href: "/planner",
    },
    {
      name: "shopping",
      icon: ShoppingCart,
      label: "Compra",
      href: "/shopping",
    },
    {
      name: "collections",
      icon: FolderOpen,
      label: "Colecciones",
      href: "/collections",
    },
    { name: "profile", icon: User, label: "Perfil", href: "/profile" },
  ];

  return (
    <div className="w-60 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex-shrink-0 flex flex-col h-full">
      {/* Brand Logo */}
      <div className="p-4 flex justify-start items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center">
          <ChefHat size={24} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-black dark:text-white font-sora">
            Tastebook
          </h1>
          <p className="text-xs text-black/60 dark:text-white/60 font-inter">
            Pro
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.name, item.href)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-[#262626] border border-[#E4E4E4] dark:border-[#404040] text-black dark:text-white"
                    : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 active:bg-white/70 dark:active:bg-white/15 active:scale-[0.98]"
                }`}
              >
                <Icon
                  size={20}
                  className={
                    isActive
                      ? "text-[#10b981]"
                      : "text-black/70 dark:text-white/70"
                  }
                />
                <span
                  className={`font-medium text-sm font-plus-jakarta ${
                    isActive
                      ? "text-black dark:text-white"
                      : "text-black/70 dark:text-white/70"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Version Info */}
      <div className="p-4 text-center">
        <p className="text-xs text-black/40 dark:text-white/40 font-inter">
          v1.0.0
        </p>
      </div>
    </div>
  );
}
