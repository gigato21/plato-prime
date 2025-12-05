import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import BasicProductForm from '../../../components/menu/BasicProductForm';
import SelectLocalsModal from './SelectLocalsModal';

const ProductFormModal = ({ isOpen, onClose, product, categories }) => {
  const API_URLS = getApiUrls();
  const [isSelectLocalsModalOpen, setIsSelectLocalsModalOpen] = useState(false);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    basePrice: '',
    isCombo: false,
    isOutOfStock: false,
    imageUrl: '',
    imageFile: null,
    modifiers: []
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        categoryId: product.categoryId,
        basePrice: product.basePrice,
        isCombo: product.isCombo || false,
        isOutOfStock: product.isOutOfStock || false,
        imageUrl: product.imageUrl || '',
        imageFile: null,
        modifiers: product.modifiers || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        basePrice: '',
        isCombo: false,
        isOutOfStock: false,
        imageUrl: '',
        imageFile: null,
        modifiers: []
      });
    }
  }, [product]);

  const queryClient = useQueryClient();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { toast } = useToast();

  const handleLocalsSelected = async (selectedLocals) => {
    createMultipleLocalProductMutation.mutate({...formData, selectedLocals});
  }

  const createMultipleLocalProductMutation = useMutation({
    mutationFn: async (data) => {
      onClose();
      const formDataToSend = new FormData();
      
      if (data.imageFile) {
        formDataToSend.append('image', data.imageFile);
      }

      const productData = {
        name: data.name,
        description: data.description,
        categoryId: categories.find(cat => cat.id === data.categoryId)?.rId,
        basePrice: Number(data.basePrice),
        isCombo: Boolean(data.isCombo),
        isOutOfStock: Boolean(data.isOutOfStock),
        modifiers: data.modifiers || [],
        rId: `PROD_${Date.now()}`,
        source: "0",
        localsId: data.selectedLocals
      };

      formDataToSend.append('data', JSON.stringify(productData));

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/create-multiple-local/${subDomain}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el producto');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
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

  const createProductMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      
      if (data.imageFile) {
        formDataToSend.append('image', data.imageFile);
      }

      const productData = {
        name: data.name,
        description: data.description,
        categoryId: categories.find(cat => cat.id === data.categoryId)?.rId,
        basePrice: Number(data.basePrice),
        isCombo: Boolean(data.isCombo),
        isOutOfStock: Boolean(data.isOutOfStock),
        modifiers: data.modifiers || [],
        rId: `PROD_${Date.now()}`,
        source: "0"
      };

      formDataToSend.append('data', JSON.stringify(productData));

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/create/${subDomain}/${localId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el producto');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      
      if (data.imageFile) {
        formDataToSend.append('image', data.imageFile);
      }

      const productData = {
        ...data,
        categoryId: categories.find(cat => cat.id === data.categoryId)?.rId,
        basePrice: Number(data.basePrice)
      };
      delete productData.imageFile;

      Object.keys(productData).forEach(key => {
        if (typeof productData[key] === 'object') {
          formDataToSend.append(key, JSON.stringify(productData[key]));
        } else {
          formDataToSend.append(key, productData[key]);
        }
      });

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/${product._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el producto');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product) {
      updateProductMutation.mutate(formData);
    } else {
      createProductMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicProductForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
          />
          <div className="flex justify-end space-x-2 sticky bottom-0 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-cartaai-white"
            >
              Cancelar
            </Button>
            {
              (!product && localId == "-1") ? 
               <Button
               onClick={() => {
                  setIsSelectLocalsModalOpen(true);
               }}
               type="button"
              className="test bg-cartaai-red hover:bg-cartaai-red/80"
            >
              Crear
            </Button> :
            <Button
              type="submit"
              className="bg-cartaai-red hover:bg-cartaai-red/80"
              disabled={createProductMutation.isLoading || updateProductMutation.isLoading}
            >
              {createProductMutation.isLoading || updateProductMutation.isLoading
                ? 'Guardando...'
                : product ? 'Actualizar' : 'Crear'}
            </Button>
            }
             <SelectLocalsModal
              isOpen={isSelectLocalsModalOpen}
              onClose={() => {
                setIsSelectLocalsModalOpen(false);
              }}
              onConfirm={handleLocalsSelected}
              title="Seleccionar locales para crear el producto."
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal; 