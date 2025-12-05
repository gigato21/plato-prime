import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const SelectCategoryModal = ({ isOpen, onClose, categories = [], onSelectCategory }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Seleccionar Categoría</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Button
                key={category}
                onClick={() => onSelectCategory(category)}
                className="w-full justify-start mb-2 bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20"
              >
                {category}
              </Button>
            ))
          ) : (
            <p className="text-cartaai-white">No hay categorías disponibles.</p>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectCategoryModal;