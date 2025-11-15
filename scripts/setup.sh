#!/bin/bash

# 🚀 Script de Configuración Inicial de Tastebook Pro
# Este script te ayuda a configurar las variables de entorno

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     🍳 Tastebook Pro - Configuración Inicial de Supabase     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

ENV_FILE="apps/web/.env.local"

# Verificar si ya existe .env.local
if [ -f "$ENV_FILE" ]; then
  echo "⚠️  El archivo .env.local ya existe."
  echo ""
  read -p "¿Deseas sobrescribirlo? (s/n): " overwrite
  if [ "$overwrite" != "s" ] && [ "$overwrite" != "S" ]; then
    echo "❌ Configuración cancelada."
    exit 0
  fi
  echo ""
fi

echo "📝 Por favor proporciona tus credenciales de Supabase:"
echo "   (Obtén estas en: https://supabase.com/dashboard/project/_/settings/api)"
echo ""

# Solicitar Supabase URL
read -p "🔗 SUPABASE_URL (https://xxxxx.supabase.co): " supabase_url

# Validar URL
if [[ ! $supabase_url =~ ^https://.*\.supabase\.co$ ]]; then
  echo "❌ Error: La URL debe ser formato https://xxxxx.supabase.co"
  exit 1
fi

echo ""

# Solicitar Supabase Anon Key
read -p "🔑 SUPABASE_ANON_KEY: " supabase_key

# Validar que la key no esté vacía
if [ -z "$supabase_key" ]; then
  echo "❌ Error: La clave anónima no puede estar vacía"
  exit 1
fi

echo ""
echo "📄 Creando archivo $ENV_FILE..."

# Crear el archivo .env.local
cat > "$ENV_FILE" << EOF
# Supabase Configuration
# Generado automáticamente por setup.sh

# Your Supabase project URL
VITE_SUPABASE_URL=$supabase_url

# Your Supabase anon/public key
VITE_SUPABASE_ANON_KEY=$supabase_key
EOF

echo "✅ Archivo .env.local creado exitosamente!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. Ejecuta el SQL en Supabase (docs/DATABASE.md)"
echo "   → Ve a SQL Editor y ejecuta el script completo"
echo ""
echo "2. Crea el bucket de Storage 'recipe-images'"
echo "   → Storage → Create bucket → Public: ✅"
echo ""
echo "3. Inicia el servidor de desarrollo:"
echo "   cd apps/web && pnpm dev"
echo ""
echo "4. Abre http://localhost:4000/recipes"
echo ""
echo "📚 Guía completa: docs/SUPABASE_SETUP.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ ¡Todo listo! Ahora puedes empezar a cocinar con Tastebook Pro!"
echo ""
