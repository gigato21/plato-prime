import React, { useState } from 'react';
import ModifierEditModal from './ModifierEditModal';

const Step2Modifiers = ({ data, onBack, onNext, onUpdateModifier, integrationData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedModifiers, setExpandedModifiers] = useState(new Set());
  const [selectedModifier, setSelectedModifier] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [integratedModifiers, setIntegratedModifiers] = useState(new Set());
  const itemsPerPage = 10;
  console.log(data, 'data en modifiers')
  const totalPages = Math.ceil(data.restpe.modificadores.length / itemsPerPage);


  const currentData = data.restpe.modificadores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRestpeData = (id) => {
    return data.restpe.modificadores.find(mod => mod.id === id);
  };

  const getCartaaiData = (id) => {
    return data.cartaai.modificadores.find(mod => mod.id === id);
  };

  const handleEditModifier = (modifier) => {
    setSelectedModifier(modifier);
    setIsModalOpen(true);
  };

  const handleSaveModifier = (modifierData) => {
    const restpeData = getRestpeData(modifierData.rId);
    const updatedModifier = {
      id: modifierData.rId,
      name: modifierData.name,
      isMultiple: modifierData.isMultiple,
      minQuantity: modifierData.minQuantity,
      maxQuantity: modifierData.maxQuantity,
      status: restpeData?.status,
      source: restpeData?.source,
      options: modifierData.options.map(opt => ({
        id: opt.rId,
        name: opt.name,
        price: opt.price,
        stock: opt.stock,
        status: opt.status
      }))
    };
    console.log('Guardando modificador:', updatedModifier);
    onUpdateModifier(updatedModifier);
    setIsModalOpen(false);
    setSelectedModifier(null);
    setIntegratedModifiers(prev => new Set([...prev, modifierData.rId]));
  };

  const getStatusIndicator = (modifierId) => {
    if (!integratedModifiers.has(modifierId)) return null;

    return (
      <span className="ml-2 text-xs text-cartaai-green flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-cartaai-green"></span>
        Listo
      </span>
    );
  };

  const toggleExpand = (modifierId, item) => {
    console.log('=== Modificador expandido ===');
    console.log('RESTPE:', {
      modificador: {
        id: item.id,
        nombre: item.name,
        esMultiple: item.isMultiple,
        cantidadMinima: item.minQuantity,
        cantidadMaxima: item.maxQuantity,
      },
      opciones: item.options?.map(opt => ({
        id: opt.id,
        nombre: opt.name,
        precio: opt.price
      }))
    });
    console.log('CARTAAI:', {
      modificador: getCartaaiData(item.id),
      opciones: getCartaaiData(item.id)?.options
    });
    console.log('========================');

    setExpandedModifiers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modifierId)) {
        newSet.delete(modifierId);
      } else {
        newSet.add(modifierId);
      }
      return newSet;
    });
  };

  const isInPayload = (item) => {
    return integrationData.modifiers.some(mod => mod.id === item.id);
  };

  const handleRemoveFromPayload = (item) => {
    const restpeData = getRestpeData(item.id);
    const updatedModifier = {
      id: item.id,
      name: restpeData?.name,
      isMultiple: restpeData?.isMultiple,
      minQuantity: restpeData?.minQuantity,
      maxQuantity: restpeData?.maxQuantity,
      status: restpeData?.status,
      source: restpeData?.source,
      options: restpeData?.options?.map(opt => ({
        id: opt.id,
        name: opt.name,
        price: opt.price,
        stock: opt.stock,
        status: opt.status
      })) || []
    };
    console.log('Removiendo modificador del payload:', updatedModifier);
    onUpdateModifier(updatedModifier);
  };

  return (
    <div className="glass-container p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-cartaai-white">Paso 2: Modificadores</h2>
      
      <div className="overflow-x-auto mb-4">
        <table className="w-full rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="text-cartaai-white">
              <th colSpan="5" className="px-3 py-2 text-center border-r border-cartaai-white/20 bg-blue-900/50">
                RESTPE
              </th>
              <th colSpan="6" className="px-3 py-2 text-center bg-red-900/50">
                CARTAAI
              </th>
            </tr>
            <tr className="bg-cartaai-black/70 text-cartaai-white">
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Tipo</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">ID</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Nombre</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Múltiple</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Límites</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Tipo</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">ID</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Nombre</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Config</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Estado</th>
              <th className="px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="border-b border-cartaai-white/10">
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white/70">Modificador</span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white">{item.id}</span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white">{item.name}</span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white">
                      {item.isMultiple ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white">
                      Min: {item.minQuantity} / Max: {item.maxQuantity}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white/70">Modificador</span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    {getCartaaiData(item.id) ? (
                      <span className="text-xs text-cartaai-white">{getCartaaiData(item.id).id}</span>
                    ) : (
                      <span className="text-xs text-cartaai-red">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    {getCartaaiData(item.id) ? (
                      <span className="text-xs text-cartaai-white">{getCartaaiData(item.id).name}</span>
                    ) : (
                      <span className="text-xs text-cartaai-red">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    {getCartaaiData(item.id) && (
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <span className="text-xs text-cartaai-white">
                          {getCartaaiData(item.id).isMultiple ? "Múltiple" : "Simple"}
                        </span>
                        <span className="text-xs text-cartaai-white/70">
                          {getCartaaiData(item.id).minQuantity}-{getCartaaiData(item.id).maxQuantity}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    {getCartaaiData(item.id) ? (
                      <div className="flex items-center justify-center">
                        <span className="text-xs text-cartaai-green">Integrado</span>
                        {getStatusIndicator(item.id)}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleEditModifier(item)}
                          className="glass-button glass-button-sm text-xs py-1 px-2"
                        >
                          Integrar
                        </button>
                        {getStatusIndicator(item.id)}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getCartaaiData(item.id) && (
                        <div className="flex items-center">
                          <button
                            onClick={() => handleEditModifier(item)}
                            className="glass-button glass-button-sm text-xs p-1.5 w-8 h-8 flex items-center justify-center"
                            title="Editar modificador"
                          >
                            ✎
                          </button>
                          {getStatusIndicator(item.id)}
                        </div>
                      )}
                      <button
                        onClick={() => toggleExpand(item.id, item)}
                        disabled={!item.options?.length && !getCartaaiData(item.id)?.options?.length}
                        className={`glass-button glass-button-sm text-xs p-1.5 w-8 h-8 flex items-center justify-center transition-colors ${
                          (item.options?.length || getCartaaiData(item.id)?.options?.length)
                            ? 'hover:bg-cartaai-white/20' 
                            : 'opacity-50 cursor-not-allowed'
                        }`}
                        title={
                          (item.options?.length || getCartaaiData(item.id)?.options?.length)
                            ? (expandedModifiers.has(item.id) 
                                ? "Ocultar opciones" 
                                : `Mostrar opciones (RESTPE: ${item.options?.length || 0}, CARTAAI: ${getCartaaiData(item.id)?.options?.length || 0})`)
                            : "No hay opciones"
                        }
                      >
                        {(item.options?.length || getCartaaiData(item.id)?.options?.length) ? (
                          expandedModifiers.has(item.id) ? '▼' : '▶'
                        ) : '-'}
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedModifiers.has(item.id) && 
                  (() => {
                    // Obtener todas las opciones únicas por ID
                    const restpeOptions = item.options || [];
                    const cartaaiOptions = getCartaaiData(item.id)?.options || [];
                    
                    // Crear un Map para tener acceso rápido a las opciones por ID
                    const optionsMap = new Map();
                    
                    // Agregar opciones de RESTPE
                    restpeOptions.forEach(opt => {
                      optionsMap.set(opt.id, {
                        id: opt.id,
                        restpe: opt,
                        cartaai: null
                      });
                    });
                    
                    // Agregar o actualizar con opciones de CARTAAI
                    cartaaiOptions.forEach(opt => {
                      if (optionsMap.has(opt.id)) {
                        optionsMap.get(opt.id).cartaai = opt;
                      } else {
                        optionsMap.set(opt.id, {
                          id: opt.id,
                          restpe: null,
                          cartaai: opt
                        });
                      }
                    });

                    // Convertir el Map a array y renderizar
                    return Array.from(optionsMap.values()).map((opcion, oIndex) => (
                      <tr 
                        key={`${index}-${oIndex}`} 
                        className={`border-b border-cartaai-white/10 bg-cartaai-black/50 ${
                          opcion.restpe && opcion.cartaai ? 'bg-cartaai-black/70' : ''
                        }`}
                      >
                        <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                          <span className="text-xs text-cartaai-white/70">
                            {opcion.restpe ? 'Opción' : '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                          <span className="text-xs text-cartaai-white">
                            {opcion.restpe ? opcion.restpe.id : '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                          <span className="text-xs text-cartaai-white">
                            {opcion.restpe ? opcion.restpe.name : '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                          <span className="text-xs text-cartaai-white">
                            {opcion.restpe ? Number(opcion.restpe.price).toFixed(2) : '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                          <span className="text-xs text-cartaai-white">
                            {opcion.restpe ? `Stock: ${opcion.restpe.stock || '-'}` : '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                          <span className="text-xs text-cartaai-white/70">
                            {opcion.cartaai ? 'Opción' : '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                          <span className="text-xs text-cartaai-white">
                            {opcion.cartaai ? opcion.cartaai.id : '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                          <span className="text-xs text-cartaai-white">
                            {opcion.cartaai ? opcion.cartaai.name : '-'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                          {opcion.cartaai && (
                            <div className="flex flex-col items-center justify-center gap-0.5">
                              <span className="text-xs text-cartaai-white">
                                {Number(opcion.cartaai.price).toFixed(2)}
                              </span>
                              {opcion.cartaai.stock !== undefined && (
                                <span className="text-xs text-cartaai-white/70">
                                  Stock: {opcion.cartaai.stock}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center"></td>
                      </tr>
                    ));
                  })()
                }
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="glass-button glass-button-sm text-xs"
        >
          Anterior
        </button>
        <span className="text-xs text-cartaai-white">Página {currentPage} de {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="glass-button glass-button-sm text-xs"
        >
          Siguiente
        </button>
      </div>

      <div className="flex justify-between gap-3">
        <button 
          onClick={onBack}
          className="glass-button glass-button-sm text-sm py-2 flex-1"
        >
          Volver a Categorías
        </button>
        <button 
          onClick={onNext}
          className="glass-button glass-button-sm text-sm py-2 flex-1"
        >
          Continuar a Productos
        </button>
      </div>

      <ModifierEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedModifier(null);
        }}
        modifier={selectedModifier}
        onSave={handleSaveModifier}
        restpeData={selectedModifier ? getRestpeData(selectedModifier.id) : null}
      />
    </div>
  );
};

export default Step2Modifiers; 