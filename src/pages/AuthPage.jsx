import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ChartBar, Clock, Users, Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Email inválido');
const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres');

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    try {
      emailSchema.parse(formData.email);
    } catch (e) {
      newErrors.email = e.errors[0].message;
    }

    try {
      passwordSchema.parse(formData.password);
    } catch (e) {
      newErrors.password = e.errors[0].message;
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Credenciales incorrectas');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('Inicio de sesión exitoso');
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: formData.name
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email ya está registrado');
          } else {
            toast.error(error.message);
          }
          return;
        }

        // Update profile with name
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('profiles')
            .update({ name: formData.name })
            .eq('user_id', user.id);
        }

        toast.success('Cuenta creada exitosamente');
      }
    } catch (error) {
      toast.error('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
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
      className="min-h-screen flex flex-col md:flex-row"
    >
      {/* Form Section */}
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
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-700">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              {isLogin ? 'Ingresa tus credenciales para continuar' : 'Ingresa tus datos para registrarte'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-cartaai-red hover:bg-cartaai-red/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Iniciando...' : 'Creando cuenta...'}
                </>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-cartaai-red hover:underline font-medium"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
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

export default AuthPage;
