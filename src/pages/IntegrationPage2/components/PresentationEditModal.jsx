import React, { useState, useEffect } from 'react';

const PresentationEditModal = ({ 
  isOpen, 
  onClose, 
  presentation, 
  onSave,
  restpeData 
}) => {
  const [presentationData, setPresentationData] = useState({
    id: '',
    name: '',
    price: 0,
    stock: 0,
    status: 1
  });

  useEffect(() => {
    if (presentation) {
      console.log('=== Inicializando modal de presentación ===');
      console.log('Presentación recibida:', presentation);

      const newPresentationData = {
        id: presentation.id,
        name: presentation.name,
        price: parseFloat(presentation.price),
        stock: parseInt(presentation.stock || 0),
        status: 1
      };

      console.log('Datos iniciales del formulario:', newPresentationData);
      setPresentationData(newPresentationData);
    }
  }, [presentation]);

  const handlePresentationChange = (field, value) => {
    console.log(`Campo '${field}' modificado:`, value);
    setPresentationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('=== Preparando datos para guardar ===');
    console.log('Estado actual:', presentationData);

    const presentationToSave = {
      ...presentationData,
      isAvailableForDelivery: true,
      status: 1
    };

    // Crear el payload del producto padre con la presentación
    const productToSave = {
      ...restpeData,
      presentations: [presentationToSave],
      source: 'restpe'
    };

    console.log('Datos finales a guardar:', productToSave);
    console.log('===============================');

    onSave(productToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-[9999]">
      <div className="glass-container p-6 rounded-lg shadow-lg w-full max-w-2xl h-[80vh] overflow-y-auto mb-10 my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-cartaai-white">
            Integrar Presentación
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
                  ID
                </label>
                <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                  {presentation?.id || 'No disponible'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                  Nombre
                </label>
                <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                  {presentation?.name || 'No disponible'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                  Precio
                </label>
                <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                  {presentation?.price ? `S/ ${parseFloat(presentation.price).toFixed(2)}` : 'No disponible'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cartaai-white/70 mb-1">
                  Stock
                </label>
                <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                  {presentation?.stock || 'No disponible'}
                </div>
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
                  ID
                </label>
                <div className="glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2">
                  {presentation?.id || 'No disponible'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cartaai-white mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={presentationData.name}
                  onChange={(e) => handlePresentationChange('name', e.target.value)}
                  className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2"
                  placeholder="Nombre de la presentación"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cartaai-white mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  value={presentationData.price}
                  onChange={(e) => handlePresentationChange('price', parseFloat(e.target.value))}
                  className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cartaai-white mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={presentationData.stock}
                  onChange={(e) => handlePresentationChange('stock', parseInt(e.target.value))}
                  className="w-full glass-input bg-cartaai-black/50 text-cartaai-white border border-cartaai-white/20 rounded px-3 py-2"
                  min="-1"
                />
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
            className="glass-button glass-button-sm text-sm py-2 px-4 bg-cartaai-green/20 hover:bg-cartaai-green/30"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationEditModal; 