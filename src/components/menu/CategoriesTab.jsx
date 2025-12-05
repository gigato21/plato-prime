import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import AddCategoryModal from '../../pages/MenuManager/components/AddCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';
import StatusToggle from './StatusToggle';
import { useProductsAndCategories } from '../../hooks/useProductsAndCategories';

const CategoriesTab = () => {
  const { categories, allModifiers, updateCategories, handleModifierToggle } = useProductsAndCategories();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addCategory = (newCategory) => {
    const updatedCategories = [...categories, { ...newCategory, id: Date.now(), modifiers: [] }];
    updateCategories(updatedCategories);
  };

  const editCategory = (id, newName) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, name: newName } : category
    );
    updateCategories(updatedCategories);
  };

  const deleteCategory = (id) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    updateCategories(updatedCategories);
  };

  const toggleCategoryStatus = (id) => {
    const updatedCategories = categories.map(category =>
      category.id === id ? { ...category, active: !category.active } : category
    );
    updateCategories(updatedCategories);
  };

  const openDeleteModal = (category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
    }
    setIsDeleteModalOpen(false);
  };

  const handleEditCategory = (category) => {
    const newName = prompt("Ingrese el nuevo nombre de la categoría", category.name);
    if (newName && newName !== category.name) {
      editCategory(category.id, newName);
    }
  };

  const toggleExpandCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva Categoría
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-cartaai-white">Nombre</TableHead>
            <TableHead className="text-cartaai-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCategories.map((category) => (
            <React.Fragment key={category.id}>
              <TableRow>
                <TableCell 
                  className="text-cartaai-white cursor-pointer hover:bg-cartaai-white/10"
                  onClick={() => handleEditCategory(category)}
                >
                  {category.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => openDeleteModal(category)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                    <StatusToggle
                      isActive={category.active}
                      onToggle={() => toggleCategoryStatus(category.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpandCategory(category.id)}
                      className="text-cartaai-white"
                    >
                      {expandedCategory === category.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedCategory === category.id && (
                <TableRow>
                  <TableCell colSpan={2}>
                    <div className="ml-4 space-y-2">
                      <h4 className="text-cartaai-white font-semibold">Modificadores para esta categoría:</h4>
                      {allModifiers.map((modifier) => (
                        <div key={modifier.id} className="flex items-center justify-between">
                          <span className="text-cartaai-white">{modifier.name}</span>
                          <StatusToggle
                            isActive={category.modifiers.includes(modifier.id)}
                            onToggle={() => handleModifierToggle(category.id, modifier.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCategory={addCategory}
      />

      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        categoryName={deletingCategory?.name}
      />
    </div>
  );
};

export default CategoriesTab;
