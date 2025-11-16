import { z } from 'zod';

/**
 * Schema de validación para un ingrediente individual
 */
export const IngredientSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  quantity: z.number().positive('Cantidad debe ser positiva'),
  unit: z.string().min(1, 'Unidad requerida'),
});

/**
 * Schema de validación para crear una receta
 * 
 * Valida todos los campos requeridos y opcionales con sus restricciones:
 * - Título: 3-100 caracteres
 * - Descripción: máximo 500 caracteres (opcional)
 * - Ingredientes: al menos 1 ingrediente
 * - Pasos: al menos 1 paso
 * - Tiempos: números positivos (opcional)
 * - Porciones: número positivo, default 4
 * - Dificultad: enum estricto
 * - Tags: array de strings (opcional)
 * - Público: booleano, default false
 */
export const CreateRecipeSchema = z.object({
  title: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  description: z.string()
    .max(500, 'Máximo 500 caracteres')
    .optional(),
  ingredients: z.array(IngredientSchema)
    .min(1, 'Al menos 1 ingrediente requerido'),
  steps: z.array(z.string().min(1, 'Paso no puede estar vacío'))
    .min(1, 'Al menos 1 paso requerido'),
  prep_time: z.number().int().positive().optional(),
  cook_time: z.number().int().positive().optional(),
  servings: z.number().int().positive().default(4),
  difficulty: z.enum(['facil', 'media', 'dificil']),
  tags: z.array(z.string()).optional(),
  is_public: z.boolean().default(false),
});

/**
 * Tipo TypeScript inferido del schema de validación
 */
export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;
