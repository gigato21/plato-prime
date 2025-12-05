import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PresentationForm from '../../../components/menu/PresentationForm';
import { useToast } from "@/components/ui/use-toast";
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

const EditPresentationModal = ({ isOpen, onClose, presentation, productId }) => {
  const API_URLS = getApiUrls();
  const [editedPresentation, setEditedPresentation] = useState(presentation);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/presentaciones/${presentation._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editedPresentation.name,
          description: editedPresentation.description,
          price: Number(editedPresentation.price),
          isAvailableForDelivery: editedPresentation.isAvailableForDelivery,
          stock: Number(editedPresentation.stock),
          imageUrl: editedPresentation.imageUrl
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la presentación');
      }

      queryClient.invalidateQueries(['presentations', productId]);
      toast({
        title: "Éxito",
        description: "Presentación actualizada correctamente",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className=" z-10 pb-4">
          <DialogTitle className="text-gray-700 dark:text-gray-200">Editar Presentación</DialogTitle>
        </DialogHeader>
        <div className="pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PresentationForm
              presentation={editedPresentation}
              onChange={setEditedPresentation}
            />
            <div className="flex justify-end space-x-2 sticky bottom-0 pt-4 ">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-cartaai-white"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-cartaai-red hover:bg-cartaai-red/80"
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPresentationModal;