import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState({ name: '', active: true });

  const handleAddCategory = () => {
    onAddCategory(newCategory);
    setNewCategory({ name: '', active: true });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-container">
        <DialogHeader>
          <DialogTitle className="text-gray-700">Añadir nueva categoría</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nombre de la categoría"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className="glass-input text-gray-700 dark:text-gray-300"
        />
        <DialogFooter>
          <Button onClick={handleAddCategory} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">Añadir categoría</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;