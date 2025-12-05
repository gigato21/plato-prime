import React, { useState, useEffect } from 'react';

const ModifierEditModal = ({ 
  isOpen, 
  onClose, 
  modifier, 
  onSave,
  restpeData 
}) => {
  const [modifierData, setModifierData] = useState({
    rId: '',
    name: '',
    isMultiple: false,
    minQuantity: 0,
    maxQuantity: 0,
    options: []
  });

  useEffect(() => {
    if (modifier) {
      console.log('Datos del modificador:', modifier);
      
      setModifierData({
        rId: modifier.id,
        name: modifier.name,
        isMultiple: modifier.isMultiple,
        minQuantity: modifier.minQuantity,
        maxQuantity: modifier.maxQuantity,
        options: modifier.options.map(opt => ({
          rId: opt.id,
          name: opt.name,
          price: opt.price,
          stock: opt.stock,
          status: opt.status || 'active'
        }))
      });
    }
  }, [modifier]);

  const handleModifierChange = (field, value) => {
    console.log('🔄 Modificando campo:', field, 'Valor:', value);
    setModifierData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log('📝 Nuevo estado del modificador:', newData);
      return newData;
    });
  };

  const handleOptionChange = (index, field, value) => {
    console.log('🔄 Modificando opción:', index, 'Campo:', field, 'Valor:', value);
    setModifierData(prev => {
      const newData = {
        ...prev,
        options: prev.options.map((opt, i) => {
          if (i === index) {
            const updatedOption = { ...opt, [field]: value };
            console.log('📝 Opción actualizada:', updatedOption);
            return updatedOption;
          }
          return opt;
        })
      };
      console.log('📝 Nuevo estado del modificador con opciones:', newData);
      return newData;
    });
  };

  const handleAddOption = () => {
    console.log('➕ Agregando nueva opción');
    setModifierData(prev => {
      const newOption = {
        rId: `new-${Date.now()}`,
        name: '',
        price: 0,
        stock: 0,
        status: 'active'
      };
      console.log('📝 Nueva opción:', newOption);
      const newData = {
        ...prev,
        options: [...prev.options, newOption]
      };
      console.log('📝 Nuevo estado del modificador con nueva opción:', newData);
      return newData;
    });
  };

  const handleRemoveOption = (index) => {
    console.log('❌ Eliminando opción en índice:', index);
    setModifierData(prev => {
      const newData = {
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      };
      console.log('📝 Nuevo estado del modificador después de eliminar:', newData);
      return newData;
    });
  };

  const handleSave = () => {
    console.log('💾 Guardando modificador...');
    console.log('📦 Payload final:', modifierData);
    onSave(modifierData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-[9999]">
      <div className="glass-container p-6 rounded-lg shadow-lg w-full max-w-4xl h-[80vh] overflow-y-auto mb-10 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-cartaai-white">
            {modifier?.id ? 'Editar' : 'Integrar'} Modificador
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
                  ID Restpe
                </label>
                <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                  {restpeData?.id || 'No disponible'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                  Nombre
                </label>
                <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                  {restpeData?.name || 'No disponible'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                    Selección Múltiple
                  </label>
                  <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                    {restpeData?.isMultiple ? 'Sí' : 'No'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                    Cantidad Mínima
                  </label>
                  <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                    {restpeData?.minQuantity || 0}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                    Cantidad Máxima
                  </label>
                  <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                    {restpeData?.maxQuantity || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Opciones de Restpe */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-cartaai-white border-b border-cartaai-white/20 pb-2">
                  Opciones
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cartaai-black/70 text-cartaai-white">
                      <th className="px-3 py-2 text-left">ID Restpe</th>
                      <th className="px-3 py-2 text-left">Nombre</th>
                      <th className="px-3 py-2 text-left">Precio</th>
                      <th className="px-3 py-2 text-left">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restpeData?.options?.map((option, index) => (
                      <tr key={index} className="border-b border-cartaai-white/10">
                        <td className="px-3 py-2 text-cartaai-white">{option.id}</td>
                        <td className="px-3 py-2 text-cartaai-white">{option.name}</td>
                        <td className="px-3 py-2 text-cartaai-white">{option.price}</td>
                        <td className="px-3 py-2 text-cartaai-white">{option.stock}</td>
                      </tr>
                    ))}
                    {(!restpeData?.options || restpeData.options.length === 0) && (
                      <tr>
                        <td colSpan="4" className="px-3 py-4 text-center text-cartaai-white/50">
                          No hay opciones disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
                  value={modifierData.name}
                  onChange={(e) => handleModifierChange('name', e.target.value)}
                  className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2"
                  placeholder="Nombre del modificador"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isMultiple"
                    checked={modifierData.isMultiple}
                    onChange={(e) => handleModifierChange('isMultiple', e.target.checked)}
                    className="rounded border-cartaai-white/20"
                  />
                  <label 
                    htmlFor="isMultiple" 
                    className="text-sm text-cartaai-white"
                  >
                    Selección Múltiple
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cartaai-white mb-1">
                    Cantidad Mínima
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={modifierData.minQuantity}
                    onChange={(e) => handleModifierChange('minQuantity', parseInt(e.target.value))}
                    className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cartaai-white mb-1">
                    Cantidad Máxima
                  </label>
                  <input
                    type="number"
                    min={modifierData.minQuantity}
                    value={modifierData.maxQuantity}
                    onChange={(e) => handleModifierChange('maxQuantity', parseInt(e.target.value))}
                    className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

            {/* Opciones de Cartaai */}
            <div style={{ paddingTop: '140px' }}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-cartaai-white border-b border-cartaai-white/20 pb-2">
                  Opciones
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cartaai-black/70 text-cartaai-white">
                      <th className="px-3 py-2 text-left">ID</th>
                      <th className="px-3 py-2 text-left">Nombre</th>
                      <th className="px-3 py-2 text-left">Precio</th>
                      <th className="px-3 py-2 text-left">Stock</th>
                      <th className="px-3 py-2 text-left">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modifierData.options.map((option, index) => (
                      <tr key={option.rId} className="border-b border-cartaai-white/10">
                        <td className="px-3 py-2">
                          <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-2 py-1">
                            {option.rId}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                            className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-2 py-1"
                            placeholder="Nombre de la opción"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={option.price}
                            onChange={(e) => handleOptionChange(index, 'price', parseFloat(e.target.value))}
                            className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-2 py-1"
                            step="0.01"
                            min="0"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={option.stock}
                            onChange={(e) => handleOptionChange(index, 'stock', parseInt(e.target.value))}
                            className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-2 py-1"
                            min="-1"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => handleRemoveOption(index)}
                            className="text-cartaai-red hover:text-cartaai-red/80 flex items-center gap-1"
                            title="Eliminar opción"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    {modifierData.options.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-3 py-4 text-center text-cartaai-white/50">
                          No hay opciones disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
            className="glass-button glass-button-sm text-sm py-2 px-4"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifierEditModal; 