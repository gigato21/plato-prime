import React, { useState } from 'react';
import PresentationEditModal from './PresentationEditModal';

const Step3Products = ({ data, onBack, onUpdateProduct, integrationData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [integratedPresentations, setIntegratedPresentations] = useState(new Set());
  const itemsPerPage = 10;

  // Obtener todas las presentaciones de todos los productos
  const allPresentations = data.restpe.productos.flatMap(product => 
    product.presentations?.map(presentation => ({
      ...presentation,
      productId: product.id,
      productName: product.name,
      product: product // Guardar referencia al producto padre
    })) || []
  );

  const totalPages = Math.ceil(allPresentations.length / itemsPerPage);

  const currentData = allPresentations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCartaaiData = (id) => {
    return data.cartaai.productos.find(prod => prod.id === id);
  };

  const handleEditPresentation = (presentation) => {
    console.log('=== Editando presentación ===');
    console.log('Presentación:', presentation);
    console.log('Producto padre:', presentation.product);
    setSelectedPresentation(presentation);
    setIsModalOpen(true);
  };

  const handleSavePresentation = (productData) => {
    console.log('=== Guardando presentación ===');
    console.log('Datos del producto:', productData);
    console.log('========================');

    onUpdateProduct(productData);
    setIsModalOpen(false);
    setSelectedPresentation(null);

    // Marcar la presentación como integrada
    setIntegratedPresentations(prev => new Set([...prev, productData.presentations[0].id]));
  };

  const getStatusIndicator = (presentationId) => {
    if (!integratedPresentations.has(presentationId)) return null;
    return (
      <span className="ml-2 text-xs text-cartaai-green flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-cartaai-green"></span>
        Integrado
      </span>
    );
  };

  return (
    <div className="glass-container p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-cartaai-white">Paso 3: Productos</h2>
      
      <div className="overflow-x-auto mb-4">
        <table className="w-full rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="text-cartaai-white">
              <th colSpan="4" className="px-3 py-2 text-center border-r border-cartaai-white/20 bg-blue-900/50">
                RESTPE
              </th>
              <th colSpan="4" className="px-3 py-2 text-center bg-red-900/50">
                CARTAAI
              </th>
            </tr>
            <tr className="bg-cartaai-black/70 text-cartaai-white">
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">ID</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Nombre</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Precio</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Producto Padre</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">ID</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Nombre</th>
              <th className="px-3 py-2 text-center border-r border-cartaai-white/20">Estado</th>
              <th className="px-3 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((presentation, index) => (
              <tr key={presentation.id} className="bg-blue-500/10 border-b border-cartaai-white/10">
                <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                  <span className="text-xs text-cartaai-white">{presentation.id}</span>
                </td>
                <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                  <span className="text-xs text-cartaai-white">{presentation.name}</span>
                </td>
                <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                  <span className="text-xs text-cartaai-white">
                    S/ {parseFloat(presentation.price).toFixed(2)}
                  </span>
                </td>
                <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                  <span className="text-xs text-cartaai-white">{presentation.productName}</span>
                </td>
                <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                  {getCartaaiData(presentation.productId)?.presentations?.find(p => p.id === presentation.id) ? (
                    <span className="text-xs text-cartaai-white">
                      {getCartaaiData(presentation.productId).presentations.find(p => p.id === presentation.id).id}
                    </span>
                  ) : (
                    <span className="text-xs text-cartaai-red">-</span>
                  )}
                </td>
                <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                  {getCartaaiData(presentation.productId)?.presentations?.find(p => p.id === presentation.id) ? (
                    <span className="text-xs text-cartaai-white">
                      {getCartaaiData(presentation.productId).presentations.find(p => p.id === presentation.id).name}
                    </span>
                  ) : (
                    <span className="text-xs text-cartaai-red">-</span>
                  )}
                </td>
                <td className="px-3 py-2 text-center border-r border-cartaai-white/20">
                  {getCartaaiData(presentation.productId)?.presentations?.find(p => p.id === presentation.id) ? (
                    <span className="text-xs text-cartaai-green">Integrado</span>
                  ) : (
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleEditPresentation(presentation)}
                        className="glass-button glass-button-sm text-xs py-1 px-2"
                      >
                        Integrar
                      </button>
                      {getStatusIndicator(presentation.id)}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  {getCartaaiData(presentation.productId)?.presentations?.find(p => p.id === presentation.id) && (
                    <div className="flex items-center">
                      <button
                        onClick={() => handleEditPresentation(presentation)}
                        className="glass-button glass-button-sm text-xs p-1.5 w-8 h-8 flex items-center justify-center"
                        title="Editar presentación"
                      >
                        ✎
                      </button>
                      {getStatusIndicator(presentation.id)}
                    </div>
                  )}
                </td>
              </tr>
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
          Volver a Modificadores
        </button>
      </div>

      <PresentationEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPresentation(null);
        }}
        presentation={selectedPresentation}
        onSave={handleSavePresentation}
        restpeData={selectedPresentation?.product}
      />
    </div>
  );
};

export default Step3Products; 