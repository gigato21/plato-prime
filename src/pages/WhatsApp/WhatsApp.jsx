import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getApiUrls } from '@/config/api';
import ConfirmDialog from '@/components/ConfirmDialog';
import WhatsAppHeader from './components/WhatsAppHeader';
import WhatsAppContainer from './components/WhatsAppContainer';
import { useToast } from "@/components/ui/use-toast";
import { startOfDay } from 'date-fns';

const WhatsApp = () => {
  const API_URLS = getApiUrls();
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatName, setSelectedChatName] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(null);
  const [selectedOrderContext, setSelectedOrderContext] = useState(null);
  const [botEnabledChats, setBotEnabledChats] = useState({});
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [isGlobalConfirmDialogOpen, setIsGlobalConfirmDialogOpen] = useState(false);
  const [clientPhone, setClientPhone] = useState('');
  const [chatbotNumber, setChatbotNumber] = useState('');
  const [isGlobalBotEnabled, setIsGlobalBotEnabled] = useState(true);

  const subdomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBotStatus = async () => {
      try {
        const queryParams = new URLSearchParams({
          subDomain: subdomain,
          localId: localId
        });

        const response = await fetch(
          `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/bot-ctx/get-one?${queryParams}`
        );

        const data = await response.json();
        setIsGlobalBotEnabled(data.data.isOn);
      } catch (error) {
        console.error('Error al obtener el estado del bot:', error);
        toast({
          title: "Error",
          description: "No se pudo obtener el estado del bot",
          variant: "destructive",
        });
      }
    };

    fetchBotStatus();
  }, [subdomain, localId, toast]);

  const handleChatSelect = (chatId, chatName, orderStatus, orderContext, clientPhone, chatbotNumber) => {
    setSelectedChat(chatId);
    setSelectedChatName(chatName);
    setSelectedOrderStatus(orderStatus);
    setSelectedOrderContext(orderContext);
    setClientPhone(clientPhone);
    setChatbotNumber(chatbotNumber);
    if (!(clientPhone in botEnabledChats)) {
      setBotEnabledChats(prev => ({ ...prev, [clientPhone]: true }));
    }
  };

  const handleDateChange = (newDate) => {
    // Aseguramos que la fecha esté al inicio del día para evitar problemas con las horas
    setSelectedDate(startOfDay(newDate));
  };

  const handleGlobalBotToggle = () => {
    if (isGlobalBotEnabled) {
      setIsGlobalConfirmDialogOpen(true);
    } else {
      handleConfirmGlobalBotEnable();
    }
  };

  const handleConfirmGlobalBotDisable = async () => {
    await updateGlobalBotStatus(false);
    setIsGlobalBotEnabled(false);
    setIsGlobalConfirmDialogOpen(false);
  };

  const handleConfirmGlobalBotEnable = async () => {
    await updateGlobalBotStatus(true);
    setIsGlobalBotEnabled(true);
  };

  const updateGlobalBotStatus = async (enable) => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/bot-ctx/update-is-on`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subDomain: subdomain,
          localId: localId,
          isOn: enable
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado global del bot');
      }

      toast({
        title: enable ? "Bot Activado" : "Bot Desactivado",
        description: enable ? "El bot global ha sido activado" : "El bot global ha sido desactivado",
        variant: enable ? "default" : "destructive",
      });

      setIsGlobalBotEnabled(enable);
    } catch (error) {
      console.error('Error al actualizar el estado global del bot:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del bot",
        variant: "destructive",
      });
      setIsGlobalBotEnabled(!enable);
    }
  };

  const handleChatBotToggle = async (chatId) => {
    if (!isGlobalBotEnabled) return;
    
    // Almacenamos el estado actual para no modificarlo hasta confirmar el éxito de la operación
    const currentState = botEnabledChats[clientPhone] || false;
    const newBotState = !currentState;
    
    console.log("handleChatBotToggle - Estado actual:", currentState, "Nuevo estado:", newBotState);
    
    try {
      // Primero hacemos la petición y esperamos la respuesta
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-ctx/update-chat-on`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subDomain: subdomain,
          localId: localId,
          clientPhone: clientPhone,
          chatIsOn: newBotState
        })
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el estado del bot');
      }
      
      // Solo actualizamos el estado después de una respuesta exitosa
      setBotEnabledChats(prev => ({ ...prev, [clientPhone]: newBotState }));

      toast({
        title: newBotState ? "Bot Activado" : "Bot Desactivado",
        description: `El bot ha sido ${newBotState ? 'activado' : 'desactivado'} para este chat`,
        variant: newBotState ? "default" : "destructive",
      });
      
      // Eliminamos esta parte que causa el problema de recarga que podría estar
      // desencadenando múltiples actualizaciones de estado
      /*
      setSelectedChat(null);
      setTimeout(() => setSelectedChat(chatId), 0);
      */
    } catch (error) {
      console.error('Error al cambiar el estado del bot:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del bot para este chat",
        variant: "destructive",
      });
      
      // Eliminamos también esta recarga en caso de error
      /*
      setSelectedChat(null);
      setTimeout(() => setSelectedChat(chatId), 0);
      */
    }
  };

  return (
    <div className="h-[100vh] flex flex-col">
      <WhatsAppHeader
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        isGlobalBotEnabled={isGlobalBotEnabled}
        onGlobalBotToggle={handleGlobalBotToggle}
      />
      
      <WhatsAppContainer
        selectedChat={selectedChat}
        selectedChatName={selectedChatName}
        selectedOrderStatus={selectedOrderStatus}
        selectedOrderContext={selectedOrderContext}
        botEnabledChats={botEnabledChats}
        clientPhone={clientPhone}
        chatbotNumber={chatbotNumber}
        isGlobalBotEnabled={isGlobalBotEnabled}
        onChatSelect={handleChatSelect}
        onChatBotToggle={handleChatBotToggle}
        selectedDate={selectedDate}
      />

      <ConfirmDialog
        isOpen={isGlobalConfirmDialogOpen}
        onClose={() => setIsGlobalConfirmDialogOpen(false)}
        onConfirm={handleConfirmGlobalBotDisable}
        title="Desactivar Bot Global"
        message="¿Estás seguro de que quieres desactivar el bot para todos los chats? Esto podría afectar la respuesta automática a los mensajes en todas las conversaciones."
      />
    </div>
  );
};

export default WhatsApp;