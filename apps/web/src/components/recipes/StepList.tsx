'use client';

import { Plus, X } from 'lucide-react';

interface StepListProps {
  steps: string[];
  onChange: (steps: string[]) => void;
  errors?: string;
}

/**
 * Componente para gestionar lista dinámica de pasos de preparación
 * 
 * Features:
 * - Añadir/remover pasos
 * - Numeración automática
 * - Textarea expandible
 * - Diseño visual claro
 */
export function StepList({ steps, onChange, errors }: StepListProps) {
  const addStep = () => {
    onChange([...steps, '']);
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const updated = steps.map((step, i) => (i === index ? value : step));
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-black dark:text-white font-inter">
          Pasos de Preparación *
        </label>
        <button
          type="button"
          onClick={addStep}
          className="flex items-center gap-1 text-sm text-[#10b981] hover:text-[#059669] font-semibold transition-colors"
        >
          <Plus size={16} />
          Añadir Paso
        </button>
      </div>

      {steps.map((step, index) => (
        <div key={index} className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-semibold text-sm font-sora">
            {index + 1}
          </span>
          <textarea
            value={step}
            onChange={(e) => updateStep(index, e.target.value)}
            placeholder={`Paso ${index + 1}: Describe qué hacer...`}
            rows={2}
            className="flex-1 px-3 py-2 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter resize-none focus:outline-none focus:ring-2 focus:ring-[#10b981]"
          />
          <button
            type="button"
            onClick={() => removeStep(index)}
            className="p-2 text-red-500 hover:text-red-700 transition-colors self-start"
            aria-label="Eliminar paso"
          >
            <X size={20} />
          </button>
        </div>
      ))}

      {errors && (
        <p className="text-red-500 text-sm mt-1 font-inter">{errors}</p>
      )}
    </div>
  );
}
