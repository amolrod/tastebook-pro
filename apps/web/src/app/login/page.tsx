import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🍳</span>
          </div>
          <h1 className="text-3xl font-bold text-white font-sora mb-2">
            Tastebook Pro
          </h1>
          <p className="text-white/80 font-inter">
            Tu recetario digital inteligente
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <LogIn className="text-[#10b981]" size={24} />
            <h2 className="text-2xl font-bold text-black dark:text-white font-sora">
              Iniciar Sesión
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-black dark:text-white font-inter">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 border border-[#E6E6E6] dark:border-[#333333] rounded-lg bg-white dark:bg-[#1E1E1E] text-black dark:text-white font-inter focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E6E6E6] dark:border-[#333333]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#1E1E1E] text-gray-500 font-inter">
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a Register */}
          <Link
            to="/register"
            className="block w-full py-3 text-center border-2 border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-white font-semibold rounded-lg transition-colors font-inter"
          >
            Crear cuenta nueva
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-white/70 text-sm mt-6 font-inter">
          Al iniciar sesión aceptas nuestros{' '}
          <a href="#" className="underline hover:text-white">
            términos y condiciones
          </a>
        </p>
      </div>
    </div>
  );
}
