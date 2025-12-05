import { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateBotState } from '../../../redux/slices/botStateSlice';
import { useToast } from "@/components/ui/use-toast";
import { syncBotState, emitBotStateChange } from '../../../utils/botStateSync';
import ConfirmDialog from '../../../components/ConfirmDialog';

// Almacén global para rastrear operaciones en curso
const pendingOperations = new Map();

const BotControls = ({ 
  isBlacklisted, 
  setIsBlacklisted, 
  clientPhone, 
  subdomain, 
  localId, 
  socket, 
  chatbotNumber, 
  isGlobalBotEnabled,
  onBotToggle 
}) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const operationIdRef = useRef(`op_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const debounceTimeMs = 3000; // Aumentamos significativamente el tiempo de debounce

  useEffect(() => {
    // Limpieza al desmontar
    return () => {
      pendingOperations.delete(clientPhone);
    };
  }, [clientPhone]);

  // Función para verificar si se permite una operación
  const isOperationAllowed = () => {
    // Si hay una operación pendiente para este número, no permitimos una nueva
    if (pendingOperations.has(clientPhone)) {
      console.log(`[BotControls] Operación bloqueada para ${clientPhone}. Ya hay una operación en curso.`);
      return false;
    }
    return true;
  };

  // Función para marcar el inicio de una operación
  const startOperation = () => {
    const operationId = operationIdRef.current;
    pendingOperations.set(clientPhone, operationId);
    console.log(`[BotControls] Iniciando operación ${operationId} para ${clientPhone}`);
    return operationId;
  };

  // Función para finalizar una operación
  const endOperation = (operationId) => {
    // Solo eliminamos si el ID coincide (para evitar eliminar operaciones más nuevas)
    if (pendingOperations.get(clientPhone) === operationId) {
      pendingOperations.delete(clientPhone);
      console.log(`[BotControls] Finalizada operación ${operationId} para ${clientPhone}`);
    }
  };

  const handleBotToggle = async () => {
    // No permitimos acción si el bot global está desactivado o ya estamos cargando
    if (!isGlobalBotEnabled || isLoading) return;
    
    // No permitimos acción si ya hay una operación en curso para este número
    if (!isOperationAllowed()) return;
    
    console.log(`[BotControls] handleBotToggle - isBlacklisted: ${isBlacklisted}`);
    
    if (!isBlacklisted) {
      // Para desactivar, mostramos diálogo de confirmación
      setIsConfirmDialogOpen(true);
    } else {
      // Para activar, procedemos directamente
      try {
        // Registramos el inicio de la operación
        const operationId = startOperation();
        
        // Actualizamos UI
        setIsLoading(true);
        
        console.log(`[BotControls] Iniciando activación del bot para ${clientPhone}`);
        
        // Hacemos la petición a la API
        const success = await syncBotState(clientPhone, subdomain, localId, true);
        
        if (success) {
          console.log(`[BotControls] Activación exitosa para ${clientPhone}`);
          
          // Actualizamos estado local
          setIsBlacklisted(false);
          
          // Actualizamos Redux
          dispatch(updateBotState({ clientPhone, isEnabled: true }));
          
          // Notificamos por socket
          emitBotStateChange(socket, clientPhone, chatbotNumber, true);
          
          // Mostramos notificación
          toast({
            title: "Bot Activado",
            description: "El bot ha sido activado para este chat",
          });
          
          // IMPORTANTE: Ya NO llamamos a onBotToggle automáticamente
          // El componente padre debe actualizar su estado basado en Redux o mediante otra verificación
        } else {
          console.log(`[BotControls] Error al activar bot para ${clientPhone}`);
          toast({
            title: "Error",
            description: "No se pudo activar el bot",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(`[BotControls] Error al activar bot para ${clientPhone}:`, error);
        toast({
          title: "Error",
          description: "Ocurrió un error al activar el bot",
          variant: "destructive",
        });
      } finally {
        // Reseteamos UI
        setIsLoading(false);
        
        // Liberamos la operación después de un tiempo para asegurar que no hay efectos secundarios
        setTimeout(() => {
          endOperation(operationIdRef.current);
        }, debounceTimeMs);
      }
    }
  };

  const handleConfirmBotDisable = async () => {
    // No permitimos acción si ya hay una operación en curso
    if (!isOperationAllowed()) {
      setIsConfirmDialogOpen(false);
      return;
    }
    
    try {
      // Registramos el inicio de la operación
      const operationId = startOperation();
      
      // Actualizamos UI
      setIsLoading(true);
      setIsConfirmDialogOpen(false);
      
      console.log(`[BotControls] Iniciando desactivación del bot para ${clientPhone}`);
      
      // Hacemos la petición a la API
      const success = await syncBotState(clientPhone, subdomain, localId, false);
      
      if (success) {
        console.log(`[BotControls] Desactivación exitosa para ${clientPhone}`);
        
        // Actualizamos estado local
        setIsBlacklisted(true);
        
        // Actualizamos Redux
        dispatch(updateBotState({ clientPhone, isEnabled: false }));
        
        // Notificamos por socket
        emitBotStateChange(socket, clientPhone, chatbotNumber, false);
        
        // Mostramos notificación
        toast({
          title: "Bot Desactivado",
          description: "El bot ha sido desactivado para este chat",
          variant: "destructive",
        });
        
        // IMPORTANTE: Ya NO llamamos a onBotToggle automáticamente
        // El componente padre debe actualizar su estado basado en Redux o mediante otra verificación
      } else {
        console.log(`[BotControls] Error al desactivar bot para ${clientPhone}`);
        toast({
          title: "Error",
          description: "No se pudo desactivar el bot",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(`[BotControls] Error al desactivar bot para ${clientPhone}:`, error);
      toast({
        title: "Error",
        description: "Ocurrió un error al desactivar el bot",
        variant: "destructive",
      });
    } finally {
      // Reseteamos UI
      setIsLoading(false);
      
      // Liberamos la operación después de un tiempo para asegurar que no hay efectos secundarios
      setTimeout(() => {
        endOperation(operationIdRef.current);
      }, debounceTimeMs);
    }
  };

  return (
    <>
      <button
        onClick={handleBotToggle}
        disabled={!isGlobalBotEnabled || isLoading || pendingOperations.has(clientPhone)}
        className={`text-xs px-2 py-1 rounded-full ${
          !isGlobalBotEnabled 
            ? 'bg-gray-500 text-white cursor-not-allowed opacity-50' 
            : isLoading
              ? 'bg-yellow-500 text-white cursor-wait'
              : !isBlacklisted 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-500 text-white'
        }`}
      >
        {!isGlobalBotEnabled 
          ? 'Bot Global Inactivo'
          : isLoading
            ? 'Procesando...'
            : !isBlacklisted 
              ? 'Bot Activo' 
              : 'Bot Inactivo'
        }
      </button>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => !isLoading && !pendingOperations.has(clientPhone) && setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmBotDisable}
        title="Desactivar Bot"
        message={`¿Estás seguro de que quieres desactivar el bot para este chat? Esto podría afectar la respuesta automática a los mensajes.`}
      />
    </>
  );
};

export default BotControls;