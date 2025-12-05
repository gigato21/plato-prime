import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getApiUrls } from '@/config/api';

const SelectLocalsModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Seleccionar Locales",
  subDomain,
  accessToken,
  selectedLocalIds = []
}) => {
  const API_URLS = getApiUrls();
  const [selectedLocals, setSelectedLocals] = useState(selectedLocalIds);
  const [locals, setLocals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedLocals(selectedLocalIds);
  }, [selectedLocalIds, isOpen]);

  useEffect(() => {
    const fetchLocals = async () => {
      if (isOpen && subDomain) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/locals/${subDomain}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          });
          
          if (!response.ok) throw new Error('Error al cargar locales');
          
          const data = await response.json();
          if (data.type === "1") {
            // Filtramos el local -1 ya que no necesitamos mostrarlo en la selección
            const filteredLocals = data.data.filter(local => local.localId !== "-1");
            setLocals(filteredLocals);
          } else {
            throw new Error(data.message || 'Error al cargar locales');
          }
        } catch (error) {
          setError(error.message);
          toast({
            title: "Error",
            description: "No se pudieron cargar los locales",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLocals();
  }, [isOpen, subDomain, accessToken]);

  const handleToggleLocal = (localId) => {
    setSelectedLocals(prev => {
      if (prev.includes(localId)) {
        return prev.filter(id => id !== localId);
      } else {
        return [...prev, localId];
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLocals(locals.map(local => local.localId));
    } else {
      setSelectedLocals([]);
    }
  };

  const handleConfirm = (e) => {
    // Detenemos la propagación del evento para que no llegue al modal padre
    e.stopPropagation();
    
    if (selectedLocals.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos un local",
        variant: "destructive",
      });
      return;
    }
    onConfirm(selectedLocals);
    onClose();
  };

  const handleClose = (e) => {
    // Detenemos la propagación del evento para que no llegue al modal padre
    e.stopPropagation();
    onClose();
  };

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  // Estilos para el modal con z-index extremadamente alto
  const modalContent = (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999999
      }} 
      onClick={handleClose}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      <div 
        style={{
          position: 'relative',
          backgroundColor: '#151515',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          maxWidth: '32rem',
          width: '100%',
          margin: '1rem',
          zIndex: 100000000,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }} 
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div 
          className="space-y-4 my-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              {error}
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <Checkbox
                  id="select-all"
                  checked={selectedLocals.length === locals.length && locals.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="border-2 border-white/50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                >
                  Seleccionar todos
                </label>
              </div>
              <div className="max-h-[40vh] overflow-y-auto pr-2">
                {locals.map((local) => (
                  <div key={local.localId} className="flex items-center space-x-2 py-1.5">
                    <Checkbox
                      id={`local-${local.localId}`}
                      checked={selectedLocals.includes(local.localId)}
                      onCheckedChange={() => handleToggleLocal(local.localId)}
                      className="border-2 border-white/50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    />
                    <label
                      htmlFor={`local-${local.localId}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
                    >
                      {local.localNombreComercial} - {local.localDireccion}
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div 
          className="flex space-x-2 justify-end mt-4"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <Button 
            onClick={handleClose}
            className="glass-button"
            onMouseDown={(e) => e.stopPropagation()}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            className="glass-button-blue"
            disabled={isLoading || selectedLocals.length === 0}
            onMouseDown={(e) => e.stopPropagation()}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );

  // Creamos un portal para renderizar el modal fuera de la jerarquía normal del DOM
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default SelectLocalsModal; 