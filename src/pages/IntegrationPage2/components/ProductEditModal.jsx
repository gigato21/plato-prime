import React, { useState, useEffect } from 'react';

const ProductEditModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onSave,
  restpeData 
}) => {
  const [productData, setProductData] = useState({
    id: '',
    name: '',
    description: '',
    categoryId: '',
    isCombo: false,
    isOutOfStock: false,
    basePrice: 0,
    imageUrl: '',
    presentations: [],
    modifiers: [],
    status: 1
  });

  useEffect(() => {
    if (product) {
      console.log('=== Inicializando modal de producto ===');
      console.log('Producto recibido:', product);

      // Obtener los datos de RESTPE
      const restpeData = product;
      // Obtener los datos de CARTAAI si existen
      const cartaaiData = getCartaaiData(product.id);
      
      console.log('Datos encontrados:');
      console.log('RESTPE:', restpeData);
      console.log('CARTAAI:', cartaaiData);

      const newProductData = {
        id: restpeData.id,
        name: cartaaiData?.name || restpeData.name,
        description: cartaaiData?.description || restpeData.description || '',
        categoryId: restpeData.categoryId,
        isCombo: cartaaiData?.isCombo || false,
        isOutOfStock: cartaaiData?.isOutOfStock || false,
        basePrice: cartaaiData?.basePrice || (restpeData.presentations?.[0]?.price || 0),
        imageUrl: cartaaiData?.imageUrl || restpeData.imageUrl || '',
        presentations: restpeData.presentations?.map(pres => ({
          id: pres.id,
          name: cartaaiData?.presentations?.find(p => p.id === pres.id)?.name || pres.name,
          price: parseFloat(cartaaiData?.presentations?.find(p => p.id === pres.id)?.price || pres.price),
          isAvailableForDelivery: cartaaiData?.presentations?.find(p => p.id === pres.id)?.isAvailableForDelivery ?? true,
          stock: parseInt(cartaaiData?.presentations?.find(p => p.id === pres.id)?.stock || pres.stock || 0),
          status: cartaaiData?.presentations?.find(p => p.id === pres.id)?.status ?? 1,
          isIntegrated: cartaaiData?.presentations?.some(p => p.id === pres.id) || false
        })) || [],
        modifiers: restpeData.modifiers || [],
        status: cartaaiData?.status ?? 1
      };

      console.log('Datos iniciales del formulario:', newProductData);
      console.log('================================');

      setProductData(newProductData);
    }
  }, [product]);

  const getCartaaiData = (id) => {
    return product?.cartaai?.productos?.find(prod => prod.id === id);
  };

  const handleProductChange = (field, value) => {
    console.log(`Campo '${field}' modificado:`, value);
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresentationChange = (index, field, value) => {
    console.log(`Presentación ${index}, campo '${field}' modificado:`, value);
    setProductData(prev => ({
      ...prev,
      presentations: prev.presentations.map((pres, i) => 
        i === index ? { ...pres, [field]: value } : pres
      )
    }));
  };

  const togglePresentationIntegration = (index) => {
    console.log(`Toggling integración de presentación ${index}`);
    setProductData(prev => {
      const newPresentations = prev.presentations.map((pres, i) => 
        i === index ? { ...pres, isIntegrated: !pres.isIntegrated } : pres
      );
      console.log('Estado actualizado de presentaciones:', newPresentations);
      return {
        ...prev,
        presentations: newPresentations
      };
    });
  };

  const handleModifierChange = (modifierId, optionId, field, value) => {
    setProductData(prev => ({
      ...prev,
      modifiers: prev.modifiers.map(mod => {
        if (mod.modifierId === modifierId) {
          return {
            ...mod,
            customizedOptions: mod.customizedOptions.map(opt => {
              if (opt.optionId === optionId) {
                return { ...opt, [field]: value };
              }
              return opt;
            })
          };
        }
        return mod;
      })
    }));
  };

  const toggleModifierIntegration = (modifierId) => {
    setProductData(prev => ({
      ...prev,
      modifiers: prev.modifiers.map(mod => {
        if (mod.modifierId === modifierId) {
          return {
            ...mod,
            isIntegrated: !mod.isIntegrated
          };
        }
        return mod;
      })
    }));
  };

  const handleSave = () => {
    console.log('=== Preparando datos para guardar ===');
    console.log('Estado actual:', productData);

    // Filtrar solo las presentaciones que están marcadas para integrar
    const integratedPresentations = productData.presentations
      .filter(pres => pres.isIntegrated)
      .map(({ isIntegrated, ...pres }) => ({
        ...pres,
        isAvailableForDelivery: true,
        status: 1
      }));

    console.log('Presentaciones filtradas:', integratedPresentations);

    const productToSave = {
      ...productData,
      presentations: integratedPresentations,
      source: 'restpe'
    };

    console.log('Datos finales a guardar:', productToSave);
    console.log('===============================');

    onSave(productToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-[9999]">
      <div className="glass-container p-6 rounded-lg shadow-lg w-full max-w-4xl h-[80vh] overflow-y-auto mb-10 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-cartaai-white">
            {product?.id ? 'Editar' : 'Integrar'} Producto
          </h2>
          <button
            onClick={onClose}
            className="text-cartaai-white/70 hover:text-cartaai-white"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Columna izquierda: Datos de Restpe */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-cartaai-white border-b border-cartaai-white/20 pb-2">
              Datos de Restpe
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                  Nombre
                </label>
                <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                  {restpeData?.name || 'No disponible'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                  Descripción
                </label>
                <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                  {restpeData?.description || 'No disponible'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                    Es Combo
                  </label>
                  <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                    {restpeData?.isCombo ? 'Sí' : 'No'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                    Sin Stock
                  </label>
                  <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                    {restpeData?.isOutOfStock ? 'Sí' : 'No'}
                  </div>
                </div>
              </div>
            </div>

            {/* Presentaciones de Restpe */}
            <div>
              <h3 className="text-lg font-medium text-cartaai-white border-b border-cartaai-white/20 pb-2 mb-2">
                Presentaciones
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cartaai-black/70 text-cartaai-white">
                      <th className="px-3 py-2 text-left">Nombre</th>
                      <th className="px-3 py-2 text-left">Precio</th>
                      <th className="px-3 py-2 text-left">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restpeData?.presentations?.map((presentation, index) => (
                      <tr key={index} className="border-b border-cartaai-white/10">
                        <td className="px-3 py-2 text-cartaai-white">{presentation.name}</td>
                        <td className="px-3 py-2 text-cartaai-white">{presentation.price}</td>
                        <td className="px-3 py-2 text-cartaai-white">{presentation.stock}</td>
                      </tr>
                    ))}
                    {(!restpeData?.presentations || restpeData.presentations.length === 0) && (
                      <tr>
                        <td colSpan="3" className="px-3 py-4 text-center text-cartaai-white/50">
                          No hay presentaciones disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modificadores de Restpe */}
            {restpeData?.modifiers && restpeData.modifiers.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-cartaai-white border-b border-cartaai-white/20 pb-2 mb-2">
                  Modificadores
                </h3>
                <div className="space-y-4">
                  {restpeData.modifiers.map((modifier) => (
                    <div key={modifier.modifierId} className="glass-container p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-cartaai-white font-medium">
                          {modifier.name}
                        </h4>
                        <span className="text-xs text-cartaai-white/70">
                          {modifier.isMultiple ? 'Múltiple' : 'Único'}
                        </span>
                      </div>
                      <div className="text-xs text-cartaai-white/70 mb-2">
                        Cantidad: {modifier.minQuantity} - {modifier.maxQuantity}
                      </div>
                      <div className="space-y-2">
                        {modifier.options.map((option) => (
                          <div key={option.id} className="flex justify-between items-center text-sm">
                            <span className="text-cartaai-white">{option.name}</span>
                            <span className="text-cartaai-white">S/ {option.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha: Formulario de Cartaai */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-cartaai-white border-b border-cartaai-white/20 pb-2">
              Datos de Cartaai
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-cartaai-white mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => handleProductChange('name', e.target.value)}
                  className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cartaai-white mb-1">
                  Descripción
                </label>
                <textarea
                  value={productData.description}
                  onChange={(e) => handleProductChange('description', e.target.value)}
                  className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCombo"
                    checked={productData.isCombo}
                    onChange={(e) => handleProductChange('isCombo', e.target.checked)}
                    className="rounded border-cartaai-white/20"
                  />
                  <label 
                    htmlFor="isCombo" 
                    className="text-sm text-cartaai-white"
                  >
                    Es Combo
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isOutOfStock"
                    checked={productData.isOutOfStock}
                    onChange={(e) => handleProductChange('isOutOfStock', e.target.checked)}
                    className="rounded border-cartaai-white/20"
                  />
                  <label 
                    htmlFor="isOutOfStock" 
                    className="text-sm text-cartaai-white"
                  >
                    Sin Stock
                  </label>
                </div>
              </div>
            </div>

            {/* Presentaciones de Cartaai */}
            <div>
              <h3 className="text-lg font-medium text-cartaai-white border-b border-cartaai-white/20 pb-2 mb-2">
                Presentaciones
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cartaai-black/70 text-cartaai-white">
                      <th className="px-3 py-2 text-left">Nombre</th>
                      <th className="px-3 py-2 text-left">Precio</th>
                      <th className="px-3 py-2 text-left">Stock</th>
                      <th className="px-3 py-2 text-left">Integrar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.presentations.map((presentation, index) => (
                      <tr key={presentation.id} className="border-b border-cartaai-white/10">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={presentation.name}
                            onChange={(e) => handlePresentationChange(index, 'name', e.target.value)}
                            className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={presentation.price}
                            onChange={(e) => handlePresentationChange(index, 'price', parseFloat(e.target.value))}
                            className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-2 py-1"
                            step="0.01"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={presentation.stock}
                            onChange={(e) => handlePresentationChange(index, 'stock', parseInt(e.target.value))}
                            className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={presentation.isIntegrated}
                              onChange={() => togglePresentationIntegration(index)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-cartaai-black/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-cartaai-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cartaai-green"></div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modificadores de Cartaai */}
            {productData.modifiers && productData.modifiers.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-cartaai-white border-b border-cartaai-white/20 pb-2 mb-2">
                  Modificadores
                </h3>
                <div className="space-y-4">
                  {productData.modifiers.map((modifier) => (
                    <div key={modifier.modifierId} className="glass-container p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={modifier.isIntegrated}
                              onChange={() => toggleModifierIntegration(modifier.modifierId)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-cartaai-black/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-cartaai-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cartaai-green"></div>
                          </label>
                          <h4 className="text-cartaai-white font-medium">
                            {modifier.name}
                          </h4>
                        </div>
                        <span className="text-xs text-cartaai-white/70">
                          {modifier.isMultiple ? 'Múltiple' : 'Único'}
                        </span>
                      </div>
                      <div className="text-xs text-cartaai-white/70 mb-2">
                        Cantidad: {modifier.minQuantity} - {modifier.maxQuantity}
                      </div>
                      <div className="space-y-2">
                        {modifier.customizedOptions.map((option) => (
                          <div key={option.optionId} className="flex justify-between items-center text-sm">
                            <span className="text-cartaai-white">{option.name}</span>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={option.price}
                                onChange={(e) => handleModifierChange(modifier.modifierId, option.optionId, 'price', parseFloat(e.target.value))}
                                className="w-20 glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-2 py-1"
                                step="0.01"
                              />
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={option.isAvailable}
                                  onChange={(e) => handleModifierChange(modifier.modifierId, option.optionId, 'isAvailable', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-cartaai-black/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-cartaai-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cartaai-green"></div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-cartaai-white/10">
          <button
            onClick={onClose}
            className="glass-button glass-button-sm text-sm py-2 px-4"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="glass-button glass-button-sm text-sm py-2 px-4 bg-cartaai-green/20 hover:bg-cartaai-green/30"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal; 