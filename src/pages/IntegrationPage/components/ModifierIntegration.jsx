import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown, 
  ChevronUp, 
  Save,
  ChevronRight as NextIcon, 
  ChevronLeft as PrevIcon 
} from 'lucide-react';

const ModifierIntegration = ({ 
  modifiers, 
  onUpdateModifier,
  onContinue,
  onBack,
  onSaveAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('Todos');
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3); // Menos items por página ya que los grupos tienen muchos modificadores

  const { restpeModifiers, cartaaiModifiers, modifierGroups } = modifiers;

  // Agrupar modificadores por grupo
  const groupedModifiers = modifierGroups.map(group => {
    const modifiersInGroup = restpeModifiers.filter(mod => mod.group === group.name);
    
    return {
      group,
      modifiers: modifiersInGroup.map(restpe => {
        // Buscar si ya tiene un mapeo con cartaai
        const mappedCartaai = cartaaiModifiers.find(cartaai => 
          cartaai.rId === restpe.id
        );
        
        return {
          tipo: 'MODIFICADOR',
          restpe,
          cartaai: mappedCartaai || null,
          status: mappedCartaai ? 'OK' : 'Pendiente',
          includeInCartaai: mappedCartaai !== null
        };
      })
    };
  });

  // Filtrar grupos basados en la búsqueda y el filtro seleccionado
  const filteredGroups = groupedModifiers
    .map(group => {
      const filteredModifiers = group.modifiers.filter(modifier => {
        const matchesSearch = 
          modifier.restpe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (modifier.cartaai && modifier.cartaai.name.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filterOption === 'Todos') return matchesSearch;
        if (filterOption === 'OK') return matchesSearch && modifier.status === 'OK';
        if (filterOption === 'Pendiente') return matchesSearch && modifier.status === 'Pendiente';
        
        return matchesSearch;
      });

      return {
        ...group,
        modifiers: filteredModifiers
      };
    })
    .filter(group => group.modifiers.length > 0); // Solo mostrar grupos que tengan modificadores después del filtrado
  
  // Cálculos para la paginación
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGroups.slice(indexOfFirstItem, indexOfLastItem);
  
  // Cambiar de página
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedGroupId(null); // Cerrar grupo expandido al cambiar de página
  };
  
  // Ir a la página anterior
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setExpandedGroupId(null); // Cerrar grupo expandido al cambiar de página
    }
  };
  
  // Ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setExpandedGroupId(null); // Cerrar grupo expandido al cambiar de página
    }
  };

  const handleToggleModifier = (restpeId, checked) => {
    if (checked) {
      // Buscar el primer modificador de CARTAAI no asignado
      const availableModifier = cartaaiModifiers.find(mod => !mod.rId);

      if (availableModifier) {
        // Asignar el modificador de RESTPE al de CARTAAI
        onUpdateModifier(restpeId, availableModifier.id);
      }
    } else {
      // Eliminar la asociación
      onUpdateModifier(restpeId, null);
    }
  };

  const toggleExpandGroup = (groupId) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null);
    } else {
      setExpandedGroupId(groupId);
    }
  };

  // Verificar si hay al menos un modificador mapeado
  const atLeastOneMapped = restpeModifiers.some(mod => 
    cartaaiModifiers.some(cartaai => cartaai.rId === mod.id)
  );

  return (
    <div className="space-y-6">
      <div className="glass-container p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-cartaai-white">Catálogo de Modificadores</h3>
          <p className="text-cartaai-white/70 text-sm">Seleccione los modificadores de RESTPE que desea incluir en CARTAAI</p>
          <p className="text-cartaai-white/60 text-xs mt-1">
            Nota: Los modificadores están agrupados por categorías. Haga clic en un grupo para expandir sus modificadores.
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">RESTPE</div>
              <span className="text-sm font-medium text-cartaai-white">Modificadores: {restpeModifiers.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md">CARTAAI</div>
              <span className="text-sm font-medium text-cartaai-white">
                Seleccionados: {cartaaiModifiers.filter(mod => mod.rId !== null).length}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-4">
          <div className="relative w-full sm:w-2/3">
            <Input
              placeholder="Buscar modificadores..."
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
                setExpandedGroupId(null); // Cerrar grupo expandido
              }}
            >
              <SelectTrigger className="glass-input text-cartaai-white w-24">
                <SelectValue placeholder="3" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="glass-container overflow-hidden space-y-4">
        {currentItems.map((groupData, groupIndex) => {
          const { group, modifiers } = groupData;
          const isExpanded = expandedGroupId === group.id;
          
          return (
            <div key={`group-${group.id}`} className="border border-cartaai-white/10 rounded-lg overflow-hidden">
              {/* Cabecera del grupo */}
              <div 
                className={`p-4 flex justify-between items-center cursor-pointer ${isExpanded ? 'bg-cartaai-white/10' : ''}`}
                onClick={() => toggleExpandGroup(group.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded-md">
                    GRUPO
                  </div>
                  <span className="text-cartaai-white font-medium text-lg">{group.name}</span>
                  <span className="text-cartaai-white/60 text-xs">
                    ({modifiers.length} modificadores)
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-cartaai-white/60 mr-3">
                    {modifiers.filter(mod => mod.status === 'OK').length} seleccionados
                  </span>
                  <button className="text-cartaai-white">
                    {isExpanded ? 
                      <ChevronUp className="h-5 w-5" /> : 
                      <ChevronDown className="h-5 w-5" />
                    }
                  </button>
                </div>
              </div>
              
              {/* Contenido del grupo cuando está expandido */}
              {isExpanded && (
                <div className="overflow-x-auto">
                  <table className="table-primary w-full">
                    <thead>
                      <tr className="border-b border-cartaai-white/10">
                        <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">TIPO</th>
                        <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">RESTPE MODIFICADOR</th>
                        <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">CODE</th>
                        <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">PRECIO</th>
                        <th className="py-3 px-4 text-center bg-orange-500 text-white text-xs font-medium">INCLUIR EN CARTAAI</th>
                        <th className="py-3 px-4 text-left bg-orange-500 text-white text-xs font-medium">STATUS</th>
                        <th className="py-3 px-4 text-left bg-orange-500 text-white text-xs font-medium">NOMBRE EN CARTAAI</th>
                        <th className="py-3 px-4 text-left bg-orange-500 text-white text-xs font-medium">PRECIO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modifiers.map((modifier, modIndex) => (
                        <tr 
                          key={`modifier-${modifier.restpe.id}`} 
                          className="border-b border-cartaai-white/5 hover:bg-cartaai-white/5 transition-colors text-xs"
                        >
                          <td className="py-3 px-4 text-cartaai-white">{modifier.tipo}</td>
                          <td className="py-3 px-4 text-cartaai-white font-medium">{modifier.restpe.name}</td>
                          <td className="py-3 px-4 text-cartaai-white">{modifier.restpe.code}</td>
                          <td className="py-3 px-4 text-cartaai-white">
                            {modifier.restpe.price > 0 ? `S/ ${modifier.restpe.price.toFixed(2)}` : 'Gratis'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Checkbox 
                              id={`include-${modifier.restpe.id}`}
                              checked={modifier.status === 'OK'}
                              onCheckedChange={(checked) => handleToggleModifier(modifier.restpe.id, checked)}
                              className="data-[state=checked]:bg-cartaai-red"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className={`inline-block px-2 py-1 rounded-full text-xs text-center ${
                              modifier.status === 'OK' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                            }`}>
                              {modifier.status === 'OK' ? 'Seleccionado' : 'Pendiente'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-cartaai-white">
                            {modifier.cartaai ? modifier.cartaai.name : '-'}
                          </td>
                          <td className="py-3 px-4 text-cartaai-white">
                            {modifier.cartaai && modifier.cartaai.price 
                              ? (modifier.cartaai.price > 0 ? `S/ ${modifier.cartaai.price.toFixed(2)}` : 'Gratis')
                              : '-'
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-cartaai-white/10">
            <div className="text-cartaai-white/60 text-xs">
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredGroups.length)} de {filteredGroups.length} grupos
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
          disabled={!atLeastOneMapped}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Continuar con Productos <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        </div>
      </div>
    </div>
  );
};

export default ModifierIntegration; 