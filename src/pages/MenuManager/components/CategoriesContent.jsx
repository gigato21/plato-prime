import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from 'lucide-react';
import DraggableCategory from './DraggableCategory';
import SelectLocalsModal from './SelectLocalsModal';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { toast } from "sonner";

const CategoriesContent = ({ 
  categories, 
  onAddCategory, 
  onEditCategory, 
  onDeleteCategory,
  fetchCategories 
}) => {
  const API_URLS = getApiUrls();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectLocalsModalOpen, setIsSelectLocalsModalOpen] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);
  const accessToken = useSelector(state => state.auth.accessToken);
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);

  const filteredCategories = categories
    .filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => parseInt(a.order) - parseInt(b.order));

  console.log(filteredCategories, 'filteredCategories')

  const handleStatusToggle = async (category) => {
    if (localId === "-1") {
      setPendingUpdate({ 
        category, 
        changes: { status: category.status === 1 ? 0 : 1 } 
      });
      setIsSelectLocalsModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/categorias/${category.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: category.status === 1 ? 0 : 1 })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');

      toast.success("Estado actualizado correctamente");
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error("No se pudo actualizar el estado");
    }
  };

  const updateCategoryOrder = async (categoryId, newOrder) => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/categorias/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder.toString() })
      });

      if (!response.ok) throw new Error('Error al actualizar el orden');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleDrop = async (dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newCategories = [...filteredCategories];
    const [draggedCategory] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(dropIndex, 0, draggedCategory);

    setIsUpdating(true);

    try {
      const updatePromises = newCategories.map((category, index) => 
        updateCategoryOrder(category.id, index + 1)
      );

      await Promise.all(updatePromises);
      toast.success("Orden actualizado correctamente");
      fetchCategories();
    } catch (error) {
      toast.error("Error al actualizar el orden");
    } finally {
      setIsUpdating(false);
    }

    setDraggedIndex(null);
  };

  const handleEditCategory = async (category, changes) => {
    if (localId === "-1") {
      setPendingUpdate({ category, changes });
      setIsSelectLocalsModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/categorias/${category.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changes)
      });

      if (!response.ok) throw new Error('Error al actualizar la categoría');

      toast.success("Categoría actualizada correctamente");
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error("No se pudo actualizar la categoría");
    }
  };

  const handleConfirmLocalsUpdate = async (selectedLocals) => {
    if (!pendingUpdate) return;

    try {
      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/update-multiple-local/categorias/${pendingUpdate.category.rId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            localIds: selectedLocals,
            changes: pendingUpdate.changes,
            subDomain: subDomain
          })
        }
      );

      if (!response.ok) throw new Error('Error al actualizar la categoría');

      toast.success("Categoría actualizada en los locales seleccionados");
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
      toast.error("No se pudo actualizar la categoría");
    } finally {
      setPendingUpdate(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-xl font-semibold text-gray-700">Categorías</h2>
          <div className="relative flex-1 max-w-sm">
            <Input
              type="text"
              placeholder="Buscar categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <Button 
          onClick={onAddCategory} 
          className="bg-cartaai-red hover:bg-cartaai-red/80 transition-colors duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>
      
      {isUpdating && <div className="loader">Cargando...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category, index) => (
          <DraggableCategory
            key={category.id}
            category={category}
            index={index}
            onEditCategory={handleEditCategory}
            onDeleteCategory={onDeleteCategory}
            onStatusToggle={handleStatusToggle}
            onDragStart={setDraggedIndex}
            onDragOver={(index) => {}}
            onDrop={handleDrop}
          />
        ))}
      </div>

      <SelectLocalsModal
        isOpen={isSelectLocalsModalOpen}
        onClose={() => {
          setIsSelectLocalsModalOpen(false);
          setPendingUpdate(null);
        }}
        onConfirm={handleConfirmLocalsUpdate}
        title="Seleccionar locales para actualizar"
      />
    </div>
  );
};

export default CategoriesContent;