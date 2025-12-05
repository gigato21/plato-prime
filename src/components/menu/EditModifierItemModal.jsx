import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditModifierItemModal = ({ isOpen, onClose, onEditModifierItem, item }) => {
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');

  useEffect(() => {
    if (item) {
      setEditedName(item.name || '');
      setEditedPrice(item.price !== undefined ? item.price.toString() : '');
    }
  }, [item]);

  const handleEditModifierItem = () => {
    const updatedPrice = editedPrice === '' ? undefined : parseFloat(editedPrice);
    onEditModifierItem(item.modifierId, item.id, editedName, updatedPrice);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Editar item del modificador</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nombre del item"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="bg-gray-100 text-gray-800 mb-2"
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Precio (opcional)"
          value={editedPrice}
          onChange={(e) => setEditedPrice(e.target.value)}
          className="bg-gray-100 text-gray-800"
        />
        <DialogFooter>
          <Button onClick={handleEditModifierItem} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModifierItemModal;