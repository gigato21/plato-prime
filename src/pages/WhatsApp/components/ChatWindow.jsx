import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, PlusCircle } from 'lucide-react';
import OrderStatus from './OrderStatus';

import AddOrderModal from '../../../components/AddOrderModal';
import { io } from 'socket.io-client';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { verifyBotState } from '../../../utils/botStateUtils';
import BotControls from './BotControls';
import { useToast } from "@/components/ui/use-toast";

const ChatWindow = ({ chatId, chatName, onBack, onBotToggle, orderStatus, clientPhone, chatbotNumber, isGlobalBotEnabled }) => {
  const API_URLS = getApiUrls();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [socket, setSocket] = useState(null);
  const { toast } = useToast();

  const subdomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const botStates = useSelector((state) => state.botState.botStates);

  useEffect(() => {
    const newSocket = io(`${API_URLS.SERVICIOS_GENERALES_URL}`);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-room', {
        clientPhone: clientPhone,
        chatbotNumber: chatbotNumber
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });

    newSocket.on('newMessage', (message) => {
      if (message && message.content) {
        if (message.clientPhone === clientPhone && message.chatbotNumber === chatbotNumber) {
          const newMessage = {
            id: message._id || Date.now().toString(),
            text: message.content,
            sender: message.role || 'user',
            createdAt: message.createdAt || new Date()
          };
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      } else {
        console.error('Mensaje recibido sin contenido:', message);
      }
    });

    return () => {
      newSocket.off('newMessage');
      newSocket.disconnect();
    };
  }, [clientPhone, chatbotNumber]);

  useEffect(() => {
    if (clientPhone) {
      checkBotState();
    }
  }, [clientPhone]);

  useEffect(() => {
    if (clientPhone && botStates.hasOwnProperty(clientPhone)) {
      const isBotEnabled = botStates[clientPhone];
      console.log(`[ChatWindow] Actualizando isBlacklisted por cambio en Redux: ${!isBotEnabled}`);
      setIsBlacklisted(!isBotEnabled);
    }
  }, [botStates, clientPhone]);

  const fetchMessages = async () => {
    if (!clientPhone || !chatbotNumber) return;

    try {
      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/history/get-history?clientPhone=${clientPhone}&chatbotNumber=${chatbotNumber}`
      );
      const data = await response.json();

      const mappedMessages = data.data.map((msg) => ({
        id: msg._id,
        text: msg.content,
        sender: msg.role,
        createdAt: new Date(msg.createdAt)
      }));

      const sortedMessages = mappedMessages.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive",
      });
    }
  };

  const checkBotState = async () => {
    if (!clientPhone) return;
    try {
      const isEnabled = await verifyBotState(clientPhone, subdomain, localId);
      if (isEnabled !== null) {
        setIsBlacklisted(!isEnabled);
      }
    } catch (error) {
      console.error('Error al verificar el estado del bot:', error);
    }
  };

  useEffect(() => {
    checkBotState();
    fetchMessages();
  }, [clientPhone, chatbotNumber, subdomain, localId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const messageBody = {
        clientPhone: clientPhone,
        message: message,
        chatbotNumber: chatbotNumber,
        botUrl: API_URLS.BOT_PROVIDER_URL,
        provider: 1,
        subDomain: subdomain,
        localId: localId
      };

      const sendResponse = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/whatsapp-providers/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageBody),
      });

      if (!sendResponse.ok) {
        throw new Error('Error al enviar el mensaje');
      }

      setMessage('');
      
      toast({
        title: "Mensaje enviado",
        description: "El mensaje se envió correctamente",
      });
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 glass-container border-b border-white/10">
        <button onClick={onBack} className="md:hidden mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cartaai-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="ml-3 flex-grow">
          <h2 className="text-lg font-semibold text-gray-700">{chatName}</h2>
          <div className="flex items-center">
            <p className="text-sm text-gray-700 mr-2">En línea</p>
            {orderStatus && <OrderStatus status={orderStatus} />}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <BotControls
            isBlacklisted={isBlacklisted}
            setIsBlacklisted={setIsBlacklisted}
            clientPhone={clientPhone}
            subdomain={subdomain}
            localId={localId}
            socket={socket}
            chatbotNumber={chatbotNumber}
            isGlobalBotEnabled={isGlobalBotEnabled}
          />
          {isBlacklisted && (
            <button
              onClick={() => setIsAddOrderModalOpen(true)}
              className="text-xs px-2 py-1 rounded-full bg-cartaai-red text-white flex items-center"
            >
              <PlusCircle className="w-4 h-4 mr-1" /> Agregar Pedido
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[70%] p-2 rounded-lg ${
              message.sender === 'assistant' 
                ? 'bg-red-500/80 self-start'
                : 'bg-gray-500/80 self-end ml-auto text-gray-700'
            }`}
          >
            <p className={`text-sm ${message.sender === 'assistant' ? 'text-white' : 'text-gray-100'}`}>{message.text}</p>
            <span className='text-[11px] text-white/50'>
              {new Date(message.createdAt).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 glass-container border-t border-white/10">
        <div className="flex items-center glass-input rounded-full">
          <button className="p-2 text-cartaai-white">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-transparent p-2 text-sm text-cartaai-white outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          {message.trim() ? (
            <button className="p-2" onClick={handleSend}>
              <Send className="w-5 h-5 text-cartaai-red" />
            </button>
          ) : (
            <button className="p-2 text-cartaai-white">
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <AddOrderModal
        isOpen={isAddOrderModalOpen}
        onClose={() => setIsAddOrderModalOpen(false)}
      />
    </div>
  );
};

export default ChatWindow;