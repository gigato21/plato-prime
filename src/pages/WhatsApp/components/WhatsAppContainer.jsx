import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ChatList from '@/pages/WhatsApp/components/ChatList';
import ChatWindow from '@/pages/WhatsApp/components/ChatWindow';
import { useSelector } from 'react-redux';

const WhatsAppContainer = ({
  selectedChat,
  selectedChatName,
  selectedOrderStatus,
  selectedOrderContext,
  botEnabledChats,
  clientPhone,
  chatbotNumber,
  isGlobalBotEnabled,
  onChatSelect,
  onChatBotToggle,
  selectedDate
}) => {
  // Estado centralizado para el control del bot
  const [botStates, setBotStates] = useState(botEnabledChats || {});

  // Obtener el estado desde Redux
  const reduxBotStates = useSelector((state) => state.botState.botStates);

  // Actualizar estados cuando cambian los props
  useEffect(() => {
    if (botEnabledChats) {
      setBotStates(botEnabledChats);
    }
  }, [botEnabledChats]);

  // Añadir un useEffect para actualizar botStates desde Redux
  useEffect(() => {
    // Combinamos el estado de Redux con nuestros botStates locales
    console.log("[WhatsAppContainer] Actualizando botStates desde Redux");
    setBotStates(prevState => ({
      ...prevState,
      ...reduxBotStates
    }));
  }, [reduxBotStates]);

  // Manejador centralizado para cambios en el estado del bot
  const handleBotStateChange = (chatId, newState) => {
    console.log("WhatsAppContainer - handleBotStateChange:", chatId, newState);
    
    // Ya no modificamos el estado local aquí, dejamos que el componente padre
    // lo haga después de la confirmación de la API
    // setBotStates(prev => ({
    //   ...prev,
    //   [chatId]: newState
    // }));
    
    // Solo propagamos el evento al componente padre
    onChatBotToggle(chatId);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex overflow-hidden glass-container rounded-lg shadow-lg"
    >
      <div className={`w-full md:w-1/3 ${selectedChat ? 'hidden md:flex' : 'flex'} flex-col min-h-0 border-r border-white/10`}>
        <div className="flex-1 overflow-y-auto">
          <ChatList 
            onChatSelect={onChatSelect} 
            activeChatId={selectedChat} 
            selectedDate={selectedDate}
            botEnabledChats={botStates}
          />
        </div>
      </div>
      <div className={`w-full md:w-2/3 ${selectedChat ? 'flex' : 'hidden md:flex'} flex-col min-h-0`}>
        {selectedChat ? (
          <ChatWindow 
            chatId={selectedChat} 
            chatName={selectedChatName}
            onBack={() => onChatSelect(null)}
            isBotEnabled={isGlobalBotEnabled && botStates[selectedChat]}
            orderStatus={selectedOrderStatus}
            orderContext={selectedOrderContext}
            clientPhone={clientPhone} 
            chatbotNumber={chatbotNumber}
            isGlobalBotEnabled={isGlobalBotEnabled}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4"
          >
            <img 
              src="/cartaai.svg" 
              alt="CartaAI Logo" 
              className="w-24 h-24 opacity-50"
            />
            <p className="text-lg">Selecciona un chat para ver los mensajes</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WhatsAppContainer;