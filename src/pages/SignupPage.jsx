import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import SignupForm from '@/components/signup/SignupForm';
import { motion } from "framer-motion";
import { ChartBar, Clock, Users, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApiUrls } from '@/config/api';

const SignupPage = () => {
  const API_URLS = getApiUrls();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...signupData } = data;
      
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const result = await response.json();

      if (result.type === "1") {
        toast.success('Registro exitoso');
        navigate('/login');
      } else {
        toast.error(result.message || 'Error al registrar');
      }
    } catch (error) {
      toast.error('Error al registrar usuario');
      console.error('Error de registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <ChartBar className="w-6 h-6" />,
      title: "Análisis en tiempo real",
      description: "Visualiza el rendimiento de tu restaurante con métricas detalladas"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Gestión eficiente",
      description: "Optimiza tus operaciones y ahorra tiempo en la administración"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Control de personal",
      description: "Administra fácilmente los turnos y roles de tu equipo"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col md:flex-row relative"
    >
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center"
        onClick={() => navigate('/login')}
      >
        <ChevronLeft className="h-6 w-6 text-gray-100" />
      </Button>

      {/* Sección del formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 order-2 md:order-1">
        <div className="w-full max-w-md space-y-6 glass-container p-6 md:p-8">
          <div className="text-center">
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                <rect width="32" height="32" rx="4" fill="var(--cartaai-red)"/>
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" transform="rotate(5 16 16)">AI</text>
                <circle cx="28" cy="4" r="2" fill="black"/>
                <circle cx="28" cy="4" r="1" fill="var(--cartaai-red)"/>
                <path d="M28 4H4" stroke="black" strokeWidth="2"/>
              </svg>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-700">Crear Cuenta</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Ingresa tus datos para registrarte
            </p>
          </div>

          <SignupForm onSubmit={handleSubmit} isLoading={isLoading} />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
            <button
              onClick={() => navigate('/login')}
              className="text-cartaai-red hover:underline font-medium"
            >
              Inicia sesión
            </button>
          </div>
        </div>
      </div>

      {/* Sección lateral informativa */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-cartaai-red/90 to-cartaai-red p-6 md:p-8 text-white flex-col justify-center order-1 md:order-2 flex">
        <div className="max-w-lg mx-auto">
          <motion.h2 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl font-bold mb-4 md:mb-6"
          >
            Transforma tu restaurante con tecnología inteligente
          </motion.h2>
          
          <motion.p 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg mb-8 md:mb-12 opacity-90"
          >
            Únete a cientos de restaurantes que ya optimizaron su gestión con nuestra plataforma integral.
          </motion.p>

          <div className="space-y-6 md:space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-white/10 p-2 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg md:text-xl mb-1">{feature.title}</h3>
                  <p className="opacity-80 text-sm md:text-base">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupPage;