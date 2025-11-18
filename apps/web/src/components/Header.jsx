import { useState } from "react";
import { Search, Bell, Plus, Menu, LogOut, User, Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Header({
  onMenuClick,
  title = "Dashboard",
  onCreateClick,
  hideSearch = false,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success("Sesión cerrada exitosamente");
    navigate("/login");
  };

  return (
    <div className="h-16 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex items-center justify-between px-4 md:px-6 flex-shrink-0 border-b border-[#E4E4E4] dark:border-[#333333]">
      {/* Left side - Mobile menu button and title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg transition-all duration-150 hover:bg-[#F5F5F5] dark:hover:bg-[#1E1E1E] active:bg-[#EEEEEE] dark:active:bg-[#2A2A2A] active:scale-95"
        >
          <Menu size={20} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
        </button>

        <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight font-sora">
          {title}
        </h1>
      </div>

      {/* Right side - Search, Action buttons */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search field */}
        {!hideSearch && (
          <>
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Buscar recetas…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-[200px] h-10 pl-10 pr-4 rounded-full bg-white dark:bg-[#1E1E1E] border transition-all duration-200 font-inter text-sm text-black dark:text-white placeholder-[#6E6E6E] dark:placeholder-[#888888] ${
                  isSearchFocused
                    ? "border-[#10b981] dark:border-[#10b981]"
                    : "border-[#E5E5E5] dark:border-[#333333] hover:border-[#D0D0D0] dark:hover:border-[#444444]"
                }`}
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#6E6E6E] dark:text-[#888888]"
              />
            </div>

            {/* Mobile search button */}
            <button className="md:hidden w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] flex items-center justify-center transition-all duration-150 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] active:scale-95">
              <Search size={18} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
            </button>
          </>
        )}

        {/* Create Button */}
        {onCreateClick && (
          <button
            onClick={onCreateClick}
            className="h-10 px-4 md:px-7 rounded-full bg-gradient-to-b from-[#10b981] to-[#059669] text-white font-semibold text-sm transition-all duration-150 hover:from-[#0ea573] hover:to-[#047857] active:from-[#0d9468] active:to-[#065f46] active:scale-95 font-inter flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Nueva Receta</span>
          </button>
        )}

        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] flex items-center justify-center transition-all duration-150 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] active:scale-95 relative">
          <Bell size={18} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-[#10b981] rounded-full"></div>
        </button>

        {/* User Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-[#333333] transition-all duration-150 hover:ring-[#10b981] dark:hover:ring-[#10b981] cursor-pointer flex items-center justify-center bg-[#10b981] text-white font-semibold"
          >
            {user ? user.email?.[0].toUpperCase() : <User size={20} />}
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-[#E5E5E5] dark:border-[#333333] z-20 overflow-hidden">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-[#E5E5E5] dark:border-[#333333]">
                      <p className="text-sm font-semibold text-black dark:text-white font-inter truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-2 text-[#4B4B4B] dark:text-[#B0B0B0] hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-colors font-inter text-sm"
                    >
                      <User size={16} />
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => {
                        navigate("/favorites");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left flex items-center gap-2 text-[#4B4B4B] dark:text-[#B0B0B0] hover:bg-[#F8F8F8] dark:hover:bg-[#262626] transition-colors font-inter text-sm"
                    >
                      <Heart size={16} />
                      Mis Favoritos
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-inter text-sm"
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-4 py-3 text-left flex items-center gap-2 text-[#10b981] hover:bg-[#10b981]/10 transition-colors font-inter text-sm"
                  >
                    <User size={16} />
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
