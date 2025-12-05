import { useEffect, useState } from 'react';
import { format} from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { addChat } from '../../../redux/slices/chatSlice';
import { setBotStates } from '../../../redux/slices/botStateSlice';
import { getApiUrls } from '@/config/api';
import { io } from 'socket.io-client';
import { fetchAllBotStates, updateReadStatus } from '../../../utils/botStateUtils';
import ChatListItem from './ChatListItem';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useNotifications } from '@/components/notifications/NotificationsProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle } from 'lucide-react';

const ChatList = ({ onChatSelect, activeChatId, selectedDate }) => {
  const API_URLS = getApiUrls();
  const [chats, setChats] = useState([]);
  const [initialStatesFetched, setInitialStatesFetched] = useState(false);
  const [unreadChats, setUnreadChats] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [botFilter, setBotFilter] = useState('all');
  const [selectedLocalId, setSelectedLocalId] = useState('all');
  const [locals, setLocals] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Usar el contexto de notificaciones global
  const { notifications, fetchUnreadNotifications } = useNotifications();
  
  const dispatch = useDispatch();
  const localId = useSelector(state => state.auth.localId);
  const subdomain = useSelector(state => state.auth.subDomain);
  const botStates = useSelector(state => state.botState.botStates);
  const [socket, setSocket] = useState(null);
  const isAdminUser = String(localId) === "-1";
  const token = useSelector(state => state.auth.accessToken);

  useEffect(() => {
    const newSocket = io(`${API_URLS.SERVICIOS_GENERALES_URL}`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      // Suscribirse a eventos de notificaciones para este usuario/local
      if (subdomain && localId) {
        newSocket.emit('subscribeToChatbotNotifications', {
          subDomain: subdomain,
          localId: localId
        });
      }
    });

    newSocket.on('newMessage', (message) => {
      if (message && message.content) {
        setUnreadChats(prev => new Set([...prev, message.clientPhone]));
        fetchChats();
      }
    });

    newSocket.on('botStateChange', ({ clientPhone, newState }) => {
      dispatch(setBotStates({ [clientPhone]: newState }));
    });

    return () => {
      if (newSocket) {
        // Desuscribirse de eventos antes de desconectar
        if (subdomain && localId) {
          newSocket.emit('unsubscribeFromChatbotNotifications', {
            subDomain: subdomain,
            localId: localId
          });
        }
        newSocket.disconnect();
      }
    };
  }, [dispatch, subdomain, localId, isAdminUser]);

  // Solicitar actualización de notificaciones cuando se monte el componente
  useEffect(() => {
    if (localId && subdomain && !isLoading) {
      fetchUnreadNotifications();
    }
  }, [localId, subdomain, isLoading, fetchUnreadNotifications]);

  useEffect(() => {
    const fetchLocals = async () => {
      if (!isAdminUser || !subdomain) return;
      
      try {
        const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/locals/${subdomain}`);
        const data = await response.json();
        if (data.data) {
          setLocals(data.data);
        }
      } catch (error) {
        console.error('Error al obtener los locales:', error);
      }
    };

    fetchLocals();
  }, [isAdminUser, subdomain]);

  const fetchChats = async () => {
    if (!localId || !subdomain) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/history/last-messages/${localId}/${subdomain}`);
      const data = await response.json();
      

      const allChats = data.map(chat => ({
        id: chat._id,
        name: chat.clientName || chat.clientPhone,
        phone: chat.clientPhone,
        chatbotNumber: chat.chatbotNumber,
        lastMessage: chat.content,
        time: format(new Date(chat.createdAt), 'HH:mm a'),
        orderStatus: null,
        date: new Date(chat.createdAt),
        isNewCustomer: !chat.clientName,
        localName: chat.localName,
        localId: chat.localId
      }))
      .sort((a, b) => b.date - a.date);

      if (!initialStatesFetched) {
        const botStatesMap = await fetchAllBotStates(subdomain, localId);
        dispatch(setBotStates(botStatesMap));
        setInitialStatesFetched(true);
      }

      dispatch(addChat(data.map(chat => ({
        id: chat._id,
        clientPhone: chat.clientPhone,
        chatbotNumber: chat.chatbotNumber,
      }))));
      
      setChats(allChats);
    } catch (error) {
      console.error('Error en la petición:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [selectedDate, dispatch, localId, subdomain]);

  const handleChatSelect = async (chat) => {
    await updateReadStatus(subdomain, localId, chat.phone, true);
    setUnreadChats(prev => {
      const newSet = new Set(prev);
      newSet.delete(chat.phone);
      return newSet;
    });
    onChatSelect(chat.id, chat.name, chat.orderStatus, chat.lastMessage, chat.phone, chat.chatbotNumber);
  };

  // Función para verificar si un chat tiene notificaciones
  const hasChatNotification = (phone) => {
    return notifications.some(notification => 
      notification.metadata && 
      notification.metadata.phoneNumber === phone && 
      !notification.isRead && 
      notification.category === 'chatbot'
    );
  };

  // Abrir modal para mostrar la notificación
  const handleShowNotification = (chat) => {
    console.log('Buscando notificación para el chat:', chat.phone);
    console.log('Todas las notificaciones:', notifications);
    
    const notification = notifications.find(n => {
      console.log('Evaluando notificación:', n);
      return n.metadata && 
        n.metadata.phoneNumber === chat.phone && 
        !n.isRead && 
        n.category === 'chatbot';
    });
    
    if (notification) {
      console.log('Notificación encontrada:', notification);
      console.log('Estructura de la notificación:', JSON.stringify(notification, null, 2));
      setSelectedNotification(notification);
      setShowNotificationModal(true);
    } else {
      console.log('No se encontró notificación para el chat:', chat.phone);
    }
  };

  // Nueva función para marcar notificación como leída con mejor depuración
  const markNotificationAsReadDebug = async (notification) => {
    console.log('Intentando marcar notificación como leída:', notification);
    
    if (!notification) {
      console.error('No se proporcionó una notificación');
      return;
    }
    
    // Intentar extraer el ID de diferentes propiedades posibles
    let notificationId = notification._id;
    
    if (!notificationId && notification.id) {
      notificationId = notification.id;
      console.log('Usando notification.id en lugar de _id:', notificationId);
    }
    
    console.log('ID de la notificación:', notificationId);
    
    if (!notificationId) {
      console.error('La notificación no tiene ID');
      console.error('Estructura completa de la notificación:', JSON.stringify(notification, null, 2));
      return;
    }
    
    if (!token) {
      console.error('No hay token disponible');
      return;
    }
    
    try {
      const url = `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/notifications/${notificationId}/read`;
      console.log('URL de la solicitud:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Respuesta del servidor:', response.status);
      
      if (response.ok) {
        console.log('Notificación marcada como leída correctamente');
        fetchUnreadNotifications();
      } else {
        const errorText = await response.text();
        console.error('Error en la respuesta:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const filteredChats = chats
    .filter(chat => format(chat.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd'))
    .filter(chat => {
      switch (botFilter) {
        case 'active':
          return botStates[chat.phone] === true;
        case 'inactive':
          return botStates[chat.phone] === false;
        default:
          return true;
      }
    })
    .filter(chat => {
      if (isAdminUser && selectedLocalId !== 'all') {
        return chat.localId === selectedLocalId;
      }
      return true;
    });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-cartaai-black">
        <LoadingSpinner />
      </div>
    );
  }

  const getLocalName = (localId) => {
    const local = locals.find(l => l.localId === localId);
    return local ? local.localDescripcion : `Local ${localId}`;
  };

  return (
    <div className="h-full flex flex-col bg-cartaai-black">
      <div className="p-4 space-y-4 border-b border-white/10">
        <Select value={botFilter} onValueChange={setBotFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filtrar por estado del bot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los chats</SelectItem>
            <SelectItem value="active">Bot activo</SelectItem>
            <SelectItem value="inactive">Bot inactivo</SelectItem>
          </SelectContent>
        </Select>

        {isAdminUser && (
          <Select value={selectedLocalId} onValueChange={setSelectedLocalId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por Local" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los locales</SelectItem>
              {locals.map((local) => (
                <SelectItem key={local.localId} value={local.localId}>
                  {local.localDescripcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            activeChatId={activeChatId}
            unreadChats={unreadChats}
            botEnabled={botStates[chat.phone]}
            onSelect={() => handleChatSelect(chat)}
            hasNotification={hasChatNotification(chat.phone)}
            onNotificationClick={(e) => {
              e.stopPropagation();
              handleShowNotification(chat);
            }}
          />
        ))}
      </div>

      {/* Modal para mostrar el detalle de la notificación */}
      <Dialog 
        open={showNotificationModal} 
        onOpenChange={setShowNotificationModal}
      >
        <DialogContent className="sm:max-w-md bg-cartaai-black text-white border border-yellow-500/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-5 w-5" />
              Alerta del sistema
            </DialogTitle>
            <DialogDescription className="text-white/80">
              {selectedNotification?.message}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {selectedNotification && (
              <>
                <div className="bg-cartaai-white/5 p-3 rounded-md text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Prioridad:</span>
                    <span className={`font-medium ${
                      selectedNotification.priority === 'high' 
                        ? 'text-red-500' 
                        : selectedNotification.priority === 'medium'
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                    }`}>
                      {selectedNotification.priority === 'high' 
                        ? 'Alta' 
                        : selectedNotification.priority === 'medium'
                          ? 'Media'
                          : 'Baja'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/60">Fecha:</span>
                    <span className="font-medium text-white">
                      {new Date(selectedNotification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/60">Número asociado:</span>
                    <span className="font-medium text-white">
                      {selectedNotification.metadata?.phoneNumber}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-600/20 hover:bg-gray-600/30 rounded-md"
                    onClick={() => setShowNotificationModal(false)}
                  >
                    Cerrar
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-600/20 hover:bg-yellow-600/30 rounded-md"
                    onClick={() => {
                      if (selectedNotification) {
                        console.log('Notificación seleccionada:', selectedNotification);
                        
                        if (!selectedNotification._id) {
                          console.error('La notificación no tiene un ID válido:', selectedNotification);
                        } else {
                          // Pasar el objeto completo en lugar de solo el ID
                          markNotificationAsReadDebug(selectedNotification);
                        }
                        
                        // Verificar si hay más notificaciones para el mismo chat
                        const currentPhoneNumber = selectedNotification.metadata?.phoneNumber;
                        if (currentPhoneNumber) {
                          const chatWithNotifications = filteredChats.find(chat => 
                            chat.phone === currentPhoneNumber
                          );
                          
                          if (chatWithNotifications) {
                            setTimeout(() => {
                              const hasMoreNotifications = notifications.some(n => 
                                n.metadata?.phoneNumber === chatWithNotifications.phone && 
                                !n.isRead && 
                                n.category === 'chatbot' &&
                                n._id !== selectedNotification._id
                              );
                              
                              if (hasMoreNotifications) {
                                handleShowNotification(chatWithNotifications);
                                return; // Si hay más notificaciones, no cerramos el modal
                              } else {
                                setShowNotificationModal(false);
                              }
                            }, 300); // Pequeño retraso para que fetchUnreadNotifications tenga tiempo de ejecutarse
                          } else {
                            setShowNotificationModal(false);
                          }
                        } else {
                          setShowNotificationModal(false);
                        }
                      } else {
                        setShowNotificationModal(false);
                      }
                    }}
                  >
                    Marcar como leída
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatList;