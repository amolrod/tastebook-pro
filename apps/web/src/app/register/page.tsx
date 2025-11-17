import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ChefHat, Shield, Zap, Heart } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        // Mensajes más específicos
        if (error.message.includes('invalid')) {
          toast.error('Email inválido. Verifica que las confirmaciones de email estén deshabilitadas en Supabase o usa un email real.');
        } else if (error.message.includes('already registered')) {
          toast.error('Este email ya está registrado. Intenta iniciar sesión.');
        } else {
          toast.error(error.message || 'Error al crear la cuenta');
        }
        return;
      }

      toast.success('¡Cuenta creada exitosamente! Revisa tu email para confirmar (si está habilitado).');
      navigate('/login');
    } catch (error) {
      console.error('Error inesperado:', error);
      toast.error('Error inesperado al crear la cuenta');
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
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
                  Comienza tu viaje culinario
                </p>
              </div>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sora mb-2">
                  Configuración rápida
                </h3>
                <p className="text-white/70 font-inter leading-relaxed">
                  Crea tu cuenta en menos de un minuto y empieza a organizar tus recetas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sora mb-2">
                  Totalmente seguro
                </h3>
                <p className="text-white/70 font-inter leading-relaxed">
                  Tus datos están protegidos con cifrado de nivel empresarial
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold font-sora mb-2">
                  100% gratuito
                </h3>
                <p className="text-white/70 font-inter leading-relaxed">
                  Acceso completo a todas las funciones sin costo alguno
                </p>
              </div>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
          >
            <p className="text-white/90 font-inter italic mb-3 leading-relaxed">
              "Tastebook Pro ha transformado completamente la forma en que cocino. Ahora tengo todas mis recetas organizadas y puedo planificar mis comidas de la semana en minutos."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                MG
              </div>
              <div>
                <p className="font-semibold font-sora">María González</p>
                <p className="text-sm text-white/70 font-inter">Chef Casera</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-[#0A0A0A] overflow-y-auto"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
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
                <UserPlus className="text-[#10b981]" size={24} strokeWidth={2} />
              </div>
              <h2 className="text-3xl font-bold text-black dark:text-white font-sora">
                Crear Cuenta
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-inter text-sm">
              Completa tus datos para empezar
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Nombre completo */}
            <Input
              id="fullName"
              type="text"
              label="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              placeholder="Juan Pérez"
              leftIcon={<User size={20} />}
            />

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
              minLength={6}
              autoComplete="new-password"
              placeholder="••••••••"
              helperText="Mínimo 6 caracteres"
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

            {/* Confirm Password */}
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              leftIcon={<Lock size={20} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full mt-6"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </motion.form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-[#333333]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-[#0A0A0A] text-gray-600 dark:text-gray-400 font-inter">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Iniciar Sesión
            </Button>
          </motion.div>

          {/* Footer */}
          <p className="text-center text-gray-500 dark:text-gray-500 text-xs mt-6 font-inter">
            Al crear una cuenta aceptas nuestros{' '}
            <a href="#" className="text-[#10b981] hover:text-[#059669] underline transition-colors">
              términos y condiciones
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
