import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import ModifierCard from './ModifierCard';
import ModifierDialog from './ModifierDialog';
import SelectLocalsModal from './SelectLocalsModal';
import { EModAction } from '@/types/Action-mod-type';

const ModifiersContent = () => {
  const API_URLS = getApiUrls();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedModifier, setSelectedModifier] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const [isSelectLocalsModalOpen, setIsSelectLocalsModalOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [loadingModifierId, setLoadingModifierId] = useState(null);

  const { data: modifiers = [], isLoading: isLoadingModifiers } = useQuery({
    queryKey: ['modifiers'],
    queryFn: async () => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (!response.ok) throw new Error('Error al cargar modificadores');
      return response.json();
    }
  });

  const { data: options = [], isLoading: isLoadingOptions } = useQuery({
    queryKey: ['options'],
    queryFn: async () => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/opciones/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (!response.ok) throw new Error('Error al cargar opciones');
      return response.json();
    }
  });

  const addModifierMutation = useMutation({
    mutationFn: async (newModifier) => {
      const selectedOptions = newModifier.options.map(optionId => {

        const option = options.find(opt => opt.rId === optionId.optionId);

        if (!option) {
          throw new Error(`Opción no encontrada: ${optionId}`);
        }
        return {
          optionId: option.rId,
          name: option.name,
          price: option.price,
          stock: option.stock
        };
      });
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/create/${subDomain}/${localId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...newModifier,
          rId: `MOD${Date.now()}`,
          source: "0",
          options: selectedOptions
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el modificador');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['modifiers']);
      setIsAddModalOpen(false);
      toast({
        title: "Éxito",
        description: "Modificador creado correctamente",
      });
    },
    onError: (error) => {
      console.error('Error al crear modificador:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  const updateModifierMutation = useMutation({
    mutationFn: async (updatedModifier) => {
      if (localId === "-1") {
        setIsSelectLocalsModalOpen(true);
        setPendingUpdate(updatedModifier);
        setSelectedModifier(prevModifier => ({
          ...prevModifier,
          ...updatedModifier
        }));
        throw new Error('pending-local-selection');
      }

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/${selectedModifier._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...updatedModifier,
          options: updatedModifier.options.map(optionId => {
            const option = options.find(opt => opt.rId === optionId.optionId);
            return {
              optionId: option.rId,
              name: option.name,
              price: Number(option.price),
              stock: Number(option.stock)
            };
          })
        }),
      });
      if (!response.ok) throw new Error('Error al actualizar el modificador');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['modifiers']);
      setIsEditModalOpen(false);
      setSelectedModifier(null);
      toast({
        title: "Éxito",
        description: "Modificador actualizado correctamente",
      });
    },
    onError: (error) => {
      if (error.message !== 'pending-local-selection') {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  const deleteModifierMutation = useMutation({
    mutationFn: async (modifierId) => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/${modifierId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error('Error al eliminar el modificador');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['modifiers']);
      toast({
        title: "Éxito",
        description: "Modificador eliminado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const toggleModifierStatus = useMutation({
    mutationFn: async (modifier) => {
      setLoadingModifierId(modifier._id);
      
      if (localId === "-1") {
        setPendingStatusUpdate({
          productId: modifier.rId,
          newStatus: modifier.status === 1 ? 0 : 1,
          changes: { status: modifier.status === 1 ? 0 : 1 }
        });
        setIsSelectLocalsModalOpen(true);
        const error = new Error('pending-local-selection');
        error.isPendingSelection = true;
        throw error;
      }

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/${modifier._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: modifier.status === 1 ? 0 : 1
        }),
      });
      
      if (!response.ok) throw new Error('Error al actualizar el estado del modificador');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['modifiers']);
      toast({
        title: "Éxito",
        description: "Estado del modificador actualizado correctamente",
      });
    },
    onError: (error) => {
      if (!error.isPendingSelection) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    },
    onSettled: () => {
      if (!isSelectLocalsModalOpen) {
        setLoadingModifierId(null);
      }
    }
  });

  const handleEdit = (modifier) => {
    setSelectedModifier({
      ...modifier,
      options: modifier.options.map(opt => ({
        optionId: opt.optionId,
        name: opt.name,
        price: opt.price,
        stock: opt.stock
      }))
    });
    setIsEditModalOpen(true);
  };

  const handleLocalsSelected = async (selectedLocals) => {
    if (!pendingStatusUpdate) return;
    
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/update-multiple-local/modificadores/${pendingStatusUpdate.productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          localIds: selectedLocals,
          changes: pendingStatusUpdate.changes,
          subDomain: subDomain
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el modificador en múltiples locales');
      }

      await queryClient.invalidateQueries(['modifiers']);
      toast({
        title: "Éxito",
        description: "Modificador actualizado correctamente en los locales seleccionados",
      });
    } catch (error) {
      console.error('Error updating modifier in multiple locals:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el modificador en los locales seleccionados",
        variant: "destructive",
      });
    } finally {
      setIsSelectLocalsModalOpen(false);
      setPendingStatusUpdate(null);
      setLoadingModifierId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Modificadores</h2>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-cartaai-red hover:bg-cartaai-red/80 text-gray-700 dark:text-gray-300">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Modificador
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modifiers.map((modifier) => (
            <div key={modifier._id}>
              <ModifierCard
                modifier={modifier}
                onEdit={handleEdit}
                onDelete={(id) => deleteModifierMutation.mutate(id)}
                onToggle={() => toggleModifierStatus.mutate(modifier)}
                isLoading={loadingModifierId === modifier._id}
              />
            </div>
          ))}
        </div>
      </div>

      <ModifierDialog
        isOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Nuevo Modificador"
        onSubmit={addModifierMutation.mutate}
        options={options}
        isLoading={addModifierMutation.isLoading}
        actionType= {EModAction.Create}
      />

      <ModifierDialog 
        isOpen={isEditModalOpen}
        setIsAddModalOpen={setIsEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        rId={selectedModifier?.rId || ''}
        title="Editar Modificador"
        onSubmit={updateModifierMutation.mutate}
        initialData={selectedModifier}
        options={options}
        isLoading={updateModifierMutation.isLoading}
        actionType= {EModAction.Update}
      />

      <SelectLocalsModal
        isOpen={isSelectLocalsModalOpen}
        onClose={() => {
          setIsSelectLocalsModalOpen(false);
          setPendingStatusUpdate(null);
          setLoadingModifierId(null);
        }}
        onConfirm={handleLocalsSelected}
        title="Seleccionar locales para actualizar el modificador"
      />
    </>
  );
};

export default ModifiersContent;
