import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import CustomNumberInput from "@/components/ui/CustomNumberInput";
import { Label } from "@/components/ui/label";
import { Clock, Building2 } from 'lucide-react';
import { toast } from "sonner";
import { sendAutoChangeConfig } from '@/pages/Orders/services/apiCallsForOrders';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiUrls } from '@/config/api';

const API_URLS = getApiUrls();

const LocalsModal = ({ subDomain, onUpdateLocal }) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['autoChangeStatus', subDomain],
    queryFn: async () => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/order/auto-change-status/${subDomain}`);
      if (!response.ok) throw new Error('Error al cargar los locales');
      return response.json();
    }
  });

  const handleLocalUpdate = async (localId, isActive, minutes) => {
    try {
      await onUpdateLocal(localId, isActive, minutes);
      
      // Actualizamos optimistamente los datos en el cache
      queryClient.setQueryData(['autoChangeStatus', subDomain], (oldData) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            locals: oldData.data.locals.map(local => 
              local.localId === localId 
                ? {
                    ...local,
                    timerOrderUpdateIsActive: isActive,
                    timeOrderUpdate: minutes * 60000
                  }
                : local
            )
          }
        };
      });
    } catch (error) {
      // Si hay un error, invalidamos la query para forzar una recarga
      queryClient.invalidateQueries(['autoChangeStatus', subDomain]);
    }
  };

  if (isLoading) return <div className="p-4 text-center">Cargando...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error al cargar los locales</div>;

  return (
    <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
      <div className="grid gap-4">
        {data?.data?.locals.map((local) => (
          <div key={local.localId} className="flex items-center justify-between p-4 glass-container rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Local {local.localId}</h4>
                <span className="text-sm text-cartaai-white/60">•</span>
                <span className="text-sm text-cartaai-white/80">{local.name}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <CustomNumberInput
                  value={local.timeOrderUpdate / 60000}
                  onChange={(value) => handleLocalUpdate(local.localId, local.timerOrderUpdateIsActive, value)}
                  className="w-16 h-7 text-xs glass-input px-3"
                  min="1"
                />
                <span className="text-xs text-cartaai-white/60">min</span>
              </div>
            </div>
            <Switch
              checked={local.timerOrderUpdateIsActive}
              onCheckedChange={(checked) => handleLocalUpdate(local.localId, checked, local.timeOrderUpdate / 60000)}
              className="data-[state=checked]:bg-cartaai-red ml-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const AutoStatusChange = ({ subDomain, localId, timerConfig }) => {
  const parsedTimeOrderUpdate = timerConfig.timerOrderUpdate / 60000;
  const [isActiveState, setIsActiveState] = useState(timerConfig.isAutoChangeStatusActive);
  const [intervalMinutes, setIntervalMinutes] = useState(parsedTimeOrderUpdate);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const isMatriz = localId === "-1";

  const handleToggle = async (checked) => {
    try {
      await sendAutoChangeConfig(subDomain, localId, checked, intervalMinutes);
      setIsActiveState(checked);
      setHasShownMessage(false);
      toast.success(checked ? 'Cambio automático activado' : 'Cambio automático desactivado');
    } catch (error) {
      toast.error('Error al configurar el cambio automático');
      setIsActiveState(!checked);
    }
  };

  const handleIntervalChange = (value) => {
    setIntervalMinutes(value);
    if (isActiveState && value !== '' && !hasShownMessage) {
      toast.info('Para aplicar los cambios, apague o reinicie el cambiador automático.');
      setHasShownMessage(true);
      setTimeout(() => setHasShownMessage(false), 4000);
    }
  };

  const handleLocalUpdate = async (localId, isActive, minutes) => {
    try {
      await sendAutoChangeConfig(subDomain, localId, isActive, minutes);
      toast.success(`Local ${localId} actualizado correctamente`);
    } catch (error) {
      toast.error(`Error al actualizar el local ${localId}`);
    }
  };

  return (
    <div className="flex items-center gap-4 glass-container p-2 rounded-lg">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-cartaai-red" />
        <Label className="text-xs font-medium">Auto cambio</Label>
      </div>
      
      {isMatriz ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              <span>Ver locales</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Configuración de locales</DialogTitle>
            </DialogHeader>
            <LocalsModal 
              subDomain={subDomain} 
              onUpdateLocal={handleLocalUpdate}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <CustomNumberInput
              value={intervalMinutes}
              onChange={handleIntervalChange}
              className="w-16 h-7 text-xs glass-input px-3"
              min="1"
            />
            <span className="text-xs text-cartaai-white/60">min</span>
          </div>

          <Switch
            checked={isActiveState}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </>
      )}
    </div>
  );
};

export default AutoStatusChange;