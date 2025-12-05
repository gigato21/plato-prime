import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash, Save, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Plus, TagIcon, ChevronRight as NextIcon, ChevronLeft as PrevIcon } from 'lucide-react';
import { toast } from "sonner";

const ProductIntegration = ({ 
  products, 
  onUpdateProduct,
  onContinue,
  onBack,
  onSaveAll,
  modifiers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('Todos');
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [expandedSection, setExpandedSection] = useState('presentations');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { restpeProducts, cartaaiProducts } = products;
  const { restpeModifiers, cartaaiModifiers } = modifiers || { restpeModifiers: [], cartaaiModifiers: [] };

  // Transformar los modificadores al formato esperado por el componente
  const selectedModifiers = cartaaiModifiers.map(mod => {
    // Buscar el modificador correspondiente en RESTPE
    const restpeMod = restpeModifiers.find(rm => rm.rId === mod.rId);
    
    return {
      id: mod.rId,
      name: mod.name,
      price: mod.price,
      active: true,
      group: mod.group,
      options: mod.options || [],
      restpeModifier: restpeMod // Mantener referencia al modificador de RESTPE
    };
  });

  const modifiersByGroup = selectedModifiers.reduce((groups, modifier) => {
    const groupName = modifier.group || 'Sin grupo';
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(modifier);
    return groups;
  }, {});

  const mappedProducts = restpeProducts.map(restpe => {
    const mappedCartaai = cartaaiProducts.find(cartaai => 
      cartaai.rId === restpe.id
    );
    
    const otherProductsWithSameName = restpeProducts.filter(
      p => p.name === restpe.name && p.id !== restpe.id
    );
    
    const hasPresentations = otherProductsWithSameName.length > 0;
    
    const isMainProduct = hasPresentations ? 
      restpe.id === Math.min(...[restpe.id, ...otherProductsWithSameName.map(p => p.id)]) : 
      true;
    
    // Obtener los modificadores asignados al producto
    const assignedModifiers = [];
    if (mappedCartaai && mappedCartaai.modifiers) {
      mappedCartaai.modifiers.forEach(mod => {
        // Verificar si el modificador existe en RESTPE
        const restpeMod = restpeModifiers.find(rm => rm.rId === mod.modifierId);
        if (restpeMod) {
          // Verificar si todas las opciones están disponibles
          const allOptionsAvailable = mod.customizedOptions.every(opt => 
            restpeMod.options.some(ro => ro.rId === opt.optionId)
          );
          if (allOptionsAvailable) {
            assignedModifiers.push(mod.modifierId);
          }
        }
      });
    }
    
    return {
      tipo: 'PRODUCTO',
      restpe,
      cartaai: mappedCartaai || null,
      status: mappedCartaai ? 'OK' : 'Pendiente',
      includeInCartaai: mappedCartaai !== null,
      isMainProduct,
      assignedModifiers,
      presentations: isMainProduct && hasPresentations ? 
        [...otherProductsWithSameName].sort((a, b) => a.id - b.id) : 
        null
    };
  }).filter(product => product.isMainProduct);

  const filteredProducts = mappedProducts.filter(product => {
    const matchesSearch = 
      product.restpe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.restpe.presentation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.cartaai && product.cartaai.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterOption === 'Todos') return matchesSearch;
    if (filterOption === 'OK') return matchesSearch && product.status === 'OK';
    if (filterOption === 'Pendiente') return matchesSearch && product.status === 'Pendiente';
    
    return matchesSearch;
  });
  
  // Cálculos para la paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  
  // Cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedProductId(null); // Cerrar producto expandido al cambiar de página
  };
  
  // Ir a la página anterior
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setExpandedProductId(null); // Cerrar producto expandido al cambiar de página
    }
  };
  
  // Ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setExpandedProductId(null); // Cerrar producto expandido al cambiar de página
    }
  };

  const handleToggleProduct = (restpeId, checked) => {
    // Buscar el producto de RESTPE
    const restpeProduct = restpeProducts.find(prod => prod.id === restpeId);
    
    // Buscar si ya está mapeado en CARTAAI
    const existingMapping = cartaaiProducts.find(prod => prod.rId === restpeId);
    
    // Si el producto ya está integrado (tiene un rId asignado desde CARTAAI)
    // no permitimos desmarcarlo, solo marcamos nuevos
    if (existingMapping && !checked) {
      toast.info('Los productos ya integrados no pueden desmarcarse');
      return;
    }
    
    if (checked) {
      const availableProduct = cartaaiProducts.find(product => !product.rId);

      if (availableProduct) {
        onUpdateProduct(restpeId, availableProduct.id);
      }
    } else {
      // Eliminar la asociación solo si no estaba previamente integrado
      onUpdateProduct(restpeId, null);
    }
  };

  const toggleExpandProduct = (productId) => {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
    } else {
      setExpandedProductId(productId);
      setExpandedSection('presentations');
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(section);
  };

  const handleToggleModifierForProduct = (productId, modifierId, checked) => {
    console.log('Toggle modifier:', { productId, modifierId, checked });
    
    // Encontrar el producto en mappedProducts
    const productIndex = mappedProducts.findIndex(p => p.restpe.id === productId);
    if (productIndex === -1) return;

    // Crear una copia del producto
    const updatedProduct = { ...mappedProducts[productIndex] };
    
    // Actualizar los modificadores asignados
    if (checked) {
      if (!updatedProduct.assignedModifiers.includes(modifierId)) {
        updatedProduct.assignedModifiers = [...updatedProduct.assignedModifiers, modifierId];
      }
    } else {
      updatedProduct.assignedModifiers = updatedProduct.assignedModifiers.filter(id => id !== modifierId);
    }

    // Actualizar el estado local
    setProducts(prev => {
      const updatedRestpeProducts = [...prev.restpeProducts];
      const productToUpdate = updatedRestpeProducts.find(p => p.id === productId);
      if (productToUpdate) {
        productToUpdate.assignedModifiers = updatedProduct.assignedModifiers;
      }
      return {
        ...prev,
        restpeProducts: updatedRestpeProducts
      };
    });

    // Llamar a la función de actualización del padre
    onUpdateProduct(productId, modifierId);
  };

  const allMapped = mappedProducts.some(prod => prod.status === 'OK');

  // Renderizar la sección de modificadores
  const renderModifiersSection = (product) => {
    return (
      <div>
        <h4 className="text-sm font-medium text-cartaai-white mb-3">Modificadores disponibles</h4>
        
        {Object.keys(modifiersByGroup).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(modifiersByGroup).map(([groupName, mods]) => (
              <div key={groupName} className="border border-cartaai-white/10 rounded-md overflow-hidden">
                <div className="bg-cartaai-white/10 px-3 py-2">
                  <h5 className="text-xs font-medium text-cartaai-white">{groupName}</h5>
                </div>
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {mods.map(modifier => {
                    const isAssigned = product.assignedModifiers.includes(modifier.id);
                    const restpeMod = modifier.restpeModifier;
                    
                    return (
                      <div 
                        key={modifier.id} 
                        className={`flex items-center justify-between rounded-md px-3 py-2 ${
                          isAssigned ? 'bg-green-500/10 border border-green-500/20' : 'bg-cartaai-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            id={`mod-${product.restpe.id}-${modifier.id}`}
                            checked={isAssigned}
                            onCheckedChange={(checked) => {
                              console.log('Checkbox changed:', { productId: product.restpe.id, modifierId: modifier.id, checked });
                              handleToggleModifierForProduct(product.restpe.id, modifier.id, checked);
                            }}
                            className={`data-[state=checked]:bg-cartaai-red ${
                              isAssigned ? 'ring-2 ring-green-500' : ''
                            }`}
                          />
                          <div className="flex flex-col">
                            <label 
                              htmlFor={`mod-${product.restpe.id}-${modifier.id}`}
                              className="text-xs text-cartaai-white cursor-pointer"
                            >
                              {modifier.name}
                            </label>
                            {restpeMod && (
                              <div className="text-xs text-cartaai-white/60">
                                {restpeMod.options.length} opciones disponibles
                              </div>
                            )}
                          </div>
                        </div>
                        {modifier.price > 0 && (
                          <span className="text-xs text-cartaai-white/70">
                            +S/ {modifier.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-cartaai-white/60 text-xs italic">No hay modificadores disponibles.</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="glass-container p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-cartaai-white">Catálogo de Productos</h3>
          <p className="text-cartaai-white/70 text-sm">Seleccione los productos de RESTPE que desea incluir en CARTAAI</p>
          <p className="text-cartaai-white/60 text-xs mt-1">
            Nota: Al seleccionar un producto, se utilizará exactamente el mismo nombre en CARTAAI. 
            Pulse en un producto para ver sus presentaciones y asignar modificadores.
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">RESTPE</div>
              <span className="text-sm font-medium text-cartaai-white">Productos: {restpeProducts.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md">CARTAAI</div>
              <span className="text-sm font-medium text-cartaai-white">Seleccionados: {mappedProducts.filter(p => p.status === 'OK').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-md">MODIFICADORES</div>
              <span className="text-sm font-medium text-cartaai-white">Disponibles: {selectedModifiers.length}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-4">
          <div className="relative w-full sm:w-2/3">
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input text-cartaai-white w-full"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filterOption} onValueChange={setFilterOption}>
              <SelectTrigger className="glass-input text-cartaai-white w-full sm:w-[150px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="OK">Seleccionados</SelectItem>
                <SelectItem value="Pendiente">Pendientes</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1); // Resetear a primera página cuando cambia items por página
                setExpandedProductId(null); // Cerrar producto expandido
              }}
            >
              <SelectTrigger className="glass-input text-cartaai-white w-24">
                <SelectValue placeholder="5" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="glass-container overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-primary w-full">
            <thead>
              <tr className="border-b border-cartaai-white/10">
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium"></th>
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">TIPO</th>
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">RESTPE PRODUCTO</th>
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">CODE</th>
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">PRESENTACIÓN</th>
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">CODE</th>
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">PRECIO</th>
                <th className="py-3 px-4 text-center bg-orange-500 text-white text-xs font-medium">INCLUIR EN CARTAAI</th>
                <th className="py-3 px-4 text-left bg-orange-500 text-white text-xs font-medium">STATUS</th>
                <th className="py-3 px-4 text-left bg-orange-500 text-white text-xs font-medium">NOMBRE EN CARTAAI</th>
                <th className="py-3 px-4 text-left bg-orange-500 text-white text-xs font-medium">PRESENTACIÓN</th>
                <th className="py-3 px-4 text-left bg-orange-500 text-white text-xs font-medium">PRECIO</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((product) => (
                <React.Fragment key={product.restpe.id}>
                  <tr className="border-b border-cartaai-white/5 hover:bg-cartaai-white/5 transition-colors text-xs">
                    <td className="py-3 px-4">
                            <button
                              onClick={() => toggleExpandProduct(product.restpe.id)}
                        className="text-cartaai-white hover:text-cartaai-red transition-colors"
                            >
                        {expandedProductId === product.restpe.id ? 
                                <ChevronUp className="h-4 w-4" /> : 
                                <ChevronDown className="h-4 w-4" />
                              }
                            </button>
                      </td>
                      <td className="py-3 px-4 text-cartaai-white">{product.tipo}</td>
                      <td className="py-3 px-4 text-cartaai-white font-medium">{product.restpe.name}</td>
                      <td className="py-3 px-4 text-cartaai-white">{product.restpe.code}</td>
                    <td className="py-3 px-4 text-cartaai-white">{product.restpe.presentation}</td>
                      <td className="py-3 px-4 text-cartaai-white">{product.restpe.internalCode}</td>
                    <td className="py-3 px-4 text-cartaai-white">S/ {product.restpe.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        <Checkbox 
                          id={`include-${product.restpe.id}`}
                          checked={product.status === 'OK'}
                          onCheckedChange={(checked) => handleToggleProduct(product.restpe.id, checked)}
                          className="data-[state=checked]:bg-cartaai-red"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className={`inline-block px-2 py-1 rounded-full text-xs text-center ${
                          product.status === 'OK' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                        }`}>
                          {product.status === 'OK' ? 'Seleccionado' : 'Pendiente'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-cartaai-white">
                      {product.cartaai ? product.cartaai.name : '-'}
                      </td>
                      <td className="py-3 px-4 text-cartaai-white">
                      {product.cartaai ? product.cartaai.presentation : '-'}
                      </td>
                      <td className="py-3 px-4 text-cartaai-white">
                        {product.cartaai ? `S/ ${product.cartaai.price.toFixed(2)}` : '-'}
                      </td>
                    </tr>
                    
                  {/* Panel expandible */}
                  {expandedProductId === product.restpe.id && (
                      <tr>
                        <td colSpan="12" className="p-0">
                        <div className="bg-cartaai-white/5 p-4">
                          {/* Pestañas */}
                          <div className="flex border-b border-cartaai-white/10 mb-4">
                                <button 
                              className={`px-4 py-2 text-xs font-medium ${
                                expandedSection === 'presentations' ? 
                                'text-cartaai-red border-b-2 border-cartaai-red' : 
                                'text-cartaai-white/60'
                              }`}
                                  onClick={() => toggleSection('presentations')}
                                >
                                  Presentaciones
                                </button>
                                <button 
                              className={`px-4 py-2 text-xs font-medium ${
                                expandedSection === 'modifiers' ? 
                                'text-cartaai-red border-b-2 border-cartaai-red' : 
                                'text-cartaai-white/60'
                              }`}
                                  onClick={() => toggleSection('modifiers')}
                                >
                                  Modificadores
                                </button>
                              </div>
                          
                          {/* Contenido de la pestaña */}
                          {expandedSection === 'presentations' && (
                            <div>
                              <h4 className="text-sm font-medium text-cartaai-white mb-3">Presentaciones del producto</h4>
                              
                              {product.presentations && product.presentations.length > 0 ? (
                                <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-cartaai-white/10">
                                      <th className="py-2 px-3 text-left text-cartaai-white/70">Presentación</th>
                                      <th className="py-2 px-3 text-left text-cartaai-white/70">Código</th>
                                      <th className="py-2 px-3 text-left text-cartaai-white/70">Precio</th>
                                      <th className="py-2 px-3 text-center text-cartaai-white/70">Acciones</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    {product.presentations.map(presentation => (
                                      <tr key={presentation.id} className="border-b border-cartaai-white/5">
                                        <td className="py-2 px-3 text-cartaai-white">{presentation.presentation}</td>
                                        <td className="py-2 px-3 text-cartaai-white">{presentation.code}</td>
                                        <td className="py-2 px-3 text-cartaai-white">S/ {presentation.price.toFixed(2)}</td>
                                        <td className="py-2 px-3 text-center">
                                          <Button 
                                            size="sm" 
                                            variant="ghost"
                                            className="h-7 px-2 text-blue-400 hover:text-blue-500"
                                          >
                                            <TagIcon className="h-3 w-3 mr-1" />
                                            <span className="text-xs">Asignar</span>
                                          </Button>
                                            </td>
                                          </tr>
                                    ))}
                                    </tbody>
                                  </table>
                              ) : (
                                <p className="text-cartaai-white/60 text-xs italic">Este producto no tiene presentaciones adicionales.</p>
                              )}
                              </div>
                            )}
                            
                            {expandedSection === 'modifiers' && renderModifiersSection(product)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-cartaai-white/10">
            <div className="text-cartaai-white/60 text-xs">
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} de {filteredProducts.length} productos
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={goToPrevPage} 
                disabled={currentPage === 1}
                variant="outline" 
                size="sm"
                className="h-8 w-8 p-0 text-cartaai-white border-cartaai-white/20"
              >
                <PrevIcon className="h-4 w-4" />
              </Button>
              
              {/* Números de página */}
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  
                  // Lógica para mostrar las páginas correctas cuando hay muchas
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  // No renderizar si el pageNum es mayor que el total de páginas
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "text-cartaai-white border-cartaai-white/20"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                variant="outline" 
                size="sm"
                className="h-8 w-8 p-0 text-cartaai-white border-cartaai-white/20"
              >
                <NextIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver a Categorías
        </Button>

        <div className="flex gap-3">
        <Button 
          onClick={onSaveAll}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Save className="mr-2 h-4 w-4" /> Guardar Configuración
        </Button>
        
        <Button 
          onClick={onContinue}
          disabled={!allMapped}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
            Finalizar Integración <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductIntegration; 