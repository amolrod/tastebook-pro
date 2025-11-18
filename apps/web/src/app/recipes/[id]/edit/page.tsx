'use client';

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useRecipe } from '../../../../hooks/useRecipes';
import { RecipeEditor } from '../../../../components/recipes/RecipeEditor';
import Sidebar from '../../../../components/Sidebar';
import Header from '../../../../components/Header';
import { LoadingSpinner } from '../../../../components/ui/LoadingSpinner';
import { ErrorMessage } from '../../../../components/ui/ErrorMessage';

/**
 * Página para editar una receta existente
 * 
 * Ruta: /recipes/[id]/edit
 * 
 * Features:
 * - Carga los datos de la receta existente
 * - Usa RecipeEditor en modo edición
 * - Redirección al detalle después de actualizar
 * - Validación de permisos (solo el dueño puede editar)
 */
export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: recipe, isLoading, error, refetch } = useRecipe(id!);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <Sidebar activePage="recipes" />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <Sidebar activePage="recipes" />
        <div className="flex-1 flex items-center justify-center p-4">
          <ErrorMessage
            error={error || new Error('Receta no encontrada')}
            onRetry={refetch}
          />
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
        <Sidebar onClose={() => setSidebarOpen(false)} activePage="recipes" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title="Editar Receta"
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-black dark:text-white font-sora mb-2">
                Editar Receta
              </h1>
              <p className="text-[#6E6E6E] dark:text-[#AAAAAA] font-inter">
                Actualiza los campos que desees modificar
              </p>
            </div>

            <RecipeEditor
              initialData={recipe}
              onSuccess={(updatedRecipe) => {
                console.log('✅ Receta actualizada, redirigiendo a detalle...');
                navigate(`/recipes/${id}`);
              }}
              onCancel={() => {
                navigate(`/recipes/${id}`);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Deshabilitar SSR para esta ruta
export const clientLoader = () => null;
