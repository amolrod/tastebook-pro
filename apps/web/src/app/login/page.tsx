import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Eye, EyeOff, ChefHat, Sparkles, TrendingUp, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || 'Error al iniciar sesión');
        return;
      }

      toast.success('¡Bienvenido de vuelta!');
      navigate('/');
    } catch (error) {
      toast.error('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0A0A0A]">
      {/* Left Side - Visual/Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                <ChefHat size={48} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-5xl font-bold font-sora tracking-tight">
                  Tastebook Pro
                </h1>
                <p className="text-white/80 text-lg font-inter mt-1">
                  Tu recetario digital inteligente
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Sparkles size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sora mb-2">
                  Organiza tus recetas
                </h3>
                <p className="text-white/70 font-inter leading-relaxed">
                  Guarda, categoriza y accede a todas tus recetas favoritas en un solo lugar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sora mb-2">
                  Planifica tus comidas
                </h3>
                <p className="text-white/70 font-inter leading-relaxed">
                  Crea menús semanales y genera listas de compra automáticamente
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sora mb-2">
                  Comparte con la comunidad
                </h3>
                <p className="text-white/70 font-inter leading-relaxed">
                  Descubre recetas de otros usuarios y comparte tus creaciones
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-6"
          >
            <div className="text-center">
              <p className="text-4xl font-bold font-sora mb-1">1000+</p>
              <p className="text-white/70 text-sm font-inter">Recetas</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold font-sora mb-1">500+</p>
              <p className="text-white/70 text-sm font-inter">Usuarios</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold font-sora mb-1">4.8★</p>
              <p className="text-white/70 text-sm font-inter">Rating</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#0A0A0A]"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo (only visible on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl mb-4">
              <ChefHat size={32} className="text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white font-sora mb-1">
              Tastebook Pro
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-inter text-sm">
              Tu recetario digital inteligente
            </p>
          </div>

          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#10b981]/10 rounded-xl">
                <LogIn className="text-[#10b981]" size={24} strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-black dark:text-white font-sora">
                Iniciar Sesión
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-inter text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <Input
              id="email"
              type="email"
              label="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@email.com"
              leftIcon={<Mail size={20} />}
            />

            {/* Password */}
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              leftIcon={<Lock size={20} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-[#10b981] hover:text-[#059669] font-inter font-semibold transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full mt-2"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </motion.form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-[#333333]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-[#0A0A0A] text-gray-600 dark:text-gray-400 font-inter">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a Register */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/register')}
              className="w-full"
            >
              Crear cuenta nueva
            </Button>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-gray-500 dark:text-gray-500 text-xs mt-6 font-inter">
            Al iniciar sesión aceptas nuestros{' '}
            <a href="#" className="text-[#10b981] hover:text-[#059669] underline transition-colors">
              términos y condiciones
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

