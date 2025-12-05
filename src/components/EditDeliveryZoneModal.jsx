import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditDeliveryZoneModal = ({ isOpen, onClose, onEditZone, zone }) => {
  const [editedZone, setEditedZone] = useState({
    name: '',
    cost: '',
    phone: '',
  });

  useEffect(() => {
    if (zone) {
      setEditedZone({
        name: zone.name,
        cost: zone.cost,
        phone: zone.phone,
      });
    }
  }, [zone]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedZone({ ...editedZone, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onEditZone({ ...zone, ...editedZone });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Editar zona de entrega</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-cartaai-white">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={editedZone.name}
                onChange={handleInputChange}
                className="col-span-3 bg-cartaai-white/10 text-cartaai-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right text-cartaai-white">
                Costo
              </Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                value={editedZone.cost}
                onChange={handleInputChange}
                className="col-span-3 bg-cartaai-white/10 text-cartaai-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right text-cartaai-white">
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                value={editedZone.phone}
                onChange={handleInputChange}
                className="col-span-3 bg-cartaai-white/10 text-cartaai-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDeliveryZoneModal;