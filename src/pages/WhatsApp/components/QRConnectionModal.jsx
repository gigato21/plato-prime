import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getApiUrls } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import io from "socket.io-client";

const QRConnectionModal = ({ isOpen, onClose, onConnectionSuccess }) => {
  const API_URLS = getApiUrls();
  const { toast } = useToast();
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("waiting"); // waiting, scanning, connected
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutos en segundos
  
  useEffect(() => {
    // Sólo conectar el socket cuando el modal está abierto
    if (isOpen) {
      const newSocket = io(`${API_URLS.BOT_PROVIDER_URL}`);
      setSocket(newSocket);
      setTimeRemaining(120); // Reiniciar el temporizador cuando se abre el modal
      
      // Configurar los eventos del socket según el backend
      newSocket.on("whatsapp_qr_scanned", (data) => {
        setConnectionStatus("scanning");
        toast({
          title: "QR Escaneado",
          description: data.message || "Código QR escaneado, conectando...",
        });
      });
      
      newSocket.on("whatsapp_connected", (data) => {
        setConnectionStatus("connected");
        setPhoneNumber(data.phoneNumber);
        
        toast({
          title: "Conexión exitosa",
          description: data.message || "WhatsApp conectado exitosamente",
        });
        
        // Notificar al componente padre sobre la conexión exitosa
        if (onConnectionSuccess) {
          onConnectionSuccess(data);
        }
        
        // Cerrar el modal automáticamente después de 2 segundos
        setTimeout(() => {
          onClose();
        }, 2000);
      });
      
      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [isOpen, API_URLS.BOT_PROVIDER_URL, toast, onClose, onConnectionSuccess]);
  
  // Temporizador para la cuenta regresiva del tiempo de vida del QR
  useEffect(() => {
    let timer;
    if (isOpen && connectionStatus !== "connected" && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen, connectionStatus, timeRemaining]);
  
  // Calcular el porcentaje de tiempo restante para la barra de progreso
  const progressPercentage = (timeRemaining / 120) * 100;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp</DialogTitle>
        </DialogHeader>
        
        {connectionStatus !== "connected" && (
          <div className="w-full mb-4">
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-right mt-1 text-gray-500">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </p>
          </div>
        )}
        
        <div className="flex flex-col items-center space-y-4">
          {connectionStatus === "connected" ? (
            <div className="flex flex-col items-center p-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium text-center">¡Conectado exitosamente!</p>
              {phoneNumber && phoneNumber !== "Número no disponible" && (
                <p className="text-center font-medium">{phoneNumber}</p>
              )}
              <p className="text-sm text-center text-gray-500">
                WhatsApp conectado exitosamente
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center w-full">
                <iframe 
                  src={`${API_URLS.BOT_PROVIDER_URL}/api/whatsapp/qr`}
                  className="w-[300px] h-[300px] mx-auto"
                  title="WhatsApp QR"
                />
              </div>
              <p className="text-sm text-center text-gray-500">
                {connectionStatus === "scanning" 
                  ? "Código QR escaneado, conectando..."
                  : "Escanea este código QR con WhatsApp para conectar el bot"}
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRConnectionModal; 