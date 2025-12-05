import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddOrderModal = ({ isOpen, onClose, onAddOrder }) => {
  const [items, setItems] = useState(['']);

  const handleAddItem = () => {
    setItems([...items, '']);
  };

  const handleItemChange = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddOrder({ items: items.filter(item => item.trim() !== '') });
    setItems(['']);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Agregar Pedido Manual</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`item-${index}`} className="text-cartaai-white">
                Ítem {index + 1}
              </Label>
              <Input
                id={`item-${index}`}
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                className="bg-cartaai-white/10 text-cartaai-white"
                placeholder="Nombre del ítem"
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={handleAddItem}
            className="w-full bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20"
          >
            Agregar otro ítem
          </Button>
          <DialogFooter>
            <Button type="submit" className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
              Agregar Pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderModal;