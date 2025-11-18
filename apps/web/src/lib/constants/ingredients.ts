/**
 * Sistema de categorización automática de ingredientes
 * 
 * Estrategia: Diccionario frontend con 100+ ingredientes comunes
 * - Sin dependencias externas
 * - Matching exacto y parcial
 * - Normalización de nombres (acentos, plurales)
 * - Fallback a categoría "Otros"
 */

export type IngredientCategory =
  | 'vegetables'
  | 'fruits'
  | 'meats'
  | 'fish'
  | 'dairy'
  | 'grains'
  | 'pantry'
  | 'spices'
  | 'others';

/**
 * Metadata de cada categoría
 * Incluye: label en español, icon emoji, color hex
 */
export const INGREDIENT_CATEGORIES: Record<IngredientCategory, {
  label: string;
  icon: string;
  color: string;
}> = {
  vegetables: {
    label: 'Verduras y Hortalizas',
    icon: '🥬',
    color: '#10b981',
  },
  fruits: {
    label: 'Frutas',
    icon: '🍎',
    color: '#f59e0b',
  },
  meats: {
    label: 'Carnes',
    icon: '🥩',
    color: '#ef4444',
  },
  fish: {
    label: 'Pescados y Mariscos',
    icon: '🐟',
    color: '#06b6d4',
  },
  dairy: {
    label: 'Lácteos y Huevos',
    icon: '🥛',
    color: '#3b82f6',
  },
  grains: {
    label: 'Cereales y Legumbres',
    icon: '🌾',
    color: '#d97706',
  },
  pantry: {
    label: 'Despensa',
    icon: '🥫',
    color: '#8b5cf6',
  },
  spices: {
    label: 'Especias y Condimentos',
    icon: '🧂',
    color: '#ec4899',
  },
  others: {
    label: 'Otros',
    icon: '📦',
    color: '#6b7280',
  },
};

/**
 * Diccionario de ingredientes comunes con sus categorías
 * Formato: nombre normalizado (lowercase, sin acentos) -> categoría
 * 
 * Total: ~120 ingredientes
 */
export const INGREDIENT_DICTIONARY: Record<string, IngredientCategory> = {
  // Verduras y Hortalizas (25 items)
  'tomate': 'vegetables',
  'cebolla': 'vegetables',
  'ajo': 'vegetables',
  'zanahoria': 'vegetables',
  'papa': 'vegetables',
  'patata': 'vegetables',
  'lechuga': 'vegetables',
  'espinaca': 'vegetables',
  'brocoli': 'vegetables',
  'coliflor': 'vegetables',
  'pimiento': 'vegetables',
  'pimenton': 'vegetables',
  'chile': 'vegetables',
  'calabacin': 'vegetables',
  'berenjena': 'vegetables',
  'pepino': 'vegetables',
  'apio': 'vegetables',
  'champinon': 'vegetables',
  'seta': 'vegetables',
  'hongo': 'vegetables',
  'aguacate': 'vegetables',
  'esparrago': 'vegetables',
  'remolacha': 'vegetables',
  'nabo': 'vegetables',
  'rabano': 'vegetables',
  'col': 'vegetables',
  'repollo': 'vegetables',
  'puerro': 'vegetables',
  'calabaza': 'vegetables',

  // Frutas (21 items)
  'manzana': 'fruits',
  'platano': 'fruits',
  'banana': 'fruits',
  'naranja': 'fruits',
  'limon': 'fruits',
  'lima': 'fruits',
  'fresa': 'fruits',
  'frambuesa': 'fruits',
  'arandano': 'fruits',
  'mora': 'fruits',
  'uva': 'fruits',
  'sandia': 'fruits',
  'melon': 'fruits',
  'pina': 'fruits',
  'mango': 'fruits',
  'papaya': 'fruits',
  'pera': 'fruits',
  'durazno': 'fruits',
  'melocoton': 'fruits',
  'ciruela': 'fruits',
  'cereza': 'fruits',
  'kiwi': 'fruits',

  // Carnes (16 items)
  'pollo': 'meats',
  'pechuga': 'meats',
  'muslo': 'meats',
  'res': 'meats',
  'ternera': 'meats',
  'carne': 'meats',
  'cerdo': 'meats',
  'costilla': 'meats',
  'chuleta': 'meats',
  'jamon': 'meats',
  'salchicha': 'meats',
  'chorizo': 'meats',
  'tocino': 'meats',
  'bacon': 'meats',
  'pavo': 'meats',
  'cordero': 'meats',

  // Pescados y Mariscos (14 items)
  'salmon': 'fish',
  'atun': 'fish',
  'trucha': 'fish',
  'merluza': 'fish',
  'bacalao': 'fish',
  'pescado': 'fish',
  'camaron': 'fish',
  'gamba': 'fish',
  'langostino': 'fish',
  'mejillon': 'fish',
  'almeja': 'fish',
  'calamar': 'fish',
  'pulpo': 'fish',
  'langosta': 'fish',

  // Lácteos y Huevos (14 items)
  'leche': 'dairy',
  'queso': 'dairy',
  'yogur': 'dairy',
  'yogurt': 'dairy',
  'crema': 'dairy',
  'nata': 'dairy',
  'mantequilla': 'dairy',
  'manteca': 'dairy',
  'huevo': 'dairy',
  'mozzarella': 'dairy',
  'parmesano': 'dairy',
  'cheddar': 'dairy',
  'ricotta': 'dairy',
  'requeson': 'dairy',

  // Cereales y Legumbres (15 items)
  'arroz': 'grains',
  'pasta': 'grains',
  'fideo': 'grains',
  'espagueti': 'grains',
  'macarron': 'grains',
  'pan': 'grains',
  'harina': 'grains',
  'avena': 'grains',
  'quinoa': 'grains',
  'lenteja': 'grains',
  'garbanzo': 'grains',
  'frijol': 'grains',
  'alubia': 'grains',
  'judia': 'grains',
  'soja': 'grains',

  // Despensa (12 items)
  'aceite': 'pantry',
  'vinagre': 'pantry',
  'azucar': 'pantry',
  'sal': 'pantry',
  'miel': 'pantry',
  'salsa': 'pantry',
  'caldo': 'pantry',
  'conserva': 'pantry',
  'mayonesa': 'pantry',
  'ketchup': 'pantry',
  'mostaza': 'pantry',
  'mermelada': 'pantry',

  // Especias y Condimentos (15 items)
  'pimienta': 'spices',
  'oregano': 'spices',
  'albahaca': 'spices',
  'perejil': 'spices',
  'cilantro': 'spices',
  'comino': 'spices',
  'curry': 'spices',
  'paprika': 'spices',
  'canela': 'spices',
  'jengibre': 'spices',
  'vainilla': 'spices',
  'laurel': 'spices',
  'tomillo': 'spices',
  'romero': 'spices',
  'nuez moscada': 'spices',
};

/**
 * Normalizar nombre de ingrediente para búsqueda
 * 
 * Pasos:
 * 1. Convierte a lowercase
 * 2. Quita acentos usando NFD normalization
 * 3. Quita 's' final (plurales simples: tomates -> tomate)
 * 4. Trim whitespace
 * 
 * @example
 * normalizeIngredientName('Tomates') → 'tomate'
 * normalizeIngredientName('Pimientos rojos') → 'pimiento rojo'
 */
export function normalizeIngredientName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/s\b/g, '') // Quitar 's' al final de palabras (plurales)
    .trim();
}

/**
 * Categorizar un ingrediente usando el diccionario
 * 
 * Estrategia:
 * 1. Buscar coincidencia exacta en diccionario
 * 2. Buscar coincidencia parcial (contiene o está contenido)
 * 3. Fallback a 'others'
 * 
 * @example
 * categorizeIngredient('Tomates cherry') → 'vegetables'
 * categorizeIngredient('Pechuga de pollo') → 'meats'
 * categorizeIngredient('Ingrediente raro') → 'others'
 */
export function categorizeIngredient(ingredientName: string): IngredientCategory {
  const normalized = normalizeIngredientName(ingredientName);
  
  // Buscar coincidencia exacta
  if (INGREDIENT_DICTIONARY[normalized]) {
    return INGREDIENT_DICTIONARY[normalized];
  }
  
  // Buscar coincidencia parcial (el nombre contiene una palabra clave)
  for (const [key, category] of Object.entries(INGREDIENT_DICTIONARY)) {
    if (normalized.includes(key) || key.includes(normalized.split(' ')[0])) {
      return category;
    }
  }
  
  // Fallback a "Otros"
  return 'others';
}
