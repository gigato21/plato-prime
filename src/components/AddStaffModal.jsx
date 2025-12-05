import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddStaffModal = ({ isOpen, onClose, onAddStaff }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddStaff({ name, email, password, isActive: true });
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Agregar nuevo staff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-cartaai-white">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-cartaai-white/10 text-cartaai-white"
              placeholder="Nombre y Apellido"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-cartaai-white">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-cartaai-white/10 text-cartaai-white"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-cartaai-white">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-cartaai-white/10 text-cartaai-white"
              placeholder="********"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffModal;