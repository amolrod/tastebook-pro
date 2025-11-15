-- =====================================================
-- RECETA DE PRUEBA PARA TASTEBOOK PRO
-- =====================================================
-- Ejecuta este SQL para crear una receta de prueba
-- Cópialo en SQL Editor de Supabase y haz clic en Run
-- =====================================================

-- Insertar receta de prueba
INSERT INTO recipes (
  title,
  description,
  ingredients,
  instructions,
  prep_time,
  cook_time,
  servings,
  difficulty,
  tags,
  nutrition,
  is_public
) VALUES (
  'Pasta Carbonara Clásica',
  'Receta auténtica italiana con panceta, huevos y queso pecorino. Simple pero deliciosa.',
  '[
    {"name": "Pasta (espagueti)", "quantity": 400, "unit": "g", "category": "Pasta"},
    {"name": "Panceta", "quantity": 200, "unit": "g", "category": "Carnes"},
    {"name": "Huevos", "quantity": 4, "unit": "unidades", "category": "Lácteos"},
    {"name": "Queso Pecorino Romano", "quantity": 100, "unit": "g", "category": "Lácteos"},
    {"name": "Pimienta negra", "quantity": 1, "unit": "cucharadita", "category": "Especias"},
    {"name": "Sal", "quantity": 1, "unit": "al gusto", "category": "Especias"}
  ]'::jsonb,
  '[
    "Poner a hervir agua con sal en una olla grande",
    "Cortar la panceta en cubos pequeños",
    "En un bol grande, batir los huevos con el queso pecorino rallado y pimienta negra",
    "Cocinar la pasta según instrucciones del paquete (al dente)",
    "Mientras tanto, dorar la panceta en una sartén hasta que esté crujiente",
    "Reservar un poco del agua de cocción de la pasta",
    "Escurrir la pasta y añadirla a la sartén con la panceta",
    "Retirar del fuego y agregar la mezcla de huevo, mezclando rápidamente",
    "Añadir agua de cocción si es necesario para crear una salsa cremosa",
    "Servir inmediatamente con más queso y pimienta"
  ]'::jsonb,
  15,
  15,
  4,
  'media',
  ARRAY['italiana', 'pasta', 'tradicional', 'rápida'],
  '{
    "calories": 550,
    "protein": 28,
    "carbs": 65,
    "fat": 18,
    "fiber": 3
  }'::jsonb,
  true
);

-- Insertar otra receta
INSERT INTO recipes (
  title,
  description,
  ingredients,
  instructions,
  prep_time,
  cook_time,
  servings,
  difficulty,
  tags,
  is_public
) VALUES (
  'Ensalada César',
  'Ensalada clásica con pollo a la parrilla, lechuga romana crujiente y aderezo César casero.',
  '[
    {"name": "Lechuga romana", "quantity": 2, "unit": "unidades", "category": "Verduras"},
    {"name": "Pechuga de pollo", "quantity": 300, "unit": "g", "category": "Carnes"},
    {"name": "Pan para crutones", "quantity": 100, "unit": "g", "category": "Panadería"},
    {"name": "Queso parmesano", "quantity": 50, "unit": "g", "category": "Lácteos"},
    {"name": "Aceite de oliva", "quantity": 3, "unit": "cucharadas", "category": "Aceites"},
    {"name": "Mayonesa", "quantity": 4, "unit": "cucharadas", "category": "Condimentos"},
    {"name": "Ajo", "quantity": 2, "unit": "dientes", "category": "Verduras"},
    {"name": "Jugo de limón", "quantity": 2, "unit": "cucharadas", "category": "Cítricos"},
    {"name": "Mostaza Dijon", "quantity": 1, "unit": "cucharadita", "category": "Condimentos"}
  ]'::jsonb,
  '[
    "Precalentar el horno a 180°C",
    "Cortar el pan en cubos y tostar en el horno con aceite hasta que estén dorados",
    "Sazonar el pollo con sal y pimienta, cocinar a la parrilla 6-7 minutos por lado",
    "Lavar y secar la lechuga, cortarla en trozos medianos",
    "Preparar el aderezo: mezclar mayonesa, ajo picado, jugo de limón, mostaza y parmesano rallado",
    "Cortar el pollo en tiras",
    "En un bowl grande, mezclar la lechuga con el aderezo",
    "Añadir los crutones y el pollo",
    "Decorar con más parmesano rallado",
    "Servir inmediatamente"
  ]'::jsonb,
  20,
  15,
  2,
  'facil',
  ARRAY['ensalada', 'saludable', 'pollo', 'americana'],
  true
);

-- Insertar receta vegetariana
INSERT INTO recipes (
  title,
  description,
  ingredients,
  instructions,
  prep_time,
  cook_time,
  servings,
  difficulty,
  tags,
  is_public
) VALUES (
  'Tacos Vegetarianos de Frijoles Negros',
  'Tacos saludables y deliciosos con frijoles negros especiados, aguacate fresco y salsa pico de gallo.',
  '[
    {"name": "Frijoles negros cocidos", "quantity": 400, "unit": "g", "category": "Legumbres"},
    {"name": "Tortillas de maíz", "quantity": 8, "unit": "unidades", "category": "Panadería"},
    {"name": "Aguacate", "quantity": 2, "unit": "unidades", "category": "Frutas"},
    {"name": "Tomate", "quantity": 3, "unit": "unidades", "category": "Verduras"},
    {"name": "Cebolla morada", "quantity": 1, "unit": "unidad", "category": "Verduras"},
    {"name": "Cilantro", "quantity": 1, "unit": "manojo", "category": "Hierbas"},
    {"name": "Lima", "quantity": 2, "unit": "unidades", "category": "Cítricos"},
    {"name": "Comino", "quantity": 1, "unit": "cucharadita", "category": "Especias"},
    {"name": "Pimentón", "quantity": 1, "unit": "cucharadita", "category": "Especias"}
  ]'::jsonb,
  '[
    "Calentar los frijoles en una sartén con comino y pimentón",
    "Machacar ligeramente los frijoles con un tenedor",
    "Calentar las tortillas en el comal",
    "Preparar pico de gallo: picar tomate, cebolla y cilantro, mezclar con jugo de lima",
    "Cortar el aguacate en rebanadas",
    "Armar los tacos: frijoles, aguacate, pico de gallo",
    "Añadir un chorrito de lima",
    "Servir caliente con más cilantro fresco"
  ]'::jsonb,
  15,
  10,
  4,
  'facil',
  ARRAY['mexicana', 'vegetariana', 'vegana', 'saludable', 'rápida'],
  true
);

-- =====================================================
-- ✅ RECETAS INSERTADAS
-- =====================================================
-- Ahora deberías ver 3 recetas en tu aplicación:
-- 1. Pasta Carbonara (Media dificultad)
-- 2. Ensalada César (Fácil)
-- 3. Tacos Vegetarianos (Fácil, Vegetariana)
-- 
-- Abre: http://localhost:4000/recipes
-- =====================================================
