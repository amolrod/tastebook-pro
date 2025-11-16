'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { RecipeEditor } from '../../../components/recipes/RecipeEditor';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';

/**
 * Página para crear una nueva receta
 * 
 * Ruta: /recipes/new
 * 
 * Features:
 * - Editor completo de recetas
 * - Redirección al detalle después de crear
 * - Cancelar vuelve a la lista
 */
export default function NewRecipePage() {
  const navigate = useNavigate();
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
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="recipes" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Nueva Receta"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black dark:text-white font-sora mb-2">
                Crear Nueva Receta
              </h1>
              <p className="text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                Completa los campos para agregar tu receta a la colección
              </p>
            </div>

            <RecipeEditor
              onSuccess={(recipe) => {
                console.log('✅ Receta creada, redirigiendo a detalle...');
                // Redirigir al detalle (cuando esté implementado)
                // Por ahora, volver a la lista
                navigate('/recipes');
              }}
              onCancel={() => {
                navigate('/recipes');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
