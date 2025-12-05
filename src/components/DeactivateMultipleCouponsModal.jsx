import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeactivateMultipleCouponsModal = ({ isOpen, onClose, onConfirm, couponCount }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Confirmar desactivación múltiple</DialogTitle>
        </DialogHeader>
        <p className="text-cartaai-white">
          ¿Estás seguro de que quieres desactivar {couponCount} cupones seleccionados?
        </p>
        <DialogFooter>
          <Button onClick={onClose} className="bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20">
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
            Desactivar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateMultipleCouponsModal;