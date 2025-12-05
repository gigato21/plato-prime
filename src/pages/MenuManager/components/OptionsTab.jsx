import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from 'lucide-react';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AddOptionModal from './AddOptionModal';
import EditOptionModal from './EditOptionModal';
import SelectLocalsModal from './SelectLocalsModal';
import { useMultipleLocalsUpdate } from '@/hooks/useMultipleLocalsUpdate';
import StatusToggle from '../../../components/StatusToggle';

const OptionsTab = () => {
  const API_URLS = getApiUrls();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const accessToken = useSelector(state => state.auth.accessToken);
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [loadingOptionId, setLoadingOptionId] = useState(null);

  const { data: options = [], isLoading } = useQuery({
    queryKey: ['options', subDomain, localId],
    queryFn: async () => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/opciones/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error('Error al obtener las opciones');
      return response.json();
    }
  });

  const {
    isSelectLocalsModalOpen,
    setIsSelectLocalsModalOpen,
    handleUpdate,
    handleLocalsSelected,
  } = useMultipleLocalsUpdate({
    itemType: 'opciones',
    rId: selectedOption?.rId,
    invalidateQueries: [['options', subDomain, localId]]
  });

  const handleAddOption = async (optionData) => {
    if(localId === "-1") {
      return
    }
    try {
      const url =`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/opciones/create/${subDomain}/${localId}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          ...optionData,
          rId: `OPC${Date.now()}`,
          source: "0"
        })
      });

      if (!response.ok) throw new Error('Error al crear la opción');
      queryClient.invalidateQueries(['options', subDomain, localId]);
      toast({
        title: "Éxito",
        description: "Opción creada correctamente",
      });
      setIsAddModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la opción",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOption = async (id) => {
    setLoadingOptionId(id);
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/opciones/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Error al eliminar la opción');
      queryClient.invalidateQueries(['options', subDomain, localId]);
      toast({
        title: "Éxito",
        description: "Opción eliminada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la opción",
        variant: "destructive",
      });
    } finally {
      setLoadingOptionId(null);
    }
  };

  const handleEditOption = async (id, data) => {
    setLoadingOptionId(id);
    try {
      if (localId === "-1") {
        setPendingStatusUpdate({
          productId: data.rId,
          changes: data
        });
        setIsSelectLocalsModalOpen(true);
        return;
      }

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/opciones/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Error al actualizar la opción');
      queryClient.invalidateQueries(['options', subDomain, localId]);
      setIsEditModalOpen(false);
      toast({
        title: "Éxito",
        description: "Opción actualizada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la opción",
        variant: "destructive",
      });
    } finally {
      setLoadingOptionId(null);
    }
  };

  const OptionToggle = ({ option }) => {
    const handleToggleStatus = async () => {
      setLoadingOptionId(option._id);
      
      try {
        const newStatus = option.status === 1 ? 0 : 1;

        if (localId === "-1") {
          setPendingStatusUpdate({
            productId: option.rId,
            newStatus: newStatus
          });
          setIsSelectLocalsModalOpen(true);
          return;
        }

        const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/opciones/${option._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Error al actualizar el estado');
        queryClient.invalidateQueries(['options', subDomain, localId]);
        toast({
          title: "Éxito",
          description: "Estado actualizado correctamente",
        });
      } catch (error) {
        console.error('Error updating option status:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado de la opción",
          variant: "destructive",
        });
      } finally {
        setLoadingOptionId(null);
      }
    };

    return (
      <div className="flex items-center justify-center w-full">
        {loadingOptionId === option._id ? (
          <div className="animate-spin h-5 w-5 border-2 border-cartaai-red border-t-transparent rounded-full" />
        ) : (
          <StatusToggle
            isActive={option.status === 1}
            onToggle={() => handleToggleStatus()}
          />
        )}
      </div>
    );
  };

  const handleLocalsSelectedWrapper = async (selectedLocals) => {
    if (!pendingStatusUpdate) return;
    
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/update-multiple-local/opciones/${pendingStatusUpdate.productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          localIds: selectedLocals,
          changes: pendingStatusUpdate.changes || { status: pendingStatusUpdate.newStatus },
          subDomain: subDomain
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la opción en múltiples locales');
      }

      await queryClient.invalidateQueries(['options', subDomain, localId]);
      toast({
        title: "Éxito",
        description: "Opción actualizada correctamente en los locales seleccionados",
      });
    } catch (error) {
      console.error('Error updating option in multiple locals:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la opción en los locales seleccionados",
        variant: "destructive",
      });
    } finally {
      setIsSelectLocalsModalOpen(false);
      setPendingStatusUpdate(null);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Opciones</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-cartaai-red hover:bg-cartaai-red/80 text-gray-700 dark:text-gray-300">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Opción
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-cartaai-white">Nombre</TableHead>
            <TableHead className="text-cartaai-white">Precio</TableHead>
            <TableHead className="text-cartaai-white">Stock</TableHead>
            <TableHead className="text-cartaai-white">Estado</TableHead>
            <TableHead className="text-cartaai-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {options.map((option) => (
            <TableRow key={option._id}>
              <TableCell className="text-cartaai-white">{option.name}</TableCell>
              <TableCell className="text-cartaai-white">${option.price}</TableCell>
              <TableCell className="text-cartaai-white">{option.stock || 'N/A'}</TableCell>
              <TableCell>
                <OptionToggle option={option} />
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 items-center justify-start">
                  {loadingOptionId === option._id ? (
                    <div className="animate-spin h-5 w-5 border-2 border-cartaai-red border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOption(option);
                          setIsEditModalOpen(true);
                        }}
                        className="text-cartaai-white hover:text-cartaai-red"
                        disabled={loadingOptionId === option._id}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOption(option._id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loadingOptionId === option._id}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AddOptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddOption={handleAddOption}
        setIsAddModalOpen={setIsAddModalOpen}
      />

      <EditOptionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        option={selectedOption}
        onEditOption={handleEditOption}
      />

      <SelectLocalsModal
        isOpen={isSelectLocalsModalOpen}
        onClose={() => {
          setIsSelectLocalsModalOpen(false);
          setSelectedOption(null);
        }}
        onConfirm={handleLocalsSelectedWrapper}
        title="Seleccionar locales para actualizar la opción"
      />
    </div>
  );
};

export default OptionsTab;
