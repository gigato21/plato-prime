import { useState, useEffect } from 'react';
import DatePickerModal from '../../../components/DatePickerModal';
import BotSwitch from '../../../components/BotSwitch';
import QRConnectionModal from './QRConnectionModal';
import { Button } from "@/components/ui/button";
import { QrCode, Phone } from 'lucide-react';
import { getApiUrls } from '@/config/api';

const WhatsAppHeader = ({ selectedDate, onDateChange, isGlobalBotEnabled, onGlobalBotToggle }) => {
  const API_URLS = getApiUrls();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState(null);

  const checkWhatsAppConnection = async () => {
    try {
      const response = await fetch(`${API_URLS.BOT_PROVIDER_URL}/api/whatsapp/status`);
      const data = await response.json();
      
      if (data.isConnected && data.number) {
        setWhatsappStatus(data);
      } else {
        setWhatsappStatus(null);
      }
    } catch (error) {
      console.error('Error al verificar el estado de WhatsApp:', error);
      setWhatsappStatus(null);
    }
  };

  useEffect(() => {
    checkWhatsAppConnection();
  }, []);

  return (
    <div className="p-4 glass-container flex justify-between items-center mb-4 animate-fade-in">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold text-gray-700">Chats</h1>
        <span className="px-2 py-1 bg-cartaai-red/10 text-cartaai-red text-sm rounded-full">
          WhatsApp Business
        </span>
      </div>
      <div className="flex items-center space-x-4">
        {whatsappStatus && whatsappStatus.isConnected && whatsappStatus.number ? (
          <div className="flex items-center space-x-2 text-cartaai-white">
            <Phone className="w-4 h-4" />
            <span>{whatsappStatus.number}</span>
          </div>
        ) : (
          <Button
            onClick={() => setIsQRModalOpen(true)}
            variant="outline"
            className="flex items-center space-x-2 text-cartaai-white"
          >
            <QrCode className="w-4 h-4" />
            <span>Conectar WhatsApp</span>
          </Button>
        )}
        <DatePickerModal selectedDate={selectedDate} onDateChange={onDateChange} />
        <div className="relative group">
          <BotSwitch
            isEnabled={isGlobalBotEnabled}
            onToggle={onGlobalBotToggle}
            className="transition-transform hover:scale-105"
          />
          <div className="absolute -bottom-8 right-0 w-48 p-2 bg-black/80 text-white text-xs rounded 
                        opacity-0 group-hover:opacity-100 transition-opacity">
            {isGlobalBotEnabled ? 'Bot global activo' : 'Bot global inactivo'}
          </div>
        </div>
      </div>

      <QRConnectionModal 
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        onConnectionSuccess={() => {
          checkWhatsAppConnection();
        }}
      />
    </div>
  );
};

export default WhatsAppHeader;