import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EditModifierModal = ({ isOpen, onClose, onEditModifier, modifier }) => {
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    if (modifier) {
      setEditedName(modifier.name);
    }
  }, [modifier]);

  const handleEditModifier = () => {
    onEditModifier(modifier.id, editedName);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Editar grupo de modificadores</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nombre del grupo de modificadores"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="bg-gray-100 text-gray-800"
        />
        <DialogFooter>
          <Button onClick={handleEditModifier} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModifierModal;