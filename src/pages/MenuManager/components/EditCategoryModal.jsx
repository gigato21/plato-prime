import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditCategoryModal = ({ isOpen, onClose, onEditCategory, category }) => {
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    if (category) {
      setEditedName(category.name);
    }
  }, [category]);

  const handleEditCategory = () => {
    onEditCategory(category.id, editedName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-container">
        <DialogHeader>
          <DialogTitle className="text-gray-700">Editar categoría</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nombre de la categoría"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="glass-input text-gray-700 dark:text-gray-300"
        />
        <DialogFooter>
          <Button onClick={handleEditCategory} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;