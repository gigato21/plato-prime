import { useState, useEffect } from 'react';
import ProductPresentations from '../../../components/ProductPresentations';
import AddPresentationModal from '../../../components/menu/AddPresentationModal';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";

const PresentationFormSection = ({
  presentations,
  onPresentationChange,
  onSavePresentations,
  onDeletePresentation,
  productId,
  onAddModalClose
}) => {
  const API_URLS = getApiUrls();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const { toast } = useToast();

  const handleSavePresentation = async (presentationData) => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/presentaciones/create/${subDomain}/${localId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(presentationData),
      });

      if (!response.ok) {
        throw new Error('Error al crear la presentación');
      }

      setIsAddModalOpen(false);
      
      // Llamar a la función de cierre del modal que recargará las presentaciones
      if (onAddModalClose) {
        await onAddModalClose();
      }
      
      toast({
        title: "Éxito",
        description: "Presentación creada correctamente",
      });
    } catch (error) {
      console.error('Error creating presentation:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la presentación",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log('Presentaciones actualizadas:', presentations);
  }, [presentations]);

  return (
    <div className="space-y-6 glass-container p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-cartaai-white border-b border-cartaai-white/10 pb-2">
        Presentaciones del Producto
      </h3>
      <ProductPresentations
        presentations={presentations}
        onPresentationChange={onPresentationChange}
        onAddPresentation={() => setIsAddModalOpen(true)}
        onDeletePresentation={onDeletePresentation}
        onSavePresentations={onSavePresentations}
      />
      
      <AddPresentationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          if (onAddModalClose) {
            onAddModalClose();
          }
        }}
        onSave={handleSavePresentation}
        productId={productId}
      />
    </div>
  );
};

export default PresentationFormSection;