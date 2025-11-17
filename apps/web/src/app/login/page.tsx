import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Eye, EyeOff, ChefHat } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

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
    <div className="min-h-screen h-screen overflow-hidden bg-gradient-to-br from-[#10b981] via-[#059669] to-[#047857] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/95 backdrop-blur-sm rounded-3xl mb-4 shadow-2xl">
            <ChefHat className="text-[#10b981]" size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-bold text-white font-sora mb-2 tracking-tight">
            Tastebook Pro
          </h1>
          <p className="text-white/90 font-inter text-sm">
            Tu recetario digital inteligente
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white/95 backdrop-blur-md dark:bg-[#1E1E1E]/95 rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#10b981]/10 rounded-xl">
              <LogIn className="text-[#10b981]" size={24} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-bold text-black dark:text-white font-sora">
              Iniciar Sesión
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full mt-6"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-[#333333]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 font-inter">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a Register */}
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate('/register')}
            className="w-full"
          >
            Crear cuenta nueva
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-xs mt-6 font-inter">
          Al iniciar sesión aceptas nuestros{' '}
          <a href="#" className="underline hover:text-white transition-colors">
            términos y condiciones
          </a>
        </p>
      </div>
    </div>
  );
}

