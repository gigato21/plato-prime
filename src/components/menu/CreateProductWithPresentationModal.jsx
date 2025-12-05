import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import BasicProductForm from './BasicProductForm';
import PresentationForm from './PresentationForm';
import { Plus, Trash2 } from 'lucide-react';

const CreateProductWithPresentationModal = ({ isOpen, onClose, categories = [] }) => {
  const API_URLS = getApiUrls();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    isCombo: false,
    isOutOfStock: false,
    imageUrl: '',
    modifiers: []
  });

  const [presentations, setPresentations] = useState([{
    name: '',
    description: '',
    price: '',
    isAvailableForDelivery: true,
    stock: 100,
    imageUrl: ''
  }]);

  const queryClient = useQueryClient();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const { toast } = useToast();

  const handleAddPresentation = () => {
    setPresentations([...presentations, {
      name: '',
      description: '',
      price: '',
      isAvailableForDelivery: true,
      stock: 100,
      imageUrl: ''
    }]);
  };

  const handleRemovePresentation = (index) => {
    if (presentations.length > 1) {
      const newPresentations = presentations.filter((_, i) => i !== index);
      setPresentations(newPresentations);
    }
  };

  const handlePresentationChange = (index, newData) => {
    const newPresentations = [...presentations];
    newPresentations[index] = newData;
    setPresentations(newPresentations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/with-presentation/${subDomain}/${localId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          producto: {
            rId: `PROD_${Date.now()}`,
            source: "0",
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId,
            basePrice: Number(presentations[0].price),
            isCombo: formData.isCombo,
            isOutOfStock: formData.isOutOfStock,
            imageUrl: formData.imageUrl,
            modifiers: formData.modifiers
          },
          presentaciones: presentations.map((pres, index) => ({
            rId: `PRES_${Date.now()}_${index}`,
            source: "0",
            name: pres.name,
            description: pres.description,
            price: Number(pres.price),
            isAvailableForDelivery: pres.isAvailableForDelivery,
            stock: Number(pres.stock),
            imageUrl: pres.imageUrl
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el producto con presentaciones');
      }

      queryClient.invalidateQueries(['products']);
      toast({
        title: "Éxito",
        description: "Producto con presentaciones creado correctamente",
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className=" z-10 pb-4">
          <DialogTitle className="text-gray-700">
            Nuevo Producto con Presentaciones
          </DialogTitle>
        </DialogHeader>
        <div className="pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Información del Producto</h3>
                <BasicProductForm
                  formData={formData}
                  setFormData={setFormData}
                  categories={categories}
                  hideBasePrice={true}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Presentaciones</h3>
                  <Button
                    type="button"
                    onClick={handleAddPresentation}
                    className="bg-cartaai-red hover:bg-cartaai-red/80"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Presentación
                  </Button>
                </div>
                <div className="space-y-6">
                  {presentations.map((presentation, index) => (
                    <div key={index} className="relative border border-cartaai-white/10 rounded-lg p-4">
                      {presentations.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          onClick={() => handleRemovePresentation(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <PresentationForm
                        presentation={presentation}
                        onChange={(newData) => handlePresentationChange(index, newData)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
                Crear Producto
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductWithPresentationModal;