import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import WelcomeModal from '@/components/WelcomeModal';
import BusinessSelectorModal from '@/components/BusinessSelectorModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { 
    isLoading, 
    showWelcomeModal, 
    setShowWelcomeModal, 
    showBusinessSelector,
    setShowBusinessSelector,
    userBusinesses,
    handleLogin, 
    handleBusinessSelect,
    handleNavigateToRestaurant 
  } = useAuth();

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="w-full max-w-sm space-y-6 glass-container p-8 shadow-2xl">
        {isLoading ? (
          <div className="space-y-6 text-center">
            <div className="text-center">
              <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto animate-bounce">
                <rect width="32" height="32" rx="4" fill="var(--cartaai-red)"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" transform="rotate(5 16 16)">AI</text>
              </svg>
              <h2 className="mt-6 text-2xl font-semibold text-cartaai-white">
                Iniciando sesión
              </h2>
              <p className="mt-2 text-sm text-cartaai-white/80">
                Por favor, espere mientras verificamos sus credenciales...
              </p>
            </div>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="text-center">
              <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                <rect width="32" height="32" rx="4" fill="var(--cartaai-red)"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" transform="rotate(5 16 16)">AI</text>
                <circle cx="28" cy="4" r="2" fill="black"/>
                <circle cx="28" cy="4" r="1" fill="var(--cartaai-red)"/>
                <path d="M28 4H4" stroke="black" strokeWidth="2"/>
              </svg>
              <h2 className="mt-6 text-3xl font-bold text-gray-800">
                Iniciar Sesión
              </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
              <div className="space-y-4">
                <div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="glass-input text-cartaai-white"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="glass-input text-cartaai-white pr-10"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-cartaai-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox id="remember-me" className="h-4 w-4 text-cartaai-red focus:ring-cartaai-red" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-cartaai-white">
                    Recordarme
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-cartaai-red hover:text-cartaai-red/80">
                    ¿Olvidó su contraseña?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-red-600 dark:hover:bg-red-800 hover:bg-red-500 text-white backdrop-blur-sm transition-all duration-300"
                >
                  Iniciar sesión
                </Button>
              </div>
              <div className="text-center mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-400/30 text-cartaai-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  onClick={() => navigate('/registro')}
                >
                  Crear cuenta nueva
                </Button>
              </div>
            </form>
          </>
        )}
      </div>

      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onNavigate={handleNavigateToRestaurant}
      />

      <BusinessSelectorModal
        isOpen={showBusinessSelector}
        onClose={() => setShowBusinessSelector(false)}
        businesses={userBusinesses}
        onSelect={handleBusinessSelect}
      />
    </motion.div>
  );
};

export default LoginPage;