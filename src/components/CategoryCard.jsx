import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CategoryCard = ({ category, onDeleteCategory, onAddItem, onDeleteItem, onEditCategory }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', image: '', price: '' });
  const [editedCategoryName, setEditedCategoryName] = useState(category.name);

  const handleAddItem = () => {
    onAddItem(category.id, newItem);
    setNewItem({ name: '', description: '', image: '', price: '' });
    setIsAddItemModalOpen(false);
  };

  const handleEditCategory = () => {
    onEditCategory(category.id, editedCategoryName);
    setIsEditCategoryModalOpen(false);
  };

  return (
    <Card className="bg-cartaai-red text-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setIsAddItemModalOpen(true)} className="text-white hover:bg-white/20">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsEditCategoryModalOpen(true)} className="text-white hover:bg-white/20">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDeleteCategory(category.id)} className="text-white hover:bg-white/20">
            <Trash className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-white hover:bg-white/20">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {category.items.map(item => (
              <div key={item.id} className="bg-white text-black rounded-lg overflow-hidden shadow-md">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-cartaai-red">
                      {item.price !== undefined ? `S/ ${Number(item.price).toFixed(2)}` : 'Price not set'}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => onDeleteItem(category.id, item.id)} className="text-cartaai-red hover:bg-cartaai-red/10">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}

      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="bg-cartaai-black text-white">
          <DialogHeader>
            <DialogTitle>Añadir nuevo artículo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nombre del artículo"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="bg-cartaai-white/10 text-white"
            />
            <Textarea
              placeholder="Descripción del artículo"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="bg-cartaai-white/10 text-white"
            />
            <Input
              placeholder="URL de la imagen"
              value={newItem.image}
              onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
              className="bg-cartaai-white/10 text-white"
            />
            <Input
              type="number"
              placeholder="Precio"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="bg-cartaai-white/10 text-white"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddItem} className="bg-cartaai-red text-white hover:bg-cartaai-red/80">Añadir artículo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditCategoryModalOpen} onOpenChange={setIsEditCategoryModalOpen}>
        <DialogContent className="bg-cartaai-black text-white">
          <DialogHeader>
            <DialogTitle>Editar nombre de la categoría</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Nombre de la categoría"
            value={editedCategoryName}
            onChange={(e) => setEditedCategoryName(e.target.value)}
            className="bg-cartaai-white/10 text-white"
          />
          <DialogFooter>
            <Button onClick={handleEditCategory} className="bg-cartaai-red text-white hover:bg-cartaai-red/80">Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CategoryCard;