import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AddPresentationModal from './AddPresentationModal';
import EditPresentationModal from '../../pages/MenuManager/components/EditPresentationModal';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";

const PresentationsSection = ({ productId }) => {
  const API_URLS = getApiUrls();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const queryClient = useQueryClient();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const localId = useSelector((state) => state.auth.localId);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const { toast } = useToast();

  const { data: presentations = [], isLoading } = useQuery({
    queryKey: ['presentations', productId, subDomain, localId],
    queryFn: async () => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/presentaciones/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (!response.ok) throw new Error('Error al cargar presentaciones');
      return response.json();
    },
    enabled: !!productId
  });

  const createPresentationMutation = useMutation({
    mutationFn: async (presentationData) => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/presentaciones`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(presentationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear la presentación');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['presentations', productId]);
      toast({
        title: "Éxito",
        description: "Presentación creada correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deletePresentationMutation = useMutation({
    mutationFn: async (presentationId) => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/presentaciones/${presentationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar la presentación');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['presentations', productId]);
      toast({
        title: "Éxito",
        description: "Presentación eliminada correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddPresentation = async (presentationData) => {
    await createPresentationMutation.mutate(presentationData);
  };

  const handleEditClick = (presentation) => {
    setSelectedPresentation(presentation);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-4 text-cartaai-white">Cargando presentaciones...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Presentaciones</h3>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-cartaai-red hover:bg-cartaai-red/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Presentación
        </Button>
      </div>

      <div className="space-y-4">
        {presentations.map((presentation) => (
          <div
            key={presentation._id}
            className="flex justify-between items-center p-4 border border-cartaai-white/10 rounded-lg"
          >
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-200">{presentation.name}</h4>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Precio: S/ {presentation.price.toFixed(2)} - Stock: {presentation.stock}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditClick(presentation)}
                className="text-cartaai-white hover:text-cartaai-white/80"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deletePresentationMutation.mutate(presentation._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AddPresentationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPresentation}
        productId={productId}
      />

      {selectedPresentation && (
        <EditPresentationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPresentation(null);
          }}
          presentation={selectedPresentation}
          productId={productId}
        />
      )}
    </div>
  );
};

export default PresentationsSection;
