import React, { useEffect, useState } from 'react';
import { fetchIntegrationData } from './services/integrationService';
import { useSelector } from 'react-redux';
import Step1Categories from './components/Step1Categories';
import Step2Modifiers from './components/Step2Modifiers';
import Step3Products from './components/Step3Products';
import { getApiUrls } from '@/config/api';
import { toast } from "sonner";


const IntegrationPage2 = () => {
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);
  const token = useSelector(state => state.auth.accessToken);
  const [isSending, setIsSending] = useState(false);

  const [integrationData, setIntegrationData] = useState({
    restpe: {
      categorias: [],
      productos: [],
      modificadores: []
    },
    cartaai: {
      categorias: [],
      productos: [],
      modificadores: []
    },
    comparison: {
      categorias: [],
      productos: [],
      modificadores: []
    }
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [integrationPayload, setIntegrationPayload] = useState({
    categories: [],
    products: [],
    modifiers: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIntegrationData(subDomain, localId, token);
        setIntegrationData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [subDomain, localId, token]);

  const handleUpdateCategory = (categoryData) => {
    console.log('Recibiendo actualización de categoría:', categoryData);
    
    setIntegrationPayload(prev => {
      const existingIndex = prev.categories.findIndex(c => c.id === categoryData.id);
      
      const newCategory = {
        id: categoryData.id,
        name: categoryData.name,
        description: categoryData.description || '',
        imageUrl: categoryData.imageUrl || '',
        order: categoryData.order || 0,
        status: categoryData.status,
        source: categoryData.source
      };

      if (existingIndex >= 0) {
        const newCategories = [...prev.categories];
        newCategories[existingIndex] = newCategory;
        console.log('Actualizando categoría existente en el payload:', {
          prev: prev.categories[existingIndex],
          new: newCategory
        });
        return {
          ...prev,
          categories: newCategories
        };
      } else {
        console.log('Agregando nueva categoría al payload:', newCategory);
        return {
          ...prev,
          categories: [...prev.categories, newCategory]
        };
      }
    });
  };

  const handleUpdateModifier = (modifierData) => {
    console.log('Recibiendo actualización de modificador:', modifierData);
    
    setIntegrationPayload(prev => {
      const existingIndex = prev.modifiers.findIndex(m => m.id === modifierData.id);
      
      const newModifier = {
        id: modifierData.id,
        name: modifierData.name,
        isMultiple: modifierData.isMultiple,
        minQuantity: modifierData.minQuantity,
        maxQuantity: modifierData.maxQuantity,
        status: modifierData.status,
        source: modifierData.source,
        options: modifierData.options.map(opt => ({
          id: opt.id,
          name: opt.name,
          price: opt.price,
          stock: opt.stock,
          status: opt.status
        }))
      };

      if (existingIndex >= 0) {
        const newModifiers = [...prev.modifiers];
        newModifiers[existingIndex] = newModifier;
        console.log('Actualizando modificador existente en el payload:', {
          prev: prev.modifiers[existingIndex],
          new: newModifier
        });
        return {
          ...prev,
          modifiers: newModifiers
        };
      } else {
        console.log('Agregando nuevo modificador al payload:', newModifier);
        return {
          ...prev,
          modifiers: [...prev.modifiers, newModifier]
        };
      }
    });
  };

  const handleUpdateProduct = (productData) => {
    console.log('=== Actualizando producto en payload ===');
    console.log('Datos del producto:', productData);
    
    setIntegrationPayload(prev => {
      const existingIndex = prev.products.findIndex(p => p.id === productData.id);
      
      const newProduct = {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        categoryId: productData.categoryId,
        isCombo: productData.isCombo,
        isOutOfStock: productData.isOutOfStock,
        basePrice: productData.basePrice,
        imageUrl: productData.imageUrl,
        status: productData.status,
        source: productData.source,
        presentations: productData.presentations.map(pres => ({
          id: pres.id,
          name: pres.name,
          description: pres.description || '',
          price: pres.price,
          isAvailableForDelivery: pres.isAvailableForDelivery,
          stock: pres.stock,
          status: pres.status
        })),
        modifiers: productData.modifiers?.map(mod => ({
          modifierId: mod.modifierId,
          customizedOptions: mod.customizedOptions.map(opt => ({
            optionId: opt.optionId,
            isAvailable: opt.isAvailable,
            price: opt.price
          }))
        })) || []
      };

      console.log('Nuevo producto a agregar/actualizar:', newProduct);

      if (existingIndex >= 0) {
        const newProducts = [...prev.products];
        newProducts[existingIndex] = newProduct;
        console.log('Actualizando producto existente en el payload:', {
          prev: prev.products[existingIndex],
          new: newProduct
        });
        return {
          ...prev,
          products: newProducts
        };
      } else {
        console.log('Agregando nuevo producto al payload:', newProduct);
        return {
          ...prev,
          products: [...prev.products, newProduct]
        };
      }
    });
  };
  const API_URL = getApiUrls();

  const handleSendIntegration = async () => {
    try {
      setIsSending(true);
      console.log('========================');
      console.log('Payload:', integrationPayload);

      const response = await fetch(
        `${API_URL.SERVICIOS_GENERALES_URL}/api/v1/integration-import/${subDomain}/${localId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(integrationPayload)
        }
      );

      console.log('=== Respuesta del servidor ===');
      console.log('Data:', response.data);

      toast.success('Integración enviada exitosamente');

      // Recargar la página después de una integración exitosa
      window.location.reload();

    } catch (error) {
      console.error('Error al enviar la integración:', error);
      console.log('=== Detalles del error ===');
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.log('========================');

      toast.error('Error al enviar la integración. Por favor, intente nuevamente.');
    } finally {
      setIsSending(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass-container rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-cartaai-white">Cargando...</h2>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass-container p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-cartaai-red">Error</h2>
        <p className="text-cartaai-white mt-2">{error}</p>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Categories
            data={integrationData}
            onNext={() => setCurrentStep(2)}
            onUpdateCategory={handleUpdateCategory}
            integrationData={integrationPayload}
          />
        );
      case 2:
        return (
          <Step2Modifiers
            data={integrationData}
            onBack={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
            onUpdateModifier={handleUpdateModifier}
            integrationData={integrationPayload}
          />
        );
      case 3:
        return (
          <Step3Products
            data={integrationData}
            onBack={() => setCurrentStep(2)}
            onUpdateProduct={handleUpdateProduct}
            integrationData={integrationPayload}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold mb-2 text-cartaai-white">Integración de Menú</h1>
        {renderStep()}
        
        {currentStep === 3 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSendIntegration}
              disabled={isSending}
              className={`glass-button glass-button-sm text-sm py-2 px-4 ${
                isSending 
                  ? 'bg-cartaai-green/10 cursor-not-allowed' 
                  : 'bg-cartaai-green/20 hover:bg-cartaai-green/30'
              } relative`}
            >
              {isSending ? (
                <>
                  <span className="mr-2">Enviando...</span>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-cartaai-white/20 border-t-cartaai-white rounded-full animate-spin"></div>
                  </div>
                </>
              ) : (
                'Enviar Integración'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationPage2;
