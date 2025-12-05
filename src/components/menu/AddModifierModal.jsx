import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddModifierModal = ({ isOpen, onClose, onAddModifier }) => {
  const [modifierName, setModifierName] = useState('');

  const handleAddModifier = () => {
    if (modifierName.trim()) {
      onAddModifier({ name: modifierName, active: true });
      setModifierName('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Agregar nuevo modificador</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nombre del grupo de modificadores"
          value={modifierName}
          onChange={(e) => setModifierName(e.target.value)}
          className="bg-gray-100 text-gray-800"
        />
        <DialogFooter>
          <Button onClick={handleAddModifier} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">Agregar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddModifierModal;