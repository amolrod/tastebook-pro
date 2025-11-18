'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  useShoppingList,
  useAddShoppingItem,
  useToggleShoppingItem,
  useRemoveShoppingItem,
  useClearCheckedItems,
} from '../../hooks/useShoppingList';
import { INGREDIENT_CATEGORIES, type IngredientCategory } from '../../lib/constants/ingredients';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Check, Plus, Trash2, X, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ShoppingListItem } from '../../types/database';

/**
 * Página de Lista de Compras Inteligente
 * 
 * Features:
 * - Auto-categorización de ingredientes
 * - Agregar/eliminar/toggle items
 * - Progress bar con % completado
 * - Limpiar items comprados
 * - Compartir lista
 * - Agrupación visual por categorías
 * - Animaciones con framer-motion
 * - Dark mode completo
 * - Responsive mobile-first
 */
export default function ShoppingPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');

  const { data: shoppingList, isLoading } = useShoppingList(user?.id);
  const addItem = useAddShoppingItem();
  const toggleItem = useToggleShoppingItem();
  const removeItem = useRemoveShoppingItem();
  const clearChecked = useClearCheckedItems();

  const items = (shoppingList?.items || []) as ShoppingListItem[];

  // Agrupar items por categoría
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<IngredientCategory, ShoppingListItem[]>);

  // Stats
  const totalItems = items.length;
  const checkedItems = items.filter((item) => item.checked).length;
  const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

  const handleAddItem = () => {
    if (!newItemName.trim() || !user || !shoppingList) return;

    const quantity = parseFloat(newItemQuantity) || 1;

    addItem.mutate({
      userId: user.id,
      listId: shoppingList.id,
      currentItems: items,
      newItem: {
        name: newItemName.trim(),
        quantity,
        unit: newItemUnit.trim() || 'unidad',
      },
    });

    // Reset form
    setNewItemName('');
    setNewItemQuantity('');
    setNewItemUnit('');
  };

  const handleToggleItem = (itemId: string) => {
    if (!user || !shoppingList) return;

    toggleItem.mutate({
      userId: user.id,
      listId: shoppingList.id,
      currentItems: items,
      itemId,
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!user || !shoppingList) return;

    removeItem.mutate({
      userId: user.id,
      listId: shoppingList.id,
      currentItems: items,
      itemId,
    });
  };

  const handleClearChecked = () => {
    if (!user || !shoppingList || checkedItems === 0) return;

    if (!confirm(`¿Eliminar ${checkedItems} item${checkedItems !== 1 ? 's' : ''} comprado${checkedItems !== 1 ? 's' : ''}?`)) {
      return;
    }

    clearChecked.mutate({
      userId: user.id,
      listId: shoppingList.id,
      currentItems: items,
    });
  };

  const handleShare = () => {
    const text = items
      .filter((item) => !item.checked)
      .map((item) => `• ${item.quantity} ${item.unit} ${item.name}`)
      .join('\n');

    const shareText = `🛒 Mi Lista de Compra - Tastebook Pro\n\n${text}`;

    if (navigator.share) {
      navigator.share({
        title: 'Mi Lista de Compra - Tastebook Pro',
        text: shareText,
      }).catch(() => {
        // Fallback silencioso
        navigator.clipboard.writeText(shareText);
        alert('Lista copiada al portapapeles');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Lista copiada al portapapeles');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <p className="text-gray-600 dark:text-gray-400 font-inter">
          Debes iniciar sesión para ver tu lista de compra
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <LoadingSpinner size="lg" />
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
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="shopping" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Lista de Compra"
          hideSearch={true}
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div>
                <p className="font-bold text-2xl text-black dark:text-white font-sora">
                  {checkedItems} / {totalItems}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                  {Math.round(progress)}% completado
                </p>
              </div>

              <div className="flex gap-2">
                {checkedItems > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearChecked}
                    disabled={clearChecked.isPending}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-inter font-semibold text-sm transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} className="inline mr-2" />
                    Limpiar comprados
                  </motion.button>
                )}

                {totalItems > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white rounded-lg font-inter font-semibold text-sm transition-colors"
                  >
                    <Share2 size={16} className="inline mr-2" />
                    Compartir
                  </motion.button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-200 dark:bg-[#262626] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full"
              />
            </div>
          </motion.div>

          {/* Add Item Form */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6 mb-6"
          >
            <h2 className="text-lg font-bold text-black dark:text-white mb-4 font-sora">
              Agregar Ingrediente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nombre del ingrediente"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                className="md:col-span-2 px-4 py-3 rounded-lg border border-gray-200 dark:border-[#333333] bg-white dark:bg-[#262626] text-black dark:text-white placeholder-gray-400 focus:border-[#10b981] focus:outline-none transition-all font-inter"
              />

              <input
                type="text"
                placeholder="Cantidad"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                className="px-4 py-3 rounded-lg border border-gray-200 dark:border-[#333333] bg-white dark:bg-[#262626] text-black dark:text-white placeholder-gray-400 focus:border-[#10b981] focus:outline-none transition-all font-inter"
              />

              <input
                type="text"
                placeholder="Unidad (ej: kg, L)"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                className="px-4 py-3 rounded-lg border border-gray-200 dark:border-[#333333] bg-white dark:bg-[#262626] text-black dark:text-white placeholder-gray-400 focus:border-[#10b981] focus:outline-none transition-all font-inter"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddItem}
                disabled={!newItemName.trim() || addItem.isPending}
                className="md:col-span-4 px-6 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] text-white rounded-lg font-inter font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addItem.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Plus size={20} className="inline mr-2" />
                    Agregar a la Lista
                  </>
                )}
              </motion.button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-inter">
              💡 Tip: Los ingredientes se organizarán automáticamente por categoría
            </p>
          </motion.div>

          {/* Empty State */}
          {totalItems === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-12 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 rounded-full flex items-center justify-center">
                <span className="text-5xl">🛒</span>
              </div>

              <h3 className="text-2xl font-bold text-black dark:text-white mb-3 font-sora">
                Lista de compra vacía
              </h3>

              <p className="text-gray-600 dark:text-gray-400 font-inter mb-6 max-w-md mx-auto">
                Agrega ingredientes manualmente usando el formulario de arriba
              </p>
            </motion.div>
          )}

          {/* Items by Category */}
          {totalItems > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {Object.entries(itemsByCategory).map(([category, categoryItems], idx) => {
                  const categoryInfo = INGREDIENT_CATEGORIES[category as IngredientCategory];

                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white dark:bg-[#1E1E1E] border border-[#E6E6E6] dark:border-[#333333] rounded-xl p-6"
                    >
                      {/* Category Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${categoryInfo.color}20` }}
                        >
                          {categoryInfo.icon}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-black dark:text-white font-sora">
                            {categoryInfo.label}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                            {categoryItems.length} {categoryItems.length === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        <AnimatePresence>
                          {categoryItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="group"
                            >
                              <button
                                onClick={() => handleToggleItem(item.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                  item.checked
                                    ? 'border-[#10b981] bg-[#10b981]/5'
                                    : 'border-gray-200 dark:border-[#333333] hover:border-[#10b981]/30 hover:bg-gray-50 dark:hover:bg-[#262626]'
                                }`}
                              >
                                {/* Checkbox */}
                                <div
                                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                    item.checked
                                      ? 'border-[#10b981] bg-[#10b981]'
                                      : 'border-gray-300 dark:border-[#555555]'
                                  }`}
                                >
                                  {item.checked && <Check size={16} className="text-white" strokeWidth={3} />}
                                </div>

                                {/* Item Info */}
                                <div className="flex-1 text-left">
                                  <p
                                    className={`font-semibold text-sm font-inter ${
                                      item.checked
                                        ? 'text-gray-500 dark:text-gray-600 line-through'
                                        : 'text-black dark:text-white'
                                    }`}
                                  >
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 font-inter">
                                    {item.quantity} {item.unit}
                                  </p>
                                </div>

                                {/* Delete Button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveItem(item.id);
                                  }}
                                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <X size={16} />
                                </button>
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
