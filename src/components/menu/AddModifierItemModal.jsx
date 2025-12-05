import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddModifierItemModal = ({ isOpen, onClose, onAddItem, modifierId }) => {
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const handleAddItem = () => {
    if (itemName.trim() && !isNaN(parseFloat(itemPrice))) {
      onAddItem(modifierId, {
        name: itemName.trim(),
        price: parseFloat(itemPrice),
      });
      setItemName('');
      setItemPrice('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Agregar nuevo ítem al modificador</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nombre del ítem"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="bg-gray-100 text-gray-800 mb-2"
        />
        <Input
          type="number"
          step="0.01"
          placeholder="Precio del ítem"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          className="bg-gray-100 text-gray-800"
        />
        <DialogFooter>
          <Button onClick={handleAddItem} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">Agregar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddModifierItemModal;