import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PresentationForm from './PresentationForm';
import { useToast } from "@/components/ui/use-toast";

const AddPresentationModal = ({ isOpen, onClose, onSave, productId }) => {
  const [presentation, setPresentation] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    isAvailableForDelivery: true
  });

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!presentation.name || !presentation.price) {
      toast({
        title: "Error",
        description: "Por favor complete los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const presentationData = {
      rId: `PRES_${Date.now()}`,
      source: "0",
      productId,
      ...presentation,
      price: Number(presentation.price),
      stock: Number(presentation.stock)
    };

    await onSave(presentationData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 bg-cartaai-black pb-4">
          <DialogTitle className="text-cartaai-white">Nueva Presentación</DialogTitle>
        </DialogHeader>
        <div className="pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PresentationForm
              presentation={presentation}
              onChange={setPresentation}
            />
            <div className="flex justify-end space-x-2 sticky bottom-0 pt-4 bg-cartaai-black">
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
                Guardar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPresentationModal;