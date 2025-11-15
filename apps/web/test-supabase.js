// Test de conexión a Supabase
import { supabase } from '../src/lib/supabase.ts';

async function testConnection() {
  console.log('🔍 Probando conexión a Supabase...\n');
  
  try {
    // Test 1: Verificar cliente
    console.log('1. Cliente Supabase:', supabase ? '✅ Inicializado' : '❌ No inicializado');
    
    // Test 2: Contar recetas
    const { data: recipes, error, count } = await supabase
      .from('recipes')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (error) {
      console.error('❌ Error al consultar Supabase:', error.message);
      return;
    }
    
    console.log('2. Conexión a base de datos: ✅ Exitosa');
    console.log(`3. Recetas encontradas: ${count || 0}`);
    
    if (recipes && recipes.length > 0) {
      console.log('\n📋 Primeras recetas:');
      recipes.forEach((recipe, i) => {
        console.log(`   ${i + 1}. ${recipe.title} (${recipe.difficulty})`);
      });
    } else {
      console.log('\n⚠️  No hay recetas en la base de datos');
      console.log('   Ejecuta el SQL de seed_recipes.sql para insertar datos de prueba');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();
