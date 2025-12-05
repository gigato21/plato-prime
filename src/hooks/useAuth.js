import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/slices/authSlice';
import { getApiUrls } from '@/config/api';
import { toast } from 'sonner';

// Variable para controlar si se usa el mock o no
const USE_MOCK = false; // Cambia a false cuando quieras conectarte al backend real

export const useAuth = () => {
  const API_URLS = getApiUrls();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userBusinesses, setUserBusinesses] = useState([]);
  const [showBusinessSelector, setShowBusinessSelector] = useState(false);
  const [showSetupOptions, setShowSetupOptions] = useState(false);

  // Función para simular inicio de sesión automático al cargar la aplicación
  useEffect(() => {
    if (USE_MOCK) {
      const isAuthenticated = localStorage.getItem('authState');
      if (!isAuthenticated) {
        handleMockLogin();
      }
    }
  }, []);

  // Función para simular inicio de sesión sin backend
  const handleMockLogin = () => {
    setIsLoading(true);
    
    // Datos de usuario mock con rol admin
    const mockUserData = {
      _id: 'mock-user-id-123',
      name: 'Usuario Admin',
      email: 'admin@example.com',
      phone: '123456789',
      role: { name: 'admin' }
    };
    
    // Token mock
    const mockAccessToken = 'mock-access-token-xyz';
    
    // Negocios mock
    const mockBusinesses = [
      {
        _id: 'mock-business-id-1',
        name: 'Negocio Demo 1',
        subDomain: 'demo1',
        localId: 'local-1'
      },
      {
        _id: 'mock-business-id-2',
        name: 'Negocio Demo 2',
        subDomain: 'demo2',
        localId: 'local-2'
      }
    ];
    
    // Simular delay para que parezca real
    setTimeout(() => {
      // Si quieres ir directamente a la aplicación sin selector de negocios
      dispatch(login({ 
        accessToken: mockAccessToken,
        isAuthenticated: true,
        _id: mockUserData._id,
        name: mockUserData.name,
        email: mockUserData.email,
        phone: mockUserData.phone,
        role: mockUserData.role.name,
        subDomain: mockBusinesses[0].subDomain,
        localId: mockBusinesses[0].localId,
        businessName: mockBusinesses[0].name
      }));
      
      // Si prefieres mostrar el selector de negocios, comenta el dispatch anterior y descomenta esto:
      /*
      setUserBusinesses({
        user: mockUserData,
        accessToken: mockAccessToken,
        businesses: mockBusinesses
      });
      setShowBusinessSelector(true);
      */
      
      toast.success('Inicio de sesión mock exitoso');
      navigate('/');
      setIsLoading(false);
    }, 500);
  };

  const handleLogin = async (email, password) => {
    // Si estamos en modo mock, usar el login simulado
    if (USE_MOCK) {
      handleMockLogin();
      return;
    }
    
    setIsLoading(true);
    
    try {
      const loginResponse = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const loginResult = await loginResponse.json();
      
      if (loginResult.type === "1") {
        const accessToken = loginResult.data.accessToken;
        
        // Obtener información del usuario
        const userResponse = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        const userResult = await userResponse.json();
        if (userResult.type === "1") {
          const userData = userResult.data;
          
          // Obtener los negocios asociados al usuario
          const businessResponse = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-business/get-by-user-id/${userData._id}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          dispatch(login({
            accessToken: accessToken,
            _id: userData._id,
          }));
          const businessResult = await businessResponse.json();
          const businesses = businessResult || [];
          if(businesses.length < 1){
            dispatch(login({ 
              accessToken: accessToken,
              isAuthenticated: true,
              _id: userData._id,
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
              role: userData.role.name
            }));
            navigate('/setup-choice');
            return;
          }
          // Guardamos los datos del usuario y token junto con los negocios
          setUserBusinesses({
            user: userData,
            accessToken,
            businesses
          });
          setShowBusinessSelector(true);
          
          toast.success('Inicio de sesión exitoso');
          
        } else {
          toast.error('Error al obtener información del usuario');
        }
      } else {
        toast.error('Credenciales incorrectas');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
      console.error('Error de inicio de sesión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessSelect = (business) => {
    dispatch(login({ 
      ...userBusinesses.user,
      role: userBusinesses.user.role.name,
      subDomain: business.subDomain,
      localId: business.localId,
      businessName: business.name,
      isAuthenticated: true,
      accessToken: userBusinesses.accessToken,
    }));
    setShowBusinessSelector(false);
    navigate('/');
  };
  
  return {
    isLoading,
    showWelcomeModal,
    setShowWelcomeModal,
    showBusinessSelector,
    setShowBusinessSelector,
    userBusinesses,
    showSetupOptions,
    setShowSetupOptions,
    handleLogin,
    handleBusinessSelect,
    handleMockLogin, // Exportamos la función de mock para poder usarla desde otros componentes
    USE_MOCK // Exportamos la variable para saber si estamos en modo mock
  };
};