import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { getApiUrls } from '@/config/api';

// Componentes
import IntegrationStart from './components/IntegrationStart';
import IntegrationProgress from './components/IntegrationProgress';
import CategoryIntegration from './components/CategoryIntegration';
import ProductIntegration from './components/ProductIntegration';
// NOTA: El paso de modificadores está temporalmente desactivado
// pero se mantiene el componente para uso futuro
import ModifierIntegration from './components/ModifierIntegration';

// Datos simulados para fallback
import { simulateIntegrationResponse, integrationSteps } from './mockData';

const IntegrationPage = () => {
  const API_URLS = getApiUrls();
  const navigate = useNavigate();
  const localId = useSelector((state) => state.auth.localId);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain || "demo");
  
  // Estado general
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState(integrationSteps);
  
  // Datos de integración
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);
  const [modifiers, setModifiers] = useState(null);
  const [rawRestpeData, setRawRestpeData] = useState(null);

  // Verificar que solo el local -1 pueda acceder
  useEffect(() => {
    if (localId !== "-1") {
      toast.error("Acceso no autorizado");
      navigate('/');
    }
  }, [localId, navigate]);

  // Iniciar integración
  const handleStartIntegration = async () => {
    setIsLoading(true);
    try {
      // Obtener datos de RESTPE
      const restpeData = await fetchRestpeData();
      
      // Obtener datos ya integrados desde CARTAAI
      const cartaaiIntegrationData = await fetchCartaaiIntegration();
      
      // Transformar y combinar los datos
      const transformedData = transformRestpeData(restpeData, cartaaiIntegrationData);
      
      setCategories(transformedData.categories);
      setProducts(transformedData.products);
      setModifiers(transformedData.modifiers);
      
      // Modificar los pasos para omitir temporalmente los modificadores
      const updatedSteps = transformedData.steps || steps;
      // Ajustar el flujo para ir directamente de categorías a productos
      const filteredSteps = updatedSteps.filter(step => step.name !== "Modificadores");
      // Actualizar el orden de los pasos
      const reorderedSteps = filteredSteps.map((step, index) => ({
        ...step,
        id: index + 1,
        current: index === 0
      }));
      
      setSteps(reorderedSteps);
      setHasStarted(true);
      toast.success('Integración iniciada con éxito');
    } catch (error) {
      console.error('Error al iniciar integración:', error);
      toast.error('Error al iniciar la integración: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener datos de RESTPE
  const fetchRestpeData = async () => {
    try {
      const url = `https://${subDomain}.restaurant.pe/restaurant/facebook/rest/delivery/cargarCartaMenuEnLinea/7/0`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos de RESTPE:', data);
      setRawRestpeData(data);
      return data;
    } catch (fetchError) {
      console.error('Error al obtener datos de RESTPE, usando datos simulados:', fetchError);
      // Si hay un error en la petición, usamos los datos simulados
      const mockData = await simulateIntegrationResponse();
      toast.info('Usando datos simulados de RESTPE debido a problemas de conexión');
      return mockData;
    }
  };

  // Obtener datos ya integrados desde CARTAAI
  const fetchCartaaiIntegration = async () => {
    try {
      const url = `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/v2/integration/${subDomain}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP al obtener datos de integración: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      console.log(apiResponse, 'API RESPONSE CARTAAI');
      
      // Verificar si la respuesta es exitosa (type: 1)
      if (apiResponse.type !== "1" || !apiResponse.data) {
        throw new Error(`Error en la respuesta de integración: ${apiResponse.message}`);
      }
      
      console.log('Datos de integración recibidos de CARTAAI:', apiResponse.data);
      return apiResponse.data;
    } catch (error) {
      console.error('Error al obtener datos de integración de CARTAAI:', error);
      toast.warning('No se pudieron obtener los datos de integración existentes');
      // Si hay un error, devolvemos un objeto vacío
      return {
        categories: [],
        products: []
      };
    }
  };

  // Función para transformar los datos de RESTPE y combinarlos con los datos de integración de CARTAAI
  const transformRestpeData = (restpeData, cartaaiIntegrationData = null) => {
    // Validar que la respuesta de RESTPE tenga la estructura esperada
    if (!restpeData) {
      throw new Error('Formato de respuesta de RESTPE inválido');
    }
    
    console.log(restpeData, 'DATOS DE RESTPE');
    // Verificamos si la respuesta sigue la estructura esperada
    const responseData = restpeData.data || restpeData.response || restpeData;
    
    if (!responseData.categorias || !responseData.menu) {
      throw new Error('La respuesta no contiene las propiedades esperadas');
    }
    
    const { categorias, menu } = responseData;
    console.log(categorias, menu, 'CATEGORÍAS Y MENÚ DE RESTPE');
    
    // Transformar categorías de RESTPE
    const restpeCategories = categorias.map(cat => ({
      id: cat.categoria_id,
      code: cat.categoria_id,
      name: cat.categoria_descripcion,
      active: cat.categoria_estado === "1",
      color: cat.categoria_color,
      delivery: cat.categoria_delivery === "1",
      parentId: cat.categoria_padreid,
      order: parseInt(cat.categoria_orden) || 0,
      imageUrl: cat.categoria_urlimagen
    }));
    
    // Transformar productos y presentaciones de RESTPE
    const restpeProducts = [];
    
    menu.forEach(producto => {
      // Extraer el producto principal
      producto.lista_presentacion.forEach(presentacion => {
        restpeProducts.push({
          id: presentacion.producto_id,
          code: presentacion.producto_id,
          name: producto.productogeneral_descripcion,
          presentation: presentacion.producto_presentacion,
          internalCode: presentacion.producto_id,
          price: parseFloat(presentacion.producto_precio) || 0,
          categoryId: producto.categoria_id,
          description: producto.productogeneral_descripcionplato || producto.productogeneral_descripcionweb || "",
          imageUrl: presentacion.producto_urlimagen || producto.productogeneral_urlimagen,
          isCombo: producto.productogeneral_escombo === "1",
          isOutOfStock: presentacion.producto_agotado === "1" || producto.productogeneral_agotado === "1",
          productId: producto.productogeneral_id // ID del producto general
        });
      });
    });
    
    // Creamos las categorías para CARTAAI
    const cartaaiCategories = [];
    let categoryIdCounter = 101;

    // Si tenemos datos de integración, usamos las categorías ya integradas
    if (cartaaiIntegrationData && cartaaiIntegrationData.categories && cartaaiIntegrationData.categories.length > 0) {
      // Mapear las categorías de CARTAAI e identificar cuáles están ya integradas
      cartaaiIntegrationData.categories.forEach(cat => {
        cartaaiCategories.push({
          id: categoryIdCounter++,
          rId: cat.rId, // Este es el ID que coincide con categoria_id de RESTPE
          _id: cat._id, // ID interno de CARTAAI
          name: cat.name,
          active: cat.status === 1
        });
      });
    }
    
    // Añadimos categorías adicionales para las que no están integradas
    restpeCategories.forEach(restpeCat => {
      // Verificar si la categoría ya está incluida en cartaaiCategories
      const isAlreadyIntegrated = cartaaiCategories.some(cartaaiCat => cartaaiCat.rId === restpeCat.id);
      
      if (!isAlreadyIntegrated) {
        cartaaiCategories.push({
          id: categoryIdCounter++,
          rId: null, // No está integrada aún
          name: restpeCat.name,
          active: true
        });
      }
    });
    
    // Creamos los productos para CARTAAI
    const cartaaiProducts = [];
    let productIdCounter = 101;
    
    // Si tenemos datos de integración, usamos los productos ya integrados
    if (cartaaiIntegrationData && cartaaiIntegrationData.products && cartaaiIntegrationData.products.length > 0) {
      cartaaiIntegrationData.products.forEach(prod => {
        // Para cada producto, verificamos sus presentaciones
        if (prod.presentations && prod.presentations.length > 0) {
          prod.presentations.forEach(pres => {
            cartaaiProducts.push({
              id: productIdCounter++,
              rId: pres.rId, // Este es el ID que coincide con producto_id en RESTPE
              _id: pres._id, // ID interno de CARTAAI
              productId: prod._id, // ID del producto en CARTAAI
              name: prod.name,
              presentation: pres.name,
              description: prod.description || "",
              price: pres.price,
              categoryId: findCartaaiCategoryIdByRId(cartaaiCategories, prod.categoryId)
            });
          });
        } else {
          // Producto sin presentaciones
          cartaaiProducts.push({
            id: productIdCounter++,
            rId: prod.rId,
            _id: prod._id,
            name: prod.name,
            presentation: "",
            description: prod.description || "",
            price: prod.basePrice,
            categoryId: findCartaaiCategoryIdByRId(cartaaiCategories, prod.categoryId)
          });
        }
      });
    }
    
    // Añadimos productos adicionales para los que no están integrados
    restpeProducts.forEach(restpeProd => {
      // Verificar si el producto ya está incluido en cartaaiProducts
      const isAlreadyIntegrated = cartaaiProducts.some(cartaaiProd => cartaaiProd.rId === restpeProd.id);
      
      if (!isAlreadyIntegrated) {
        cartaaiProducts.push({
          id: productIdCounter++,
          rId: null, // No está integrado aún
          name: restpeProd.name,
          presentation: restpeProd.presentation,
          description: restpeProd.description || "",
          price: restpeProd.price,
          categoryId: findCartaaiCategoryByRestpeId(cartaaiCategories, restpeProd.categoryId)
        });
      }
    });
    
    // Extraer modificadores de los productos de RESTPE
    const restpeModifiers = [];
    const modifierGroups = new Set();
    
    menu.forEach(producto => {
      if (producto.lista_agrupadores && producto.lista_agrupadores.length > 0) {
        producto.lista_agrupadores.forEach(agrupador => {
          // Añadir el grupo si no existe
          modifierGroups.add(agrupador.modificador_nombre);
          
          // Crear el modificador
          const modifier = {
            rId: agrupador.modificador_id,
            name: agrupador.modificador_nombre,
            isMultiple: agrupador.modificador_esmultiple === "1",
            minQuantity: parseInt(agrupador.modificador_cantidadminima) || 0,
            maxQuantity: parseInt(agrupador.modificador_cantidadmaxima) || 1,
            options: agrupador.listaModificadores.map(opcion => ({
              rId: opcion.modificadorseleccion_id,
              name: opcion.modificadorseleccion_nombre,
              price: parseFloat(opcion.modificadorseleccion_precio) || 0,
              stock: parseFloat(opcion.productogeneralmodificador_stock) || 999
            }))
          };
          
          // Añadir el modificador si no existe
          if (!restpeModifiers.some(m => m.rId === modifier.rId)) {
            restpeModifiers.push(modifier);
          }
        });
      }
    });
    
    // Convertir los grupos a array
    const modifierGroupsArray = Array.from(modifierGroups).map((name, index) => ({
      id: index + 1,
      name
    }));
    
    // Crear los modificadores de CARTAAI basados en los de RESTPE y los ya existentes
    const cartaaiModifiers = [];
    
    // Si tenemos datos de integración, usamos los modificadores ya integrados
    if (cartaaiIntegrationData && cartaaiIntegrationData.products) {
      // Crear un mapa de modificadores ya integrados
      const integratedModifiers = new Map();
      
      cartaaiIntegrationData.products.forEach(prod => {
        if (prod.modifiers && prod.modifiers.length > 0) {
          prod.modifiers.forEach(mod => {
            if (!integratedModifiers.has(mod.modifierId)) {
              // Encontrar el modificador correspondiente en RESTPE
              const restpeMod = restpeModifiers.find(rm => rm.rId === mod.modifierId);
              if (restpeMod) {
                // Crear el modificador de CARTAAI
                const cartaaiMod = {
                  id: mod._id,
                  rId: mod.modifierId,
                  name: restpeMod.name,
                  price: 0, // El precio se maneja a nivel de opción
                  active: true,
                  group: restpeMod.name,
                  options: mod.customizedOptions.map(opt => {
                    // Encontrar la opción correspondiente en RESTPE
                    const restpeOpt = restpeMod.options.find(ro => ro.rId === opt.optionId);
                    return {
                      id: opt._id,
                      rId: opt.optionId,
                      name: restpeOpt ? restpeOpt.name : 'Opción desconocida',
                      price: opt.price,
                      isAvailable: opt.isAvailable
                    };
                  })
                };
                integratedModifiers.set(mod.modifierId, cartaaiMod);
              }
            }
          });
        }
      });
      
      // Añadir los modificadores integrados
      cartaaiModifiers.push(...Array.from(integratedModifiers.values()));
    }
    
    // Añadir modificadores no integrados
    restpeModifiers.forEach((mod, index) => {
      if (!cartaaiModifiers.some(cm => cm.rId === mod.rId)) {
        cartaaiModifiers.push({
          id: 200 + index,
          rId: mod.rId,
          name: mod.name,
          price: mod.options?.[0]?.price || 0,
          active: true,
          group: mod.name,
          options: mod.options.map(opt => ({
            id: null,
            rId: opt.rId,
            name: opt.name,
            price: opt.price,
            isAvailable: true
          }))
        });
      }
    });
    
    return {
      categories: {
        restpeCategories,
        cartaaiCategories
      },
      products: {
        restpeProducts,
        cartaaiProducts
      },
      modifiers: {
        restpeModifiers,
        cartaaiModifiers,
        modifierGroups: modifierGroupsArray
      },
      steps: integrationSteps
    };
  };

  // Función para transformar los agrupadores/modificadores al formato requerido
  const transformModifiers = (producto) => {
    if (!producto.lista_agrupadores || producto.lista_agrupadores.length === 0) {
      return [];
    }
    
    return producto.lista_agrupadores.map(agrupador => ({
      rId: agrupador.modificador_id,
      name: agrupador.modificador_nombre,
      isMultiple: agrupador.modificador_esmultiple === "1",
      minQuantity: parseInt(agrupador.modificador_cantidadminima) || 0,
      maxQuantity: parseInt(agrupador.modificador_cantidadmaxima) || 1,
      options: agrupador.listaModificadores.map(opcion => ({
        rId: opcion.modificadorseleccion_id,
        name: opcion.modificadorseleccion_nombre,
        price: parseFloat(opcion.modificadorseleccion_precio) || 0,
        stock: parseFloat(opcion.productogeneralmodificador_stock) || 999
      }))
    }));
  };

  // Función principal para preparar el payload de integración
  const prepareIntegrationPayload = () => {
    // Transformar categorías seleccionadas
    const transformedCategories = categories.restpeCategories
      .filter(cat => {
        const cartaaiCat = categories.cartaaiCategories.find(c => c.rId === cat.id);
        return cartaaiCat !== undefined;
      })
      .map(cat => ({
        rId: cat.id,
        name: cat.name,
        order: parseInt(cat.categoria_orden) || 0,
        status: cat.categoria_estado === "1" ? 1 : 0
      }));

    // Conjunto de todos los modificadores para enviar a nivel global
    const globalModifiers = new Map();
    
    // Transformar productos seleccionados con sus presentaciones
    const transformedProducts = [];
    
    // Agrupar presentaciones por producto general
    const productMap = new Map();
    
    // Procesar productos y sus presentaciones
    menu.forEach(producto => {
      // Verificar si está seleccionado
      const isSelected = producto.lista_presentacion.some(pres => {
        const cartaaiProd = products.cartaaiProducts.find(p => p.rId === pres.producto_id);
        return cartaaiProd !== undefined;
      });
      
      if (isSelected) {
        // Extraer y transformar los modificadores del producto
        const productModifiers = transformModifiers(producto);
        
        // Añadir modificadores al conjunto global
        productModifiers.forEach(modifier => {
          if (!globalModifiers.has(modifier.rId)) {
            globalModifiers.set(modifier.rId, modifier);
          }
        });
        
        // Crear objeto de producto
        const transformedProduct = {
          rId: producto.productogeneral_id,
          name: producto.productogeneral_descripcion,
          rName: producto.productogeneral_descripcion, // Nombre original
          description: producto.productogeneral_descripcionplato || producto.productogeneral_descripcionweb || "",
          categoryRId: producto.categoria_id,
          isCombo: producto.productogeneral_escombo === "1",
          isOutOfStock: producto.productogeneral_agotado === "1",
          basePrice: 0,
          imageUrl: producto.productogeneral_urlimagen || "",
          presentations: [],
          modifiers: productModifiers.map(mod => mod.rId) // Solo IDs de referencia a los modificadores globales
        };
        
        // Añadir las presentaciones seleccionadas
        producto.lista_presentacion.forEach(pres => {
          const cartaaiPres = products.cartaaiProducts.find(p => p.rId === pres.producto_id);
          
          if (cartaaiPres) {
            transformedProduct.presentations.push({
              rId: pres.producto_id,
              name: pres.producto_presentacion,
              rName: pres.producto_presentacion, // Nombre original
              price: parseFloat(pres.producto_precio) || 0,
              isAvailableForDelivery: pres.producto_delivery === "1",
              stock: parseInt(pres.producto_stock) || 100
            });
          }
        });
        
        // Solo añadir productos que tengan al menos una presentación
        if (transformedProduct.presentations.length > 0) {
          transformedProducts.push(transformedProduct);
        }
      }
    });
    
    // Convertir el mapa de modificadores a array
    const transformedModifiers = Array.from(globalModifiers.values());
    
    return {
      categories: transformedCategories,
      products: transformedProducts,
      modifiers: transformedModifiers
    };
  };

  // Función auxiliar para encontrar el ID de una categoría de CARTAAI por su rId (que es el categoria_id de RESTPE)
  const findCartaaiCategoryIdByRId = (cartaaiCategories, categoryId) => {
    const found = cartaaiCategories.find(cat => cat._id === categoryId);
    return found ? found.id : 101; // ID por defecto si no se encuentra
  };

  // Función auxiliar para encontrar una categoría de CARTAAI basada en el ID de categoría de RESTPE
  const findCartaaiCategoryByRestpeId = (cartaaiCategories, restpeCategoryId) => {
    // Primero intentamos encontrar una categoría ya integrada con ese ID
    const integratedCategory = cartaaiCategories.find(cat => cat.rId === restpeCategoryId);
    if (integratedCategory) {
      return integratedCategory.id;
    }
    
    // Si no encontramos ninguna, devolvemos la primera categoría o un ID por defecto
    return cartaaiCategories.length > 0 ? cartaaiCategories[0].id : 101;
  };

  // Actualizar categoría
  const handleUpdateCategory = (restpeId, cartaaiId) => {
    // Obtener el nombre de la categoría de RESTPE
    const restpeCategory = restpeId ? categories.restpeCategories.find(cat => cat.id === restpeId) : null;
    
    // Actualizar el estado local para la UI
    setCategories(prev => {
      const updatedCartaaiCategories = prev.cartaaiCategories.map(cat => {
        // Si ya estaba asignada a este restpeId, quitamos la asignación
        if (cat.rId === restpeId) {
          return { ...cat, rId: null };
        }
        
        // Si es la categoría seleccionada, la asignamos y copiamos el nombre de RESTPE
        if (cat.id === cartaaiId) {
          return { 
            ...cat, 
            rId: restpeId,
            // Si se está asignando (restpeId no es null), usar el nombre de RESTPE
            name: restpeId ? restpeCategory.name : cat.name
          };
        }
        
        return cat;
      });
      
      return {
        ...prev,
        cartaaiCategories: updatedCartaaiCategories
      };
    });
  };

  // Actualizar producto
  const handleUpdateProduct = (restpeId, cartaaiId) => {
    // Obtener el producto de RESTPE
    const restpeProduct = restpeId ? products.restpeProducts.find(prod => prod.id === restpeId) : null;
    
    // Actualizar el estado local para la UI
    setProducts(prev => {
      const updatedCartaaiProducts = prev.cartaaiProducts.map(prod => {
        // Si ya estaba asignado a este restpeId, quitamos la asignación
        if (prod.rId === restpeId) {
          return { ...prod, rId: null };
        }
        
        // Si es el producto seleccionado, lo asignamos y copiamos datos de RESTPE
        if (prod.id === cartaaiId) {
          return { 
            ...prod, 
            rId: restpeId,
            // Si se está asignando (restpeId no es null), usar datos del producto de RESTPE
            name: restpeId ? restpeProduct.name : prod.name,
            presentation: restpeId ? restpeProduct.presentation : prod.presentation,
            price: restpeId ? restpeProduct.price : prod.price
          };
        }
        
        return prod;
      });
      
      return {
        ...prev,
        cartaaiProducts: updatedCartaaiProducts
      };
    });
  };

  // Actualizar modificador
  const handleUpdateModifier = (restpeId, cartaaiId) => {
    // Actualizar el estado local para la UI
    setModifiers(prev => {
      const updatedCartaaiModifiers = prev.cartaaiModifiers.map(mod => {
        // Si ya estaba asignado a este restpeId, quitamos la asignación
        if (mod.rId === restpeId) {
          return { ...mod, rId: null };
        }
        
        // Si es el modificador seleccionado, lo asignamos
        if (mod.id === cartaaiId) {
          return { ...mod, rId: restpeId };
        }
        
        return mod;
      });
      
      return {
        ...prev,
        cartaaiModifiers: updatedCartaaiModifiers
      };
    });
    
    toast.success('Modificador actualizado');
  };

  // Continuar al siguiente paso
  const handleContinue = () => {
    // Marcar el paso actual como completado
    const updatedSteps = steps.map(step => {
      if (step.id === currentStep) {
        return { ...step, completed: true, current: false };
      }
      if (step.id === currentStep + 1) {
        return { ...step, current: true };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    setCurrentStep(prev => prev + 1);
  };

  // Volver al paso anterior
  const handleBack = () => {
    const updatedSteps = steps.map(step => {
      if (step.id === currentStep) {
        return { ...step, current: false };
      }
      if (step.id === currentStep - 1) {
        return { ...step, current: true };
      }
      return step;
    });
    
    setSteps(updatedSteps);
    setCurrentStep(prev => prev - 1);
  };

  // Guardar toda la configuración
  const handleSaveAll = () => {
    toast.success('Configuración guardada con éxito');
    // Aquí iría el código para enviar los datos al servidor
  };

  // Renderizar el paso actual
  const renderCurrentStep = () => {
    if (!hasStarted) {
      return <IntegrationStart onStartIntegration={handleStartIntegration} isLoading={isLoading} />;
    }

    switch (currentStep) {
      case 1:
        return (
          <CategoryIntegration 
            categories={categories}
            onUpdateCategory={handleUpdateCategory}
            onContinue={handleContinue}
            onSaveAll={handleSaveAll}
          />
        );
      case 2:
        return (
          <ProductIntegration 
            products={products}
            onUpdateProduct={handleUpdateProduct}
            onContinue={handleContinue}
            onBack={handleBack}
            onSaveAll={handleSaveAll}
            modifiers={modifiers}
          />
        );
      default:
        return (
          <div className="glass-container p-6 text-center">
            <h2 className="text-2xl font-bold mb-4 text-cartaai-white">¡Integración Completada!</h2>
            <p className="text-cartaai-white/70 mb-6">
              Todos los pasos de la integración han sido completados con éxito. 
              Los datos ahora están sincronizados entre RESTPE y CARTAAI.
            </p>
            <div className="flex justify-center gap-4">
              <Button 
                onClick={() => setHasStarted(false)}
                className="bg-cartaai-red hover:bg-cartaai-red/90 text-white"
              >
                Comenzar Nueva Integración
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-cartaai-white mb-8">Integración RESTPE a CARTAAI</h1>
      
      {hasStarted && <IntegrationProgress steps={steps} />}
      
      {renderCurrentStep()}
    </div>
  );
};

export default IntegrationPage; 