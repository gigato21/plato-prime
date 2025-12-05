import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import { getApiUrls } from '@/config/api';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const API_URLS = getApiUrls();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);
  const accessToken = useSelector(state => state.auth.accessToken);
  
  // Referencias para los sonidos de notificación
  const defaultSoundRef = useRef(null);
  const errorSoundRef = useRef(null);

  // Inicializar los sonidos
  useEffect(() => {
    defaultSoundRef.current = new Audio('/notification-sound.mp3');
    defaultSoundRef.current.volume = 0.5;
    
    errorSoundRef.current = new Audio('/notification-error.mp3');
    errorSoundRef.current.volume = 0.5;
    
    return () => {
      if (defaultSoundRef.current) {
        defaultSoundRef.current.pause();
      }
      if (errorSoundRef.current) {
        errorSoundRef.current.pause();
      }
    };
  }, []);

  const fetchUnreadNotifications = useCallback(async () => {
    if (!accessToken || !localId || !subDomain) return;
    
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/notifications/unread/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.type === "1") {
          setNotifications(data.data);
          setUnreadCount(data.data.length);
        }
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  }, [accessToken, localId, subDomain]);

  // Reproducir el sonido adecuado según la categoría de la notificación
  const playNotificationSound = (category) => {
    try {
      // Para notificaciones de chatbot, usar el sonido de error
      if (category === 'chatbot' && errorSoundRef.current) {
        errorSoundRef.current.currentTime = 0;
        errorSoundRef.current.play().catch(error => {
          console.error('Error reproduciendo sonido de error:', error);
        });
      } 
      // Para otras categorías, usar el sonido predeterminado
      else if (defaultSoundRef.current) {
        defaultSoundRef.current.currentTime = 0;
        defaultSoundRef.current.play().catch(error => {
          console.error('Error reproduciendo sonido de notificación:', error);
        });
      }
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  };

  const onNotification = useCallback((notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Reproducir el sonido correspondiente según la categoría
    playNotificationSound(notification.category);
    
    toast({
      title: "Nueva notificación",
      description: notification.message || "Has recibido una nueva notificación",
      className: "notification-toast",
    });
  }, [toast]);

  // Efecto para recargar notificaciones cuando cambia el localId
  useEffect(() => {
    if (localId && subDomain) {
      fetchUnreadNotifications();
    }
  }, [localId, subDomain, fetchUnreadNotifications]);

  useEffect(() => {
    fetchUnreadNotifications();
  }, [fetchUnreadNotifications]);

  useEffect(() => {
    if (!localId || !subDomain) return;

    const socket = io(API_URLS.SERVICIOS_GENERALES_URL, {
      query: { localId, subDomain }
    });

    socket.on('connect', () => {
      // Socket conectado
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión en socket de notificaciones:', error);
    });

    socket.on('notification', (notification) => {
      onNotification(notification);
    });

    return () => {
      socket.disconnect();
    };
  }, [localId, subDomain, onNotification]);

  const value = {
    notifications,
    unreadCount,
    setUnreadCount,
    isModalOpen,
    setIsModalOpen,
    fetchUnreadNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};