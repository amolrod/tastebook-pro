# Guía de Configuración - Tastebook Pro

Guía completa paso a paso para configurar el entorno de desarrollo de Tastebook Pro.

## Requisitos Previos

- **Node.js** 18.0+
- **pnpm** 8.0+ (recomendado) o npm
- **Git** para control de versiones
- Cuenta en **Supabase** (tier gratuito)
- Cuenta en **Vercel** (opcional, para deployment)

## Instalación Paso a Paso

### 1. Configurar Repositorio Local

```bash
# Clonar repositorio
git clone https://github.com/amolrod/tastebook-pro.git
cd tastebook-pro

# Instalar dependencias globales
cd apps/web
pnpm install
```

### 2. Configurar Supabase

#### 2.1 Crear Proyecto en Supabase

1. Ir a https://supabase.com
2. Crear nuevo proyecto
3. Guardar:
   - Project URL
   - Anon/Public Key
   - Service Role Key (para operaciones admin)

#### 2.2 Configurar Base de Datos

```sql
-- Ejecutar en Supabase SQL Editor
-- Ver esquema completo en DATABASE.md

-- Crear tablas principales
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  steps JSONB NOT NULL,
  prep_time INTEGER,
  cook_time INTEGER,
  servings INTEGER DEFAULT 4,
  difficulty TEXT CHECK (difficulty IN ('facil', 'media', 'dificil')),
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can view public recipes"
  ON recipes FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own recipes"
  ON recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  USING (auth.uid() = user_id);
```

#### 2.3 Configurar Storage

```bash
# En Supabase Dashboard > Storage

1. Crear bucket: recipe-images
2. Configurar políticas:
   - Public read: Permitir lectura anónima
   - Authenticated write: Solo usuarios autenticados pueden subir
   - Max file size: 5MB
   - Allowed mime types: image/jpeg, image/png, image/webp
```

### 3. Configurar Variables de Entorno

```bash
# Crear archivo .env en apps/web/
touch .env
```

Contenido del `.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui

# Opcional: Features Avanzadas
STRIPE_SECRET_KEY=sk_test_xxx
GOOGLE_MAPS_API_KEY=tu-google-maps-key

# Development
NODE_ENV=development
```

### 4. Crear .env.example (Template)

```bash
# Crear template para otros desarrolladores
cp .env .env.example

# Editar .env.example y reemplazar valores reales con placeholders
```

Contenido de `.env.example`:

```env
# Supabase Configuration
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key

# Opcional
STRIPE_SECRET_KEY=sk_test_xxx
GOOGLE_MAPS_API_KEY=tu-key
```

### 5. Iniciar Servidor de Desarrollo

```bash
cd apps/web
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## Configuración de Git

```bash
# Verificar configuración Git
git config user.name
git config user.email

# Configurar si es necesario
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# Verificar remoto
git remote -v
```

## Verificación de Instalación

### Checklist

- [ ] Node.js instalado (`node --version`)
- [ ] pnpm instalado (`pnpm --version`)
- [ ] Dependencias instaladas sin errores
- [ ] Archivo .env creado con keys de Supabase
- [ ] Base de datos configurada en Supabase
- [ ] Storage bucket creado
- [ ] Servidor dev arranca sin errores
- [ ] TypeScript compila sin errores (`pnpm typecheck`)

### Comandos de Verificación

```bash
# Verificar Node.js
node --version  # Debe ser 18.0+

# Verificar pnpm
pnpm --version  # Debe ser 8.0+

# Verificar tipos TypeScript
pnpm typecheck

# Verificar que servidor dev arranca
pnpm dev
```

## Solución de Problemas Comunes

### Error: Module not found

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
pnpm install
```

### Error: Supabase connection failed

- Verificar que SUPABASE_URL y SUPABASE_ANON_KEY están correctos
- Verificar que el proyecto Supabase está activo
- Revisar reglas RLS en Supabase Dashboard

### Error: TypeScript compilation

```bash
# Regenerar tipos
pnpm typecheck

# Verificar tsconfig.json
cat tsconfig.json
```

### Error: Puerto ya en uso

```bash
# Cambiar puerto en vite.config.ts
# O matar proceso en puerto 5173
lsof -ti:5173 | xargs kill -9
```

## Próximos Pasos

1. Revisar [ARCHITECTURE.md](./ARCHITECTURE.md) para entender estructura
2. Revisar [DATABASE.md](./DATABASE.md) para esquema completo
3. Empezar desarrollo siguiendo [ROADMAP.md](./ROADMAP.md)

## Recursos Adicionales

- [Documentación Supabase](https://supabase.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query)
