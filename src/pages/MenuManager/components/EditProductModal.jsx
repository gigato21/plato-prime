import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import EditProductForm from './EditProductForm';
import ProductImageUploader from './ProductImageUploader';
import EditProductModalHeader from './EditProductModalHeader';
import EditProductModalFooter from './EditProductModalFooter';
import ModifiersSection from './ModifiersSection';
import { processFormData } from '@/utils/productFormUtils';
import PresentationFormSection from './PresentationFormSection';
import { useQueryClient } from '@tanstack/react-query';
import SelectLocalsModal from './SelectLocalsModal';

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated, categories }) => {
  const API_URLS = getApiUrls();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    isCombo: false,
    isOutOfStock: false,
    imageUrl: '',
    imageFile: null,
    modifiers: [],
    categoryId: '',
    presentations: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [isSavingPresentations, setIsSavingPresentations] = useState(false);
  const [isSelectLocalsModalOpen, setIsSelectLocalsModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);

  const { toast } = useToast();
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        basePrice: product.basePrice || 0,
        isCombo: product.isCombo || false,
        isOutOfStock: product.isOutOfStock || false,
        imageUrl: product.imageUrl || '',
        imageFile: null,
        modifiers: product.modifiers || [],
        categoryId: product.categoryId || '',
        presentations: []
      });
    }
  }, [product]);

  const loadPresentations = async () => {
    if (product?.rId) {
      try {
        const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/presentaciones/by-product/${product.rId}/${subDomain}/${localId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        if (!response.ok) {
          throw new Error('Error al cargar las presentaciones');
        }
        const presentations = await response.json();
        setFormData(prev => ({
          ...prev,
          presentations: presentations.map(p => ({
            id: p._id,
            rId: p.rId,
            name: p.name,
            price: p.price,
            description: p.description || '',
            isAvailableForDelivery: p.isAvailableForDelivery,
            stock: p.stock || 0,
            imageUrl: p.imageUrl,
            isPromotion: p.isPromotion || null,
            servingSize: p.servingSize || null,
            amountWithDiscount: p.amountWithDiscount || null,
            discountValue: p.discountValue || null,
            discountType: p.discountType || null,
          }))
        }));
      } catch (error) {
        console.error('Error loading presentations:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las presentaciones",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadPresentations();
    }
  }, [isOpen]);

  const handleAddPresentationModalClose = async () => {
    await loadPresentations();
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      presentations: prev.presentations.map(presentation => {
        const price = Number(presentation.price) || 0;
        const discountValue = Number(presentation.discountValue) || 0;
        const discountType = presentation.discountType;

        let amountWithDiscount = price;
        if (discountType === 0) {
          amountWithDiscount = price - (price * (discountValue / 100));
        } else if (discountType === 1) {
          amountWithDiscount = price - discountValue;
        }

        return {
          ...presentation,
          amountWithDiscount: Math.max(0, amountWithDiscount)
        };
      })
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePresentationChange = (updatedPresentations) => {
    if (Array.isArray(updatedPresentations)) {
      setFormData(prev => ({
        ...prev,
        presentations: updatedPresentations.map(presentation => ({
          ...presentation,
          price: Number(presentation.price) || 0,
          stock: Number(presentation.stock) || 0,
          servingSize: Number(presentation.servingSize) || 0,
          discountValue: Number(presentation.discountValue) || 0,
          amountWithDiscount: calculateAmountWithDiscount(
            Number(presentation.price) || 0,
            Number(presentation.discountValue) || 0,
            presentation.discountType
          )
        }))
      }));
    }
  };

  const calculateAmountWithDiscount = (price, discountValue, discountType) => {
    let amountWithDiscount = price;
    if (discountType === 0) {
      amountWithDiscount = price - (price * (discountValue / 100));
    } else if (discountType === 1) {
      amountWithDiscount = price - discountValue;
    }
    return Math.max(0, amountWithDiscount);
  };

  const handleSavePresentations = async () => {
    setIsSavingPresentations(true);
    try {
      const updatePromises = formData.presentations.map(async (presentation) => {
        if (!presentation.id) return null;

        const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/presentaciones/${presentation.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: presentation.name,
            description: presentation.description,
            price: Number(presentation.price),
            isAvailableForDelivery: presentation.isAvailableForDelivery,
            stock: Number(presentation.stock),
            imageUrl: presentation.imageUrl,
            isPromotion: presentation.isPromotion,
            servingSize: Number(presentation.servingSize),
            amountWithDiscount: presentation.amountWithDiscount,
            discountValue: presentation.discountValue,
            discountType: presentation.discountType,
          })
        });

        if (!response.ok) {
          throw new Error('Error al actualizar la presentación');
        }
      });

      await Promise.all(updatePromises);
      
      toast({
        title: "Éxito",
        description: "Presentaciones actualizadas correctamente",
      });
    } catch (error) {
      console.error('Error updating presentations:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar las presentaciones",
        variant: "destructive",
      });
    } finally {
      setIsSavingPresentations(false);
    }
  };

  const handleDeletePresentation = async (index) => {
    const presentation = formData.presentations[index];
    if (!presentation.id) {
      const newPresentations = [...formData.presentations];
      newPresentations.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        presentations: newPresentations
      }));
      return;
    }

    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/presentaciones/${presentation.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la presentación');
      }

      const newPresentations = [...formData.presentations];
      newPresentations.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        presentations: newPresentations
      }));

      queryClient.invalidateQueries(['presentations', product?.rId]);

      toast({
        title: "Éxito",
        description: "Presentación eliminada correctamente",
      });
    } catch (error) {
      console.error('Error deleting presentation:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la presentación",
        variant: "destructive",
      });
    }
  };

  const updateProductInLocal = async (localId, formDataToSend) => {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/update-by-rid/${product.rId}/${subDomain}/${localId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el producto en el local ${localId}`);
    }

    return response.json();
  };

  const handleLocalsSelected = async (selectedLocals) => {
    if (!pendingFormData) return;

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('localIds', JSON.stringify(selectedLocals));
      formDataToSend.append('changes', JSON.stringify(pendingFormData));
      formDataToSend.append('subDomain', subDomain);
      formDataToSend.append('image', imageFile);

      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/v2/update-multiple-local/productos/${product.rId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error('Error al actualizar el producto');

      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['presentations', product?.rId]);

      toast.success("Producto actualizado en los locales seleccionados");
      setIsSelectLocalsModalOpen(false);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error("No se pudo actualizar el producto");
    } finally {
      setIsLoading(false);
      setPendingFormData(null);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      const processedData = processFormData(formData);

      if (localId === "-1") {
        setPendingFormData(processedData);
        setIsSelectLocalsModalOpen(true);
        return;
      }

      const formDataToSend = new FormData();
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      formDataToSend.append('data', JSON.stringify(processedData));

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/${product._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el producto');
      }

      if (onProductUpdated) {
        onProductUpdated(processedData);
      }

      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['presentations', product?.rId]);

      toast.success("Producto actualizado correctamente");
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.message || "No se pudo actualizar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] max-h-[85vh] overflow-y-auto mt-5 ml-5">
          <EditProductModalHeader />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="glass-container p-6 rounded-lg">
                <EditProductForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  categories={categories}
                  rId={product?.rId}
                />
                <ModifiersSection
                  selectedModifiers={formData.modifiers || []}
                  onChange={(modifiers) => setFormData(prev => ({ ...prev, modifiers }))}
                />
                <ProductImageUploader
                  imageUrl={formData.imageUrl}
                  onImageUpload={(file) => {
                    setImageFile(file);
                    setFormData(prev => ({
                      ...prev,
                      imageFile: file,
                      imageUrl: URL.createObjectURL(file)
                    }));
                  }}
                />
                <EditProductModalFooter 
                  isLoading={isLoading}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
            <div>
              <PresentationFormSection
                presentations={formData.presentations}
                onPresentationChange={handlePresentationChange}
                onDeletePresentation={handleDeletePresentation}
                onSavePresentations={handleSavePresentations}
                isLoading={isSavingPresentations}
                productId={product?.rId}
                onAddModalClose={handleAddPresentationModalClose}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SelectLocalsModal
        isOpen={isSelectLocalsModalOpen}
        onClose={() => setIsSelectLocalsModalOpen(false)}
        onConfirm={handleLocalsSelected}
        title="Seleccionar locales para actualizar el producto"
      />
    </>
  );
};

export default EditProductModal;
