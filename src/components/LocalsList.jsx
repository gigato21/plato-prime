import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, Store } from 'lucide-react';
import StatusToggle from './StatusToggle';
import { useSelector } from 'react-redux';
import { getApiUrls } from '@/config/api';
import { toast } from "sonner";
import { useState, useEffect } from "react";

const LocalsList = ({ businesses, onSelect, isSuperAdmin }) => {
  const API_URLS = getApiUrls();
  const accessToken = useSelector(state => state.auth.accessToken);
  const [localStates, setLocalStates] = useState({});

  // Inicializar estados en un useEffect para evitar el error de reduce
  useEffect(() => {
    if (Array.isArray(businesses)) {
      const initialStates = businesses.reduce((acc, business) => ({
        ...acc,
        [business._id]: business.isBusinessActive
      }), {});
      setLocalStates(initialStates);
    }
  }, [businesses]);

  // Ordenar los locales por localId
  const sortedBusinesses = Array.isArray(businesses) 
    ? [...businesses].sort((a, b) => parseInt(a.localId) - parseInt(b.localId))
    : [];

  const handleToggleStatus = async (business) => {
    try {
      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/${business.subDomain}/${business.localId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isActive: !localStates[business._id]
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del local');
      }

      setLocalStates(prev => ({
        ...prev,
        [business._id]: !prev[business._id]
      }));
      
      toast.success('Estado del local actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el estado del local');
    }
  };

  return (
    <ScrollArea className="h-[280px] pr-4">
      <div className="grid gap-4">
        {sortedBusinesses.length > 0 ? (
          sortedBusinesses.map((local) => (
            <div 
              key={local._id}
              className="group flex flex-col bg-gradient-to-br from-cartaai-white/5 to-cartaai-white/10 rounded-xl overflow-hidden border border-cartaai-white/5 hover:border-cartaai-red/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cartaai-red/10 text-cartaai-red">
                    <Store className="w-5 h-5" />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-base text-cartaai-white group-hover:text-cartaai-red transition-colors">
                      {local.name}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400/50"></span>
                        Local #{local.localId}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400/50"></span>
                        {local.subDomain}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <StatusToggle
                    isActive={localStates[local._id]}
                    onToggle={() => handleToggleStatus(local)}
                  />
                  <Button
                    onClick={() => onSelect({
                      name: local.name,
                      localId: local.localId,
                      subDomain: local.subDomain
                    })}
                    variant="ghost"
                    className="p-2 hover:bg-cartaai-white/10 rounded-lg group-hover:text-cartaai-red transition-all"
                  >
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-cartaai-white/60 py-4">
            No hay locales disponibles
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default LocalsList;
