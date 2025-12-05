import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Save, ChevronRight, ChevronLeft, ChevronRight as NextIcon, ChevronLeft as PrevIcon } from 'lucide-react';
import { toast } from "sonner";

const CategoryIntegration = ({ 
  categories, 
  onUpdateCategory,
  onContinue,
  onSaveAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('Todos');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { restpeCategories, cartaaiCategories } = categories;

  const mappedCategories = restpeCategories.map(restpe => {
    // Buscar si ya tiene un mapeo con cartaai
    const mappedCartaai = cartaaiCategories.find(cartaai => 
      cartaai.rId === restpe.id
    );
    
    return {
      restpe,
      cartaai: mappedCartaai || null,
      status: mappedCartaai ? 'OK' : 'Pendiente',
      includeInCartaai: mappedCartaai !== null
    };
  });

  const filteredCategories = mappedCategories.filter(category => {
    const matchesSearch = 
      category.restpe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.cartaai && category.cartaai.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterOption === 'Todos') return matchesSearch;
    if (filterOption === 'OK') return matchesSearch && category.status === 'OK';
    if (filterOption === 'Pendiente') return matchesSearch && category.status === 'Pendiente';
    
    return matchesSearch;
  });
  
  // Cálculos para la paginación
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  
  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Ir a la página anterior
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleToggleCategory = (restpeId, checked) => {
    // Buscar la categoría de RESTPE
    const restpeCategory = restpeCategories.find(cat => cat.id === restpeId);
    
    // Buscar si ya está mapeada en CARTAAI
    const existingMapping = cartaaiCategories.find(cat => cat.rId === restpeId);
    
    // Si la categoría ya está integrada (tiene un rId asignado desde CARTAAI)
    // no permitimos desmarcarla, solo marcamos nuevas
    if (existingMapping && !checked) {
      toast.info('Las categorías ya integradas no pueden desmarcarse');
      return;
    }
    
    if (checked) {
      // Buscar la primera categoría de CARTAAI no asignada 
      const firstAvailableCategory = cartaaiCategories.find(cat => !cat.rId);

      if (firstAvailableCategory) {
        // Actualizar con el mismo nombre que en RESTPE pero manteniendo el ID de CARTAAI
        onUpdateCategory(restpeId, firstAvailableCategory.id);
      }
    } else {
      // Eliminar la asociación solo si no estaba previamente integrada
      onUpdateCategory(restpeId, null);
    }
  };

  // Verificar si todas las categorías están mapeadas
  const allMapped = mappedCategories.some(cat => cat.status === 'OK');

  return (
    <div className="space-y-6">
      <div className="glass-container p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-cartaai-white">Integración de Categorías</h3>
          <p className="text-cartaai-white/70 text-sm">Seleccione las categorías de RESTPE que desea incluir en CARTAAI</p>
          <p className="text-cartaai-white/60 text-xs mt-1">
            Nota: Al seleccionar una categoría, se utilizará exactamente el mismo nombre en CARTAAI.
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">RESTPE</div>
              <span className="text-sm font-medium text-cartaai-white">Categorías: {restpeCategories.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md">CARTAAI</div>
              <span className="text-sm font-medium text-cartaai-white">Seleccionadas: {mappedCategories.filter(c => c.status === 'OK').length}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-4">
          <div className="relative w-full sm:w-2/3">
            <Input
              placeholder="Buscar categorías..."
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
                <SelectItem value="OK">Seleccionadas</SelectItem>
                <SelectItem value="Pendiente">Pendientes</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => {
                setItemsPerPage(parseInt(value));
                setCurrentPage(1); // Resetear a primera página cuando cambia items por página
              }}
            >
              <SelectTrigger className="glass-input text-cartaai-white w-24">
                <SelectValue placeholder="10" />
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
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">ID</th>
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">CODE</th>
                <th className="py-3 px-4 text-left bg-blue-500 text-white text-xs font-medium">NOMBRE RESTPE</th>
                <th className="py-3 px-4 text-center bg-orange-500 text-white text-xs font-medium">INCLUIR EN CARTAAI</th>
                <th className="py-3 px-4 text-left bg-orange-500 text-white text-xs font-medium">STATUS</th>
                <th className="py-3 px-4 text-left bg-orange-500 text-white text-xs font-medium">CATEGORÍA CARTAAI</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((category) => (
                <tr key={category.restpe.id} className="border-b border-cartaai-white/5 hover:bg-cartaai-white/5 transition-colors text-xs">
                  <td className="py-3 px-4 text-cartaai-white">{category.restpe.id}</td>
                  <td className="py-3 px-4 text-cartaai-white">{category.restpe.code}</td>
                  <td className="py-3 px-4 text-cartaai-white">{category.restpe.name}</td>
                  <td className="py-3 px-4 text-center">
                    <Checkbox 
                      id={`include-${category.restpe.id}`}
                      checked={category.status === 'OK'}
                      onCheckedChange={(checked) => handleToggleCategory(category.restpe.id, checked)}
                      className="data-[state=checked]:bg-cartaai-red"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs text-center ${
                      category.status === 'OK' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {category.status === 'OK' ? 'Seleccionada' : 'Pendiente'}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-cartaai-white">
                    {category.cartaai ? category.cartaai.name : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-cartaai-white/10">
            <div className="text-cartaai-white/60 text-xs">
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredCategories.length)} de {filteredCategories.length} categorías
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
          Continuar con Productos <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CategoryIntegration; 