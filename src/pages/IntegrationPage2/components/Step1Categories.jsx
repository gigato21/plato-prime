import React, { useState } from 'react';

const Step1Categories = ({ data, onNext, onUpdateCategory, integrationData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingName, setEditingName] = useState(null);
  const [editedNames, setEditedNames] = useState({});
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.restpe.categorias.length / itemsPerPage);

  const currentData = data.restpe.categorias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRestpeData = (id) => {
    return data.restpe.categorias.find(cat => cat.id === id);
  };

  const getCartaaiData = (id) => {
    return data.cartaai.categorias.find(cat => cat.id === id);
  };

  const handleNameEdit = (item, newName) => {
    const restpeData = getRestpeData(item.id);
    const cartaaiData = getCartaaiData(item.id);
    
    if (newName === (cartaaiData?.name || restpeData?.name)) {
      // Si el nombre es igual al original, lo quitamos del estado
      const newEditedNames = { ...editedNames };
      delete newEditedNames[item.id];
      setEditedNames(newEditedNames);
      
      // También lo quitamos del payload si no está pendiente de integración
      if (cartaaiData) {
        const updatedCategory = {
          id: item.id,
          name: newName,
          status: restpeData?.status,
          source: restpeData?.source
        };
        console.log('Removiendo categoría del payload:', updatedCategory);
        onUpdateCategory(updatedCategory);
      }
      return;
    }

    setEditedNames(prev => ({
      ...prev,
      [item.id]: newName
    }));
    
    // Si el item ya está integrado y se cambió el nombre, agregarlo al payload
    if (cartaaiData) {
      const updatedCategory = {
        id: item.id,
        name: newName,
        status: restpeData?.status,
        source: restpeData?.source
      };
      console.log('Actualizando categoría en el payload:', updatedCategory);
      onUpdateCategory(updatedCategory);
    }
  };

  const handleIntegrate = (item) => {
    const restpeData = getRestpeData(item.id);
    const updatedCategory = {
      id: item.id,
      name: editedNames[item.id] || restpeData?.name,
      status: restpeData?.status,
      source: restpeData?.source
    };
    console.log('Integrando nueva categoría:', updatedCategory);
    onUpdateCategory(updatedCategory);
  };

  const handleRemoveFromPayload = (item) => {
    const restpeData = getRestpeData(item.id);
    const updatedCategory = {
      id: item.id,
      name: restpeData?.name,
      status: restpeData?.status,
      source: restpeData?.source
    };
    console.log('Removiendo categoría del payload:', updatedCategory);
    onUpdateCategory(updatedCategory);

    // Si se estaba editando el nombre, también lo quitamos
    if (editedNames[item.id]) {
      const newEditedNames = { ...editedNames };
      delete newEditedNames[item.id];
      setEditedNames(newEditedNames);
    }
  };

  const isInPayload = (item) => {
    return integrationData.categories.some(cat => cat.id === item.id);
  };

  const handleResetName = (item) => {
    const newEditedNames = { ...editedNames };
    delete newEditedNames[item.id];
    setEditedNames(newEditedNames);

    // Si no está pendiente de integración, lo quitamos del payload
    if (getCartaaiData(item.id)) {
      handleRemoveFromPayload(item);
    }
  };

  return (
    <div className="glass-container p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-cartaai-white">Paso 1: Categorías</h2>
      
      <div className="overflow-x-auto mb-4">
        <table className="w-full rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="text-cartaai-white">
              <th colSpan="3" className="px-3 py-2 text-center border-r border-cartaai-white/20 bg-blue-900/50">
                RESTPE
              </th>
              <th colSpan="4" className="px-3 py-2 text-center bg-red-900/50">
                CARTAAI
              </th>
            </tr>
            <tr className="bg-cartaai-black/70 text-cartaai-white">
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Tipo</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">ID</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Nombre</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Tipo</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">ID</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Nombre</th>
              <th className="px-3 py-2 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => {
              const restpeData = getRestpeData(item.id);
              const cartaaiData = getCartaaiData(item.id);
              
              return (
                <tr key={index} className="border-b border-cartaai-white/10">
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white/70">Categoría</span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white">{item.id}</span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white">{restpeData?.name}</span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    <span className="text-xs text-cartaai-white/70">Categoría</span>
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    {cartaaiData ? (
                      <span className="text-xs text-cartaai-white">{cartaaiData.id}</span>
                    ) : (
                      <span className="text-xs text-cartaai-red">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                    {editingName === item.id ? (
                      <input
                        type="text"
                        className="glass-input bg-cartaai-black/50 border border-cartaai-white/20 rounded px-2 py-1 text-xs text-cartaai-white w-full"
                        defaultValue={editedNames[item.id] || (cartaaiData ? cartaaiData.name : restpeData?.name)}
                        onBlur={(e) => {
                          handleNameEdit(item, e.target.value);
                          setEditingName(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNameEdit(item, e.target.value);
                            setEditingName(null);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <div 
                          className="flex items-center gap-2 cursor-pointer group"
                          onClick={() => setEditingName(item.id)}
                        >
                          <span className="text-xs text-cartaai-white group-hover:text-cartaai-white/80">
                            {editedNames[item.id] || (cartaaiData ? cartaaiData.name : restpeData?.name)}
                          </span>
                          <span className="text-xs text-cartaai-white/50 group-hover:text-cartaai-white">✎</span>
                        </div>
                        {editedNames[item.id] && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-yellow-500">(nuevo)</span>
                            <button
                              onClick={() => handleResetName(item)}
                              className="text-xs text-cartaai-red hover:text-cartaai-red/80 ml-1"
                              title="Restablecer nombre"
                            >
                              ↺
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {cartaaiData ? (
                      isInPayload(item) ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs text-yellow-500">Pendiente</span>
                          <button
                            onClick={() => handleRemoveFromPayload(item)}
                            className="text-xs text-cartaai-red hover:text-cartaai-red/80"
                            title="Cancelar cambios"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-green-500">Integrado</span>
                      )
                    ) : (
                      isInPayload(item) ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs text-yellow-500">Listo</span>
                          <button
                            onClick={() => handleRemoveFromPayload(item)}
                            className="text-xs text-cartaai-red hover:text-cartaai-red/80"
                            title="Cancelar integración"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleIntegrate(item)}
                          className="glass-button glass-button-sm text-xs px-3 py-1"
                        >
                          Integrar
                        </button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
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

      <button 
        onClick={() => onNext()}
        className="glass-button glass-button-sm w-full text-sm py-2"
      >
        Continuar a Modificadores
      </button>
    </div>
  );
};

export default Step1Categories; 