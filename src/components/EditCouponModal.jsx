import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const EditCouponModal = ({ isOpen, onClose, onEditCoupon, coupon }) => {
  const [editedCoupon, setEditedCoupon] = useState({
    name: '',
    code: '',
    type: '',
    value: '',
    activeFrom: null,
    activeTo: null,
    limit: 1,
  });

  useEffect(() => {
    if (coupon) {
      setEditedCoupon({
        ...coupon,
        activeFrom: coupon.activeFrom ? new Date(coupon.activeFrom) : null,
        activeTo: coupon.activeTo ? new Date(coupon.activeTo) : null,
      });
    }
  }, [coupon]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedCoupon({ ...editedCoupon, [name]: value });
  };

  const handleTypeChange = (value) => {
    setEditedCoupon({ ...editedCoupon, type: value });
  };

  const handleLimitChange = (value) => {
    setEditedCoupon({ ...editedCoupon, limit: value[0] });
  };

  const handleDateChange = (field, date) => {
    setEditedCoupon({ ...editedCoupon, [field]: date });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onEditCoupon(editedCoupon);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Editar cupón</DialogTitle>
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
                value={editedCoupon.name}
                onChange={handleInputChange}
                className="col-span-3 bg-cartaai-white/10 text-cartaai-black placeholder-gray-500"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right text-cartaai-white">
                Código
              </Label>
              <Input
                id="code"
                name="code"
                value={editedCoupon.code}
                onChange={handleInputChange}
                className="col-span-3 bg-cartaai-white/10 text-cartaai-black placeholder-gray-500"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right text-cartaai-white">
                Tipo
              </Label>
              <Select onValueChange={handleTypeChange} value={editedCoupon.type}>
                <SelectTrigger className="col-span-3 bg-cartaai-white/10 text-cartaai-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-cartaai-black text-cartaai-white">
                  <SelectItem value="percentage">Porcentaje</SelectItem>
                  <SelectItem value="fixed">Monto fijo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right text-cartaai-white">
                {editedCoupon.type === 'percentage' ? 'Porcentaje' : 'Monto fijo'}
              </Label>
              <Input
                id="value"
                name="value"
                type="number"
                value={editedCoupon.value}
                onChange={handleInputChange}
                className="col-span-3 bg-cartaai-white/10 text-cartaai-white placeholder-gray-500"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-cartaai-white">
                Activo desde
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`col-span-3 bg-cartaai-white/10 text-cartaai-white justify-start text-left font-normal`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedCoupon.activeFrom ? format(editedCoupon.activeFrom, "PPP", { locale: es }) : <span className="text-gray-400">Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-cartaai-black border-cartaai-white/10">
                  <Calendar
                    mode="single"
                    selected={editedCoupon.activeFrom}
                    onSelect={(date) => handleDateChange('activeFrom', date)}
                    initialFocus
                    className="text-cartaai-white"
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-cartaai-white">
                Activo hasta
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`col-span-3 bg-cartaai-white/10 text-cartaai-white justify-start text-left font-normal`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedCoupon.activeTo ? format(editedCoupon.activeTo, "PPP", { locale: es }) : <span className="text-gray-400">Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-cartaai-black border-cartaai-white/10">
                  <Calendar
                    mode="single"
                    selected={editedCoupon.activeTo}
                    onSelect={(date) => handleDateChange('activeTo', date)}
                    initialFocus
                    className="text-cartaai-white"
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="limit" className="text-right text-cartaai-white">
                Límite de usos
              </Label>
              <div className="col-span-3">
                <Slider
                  id="limit"
                  min={1}
                  max={500}
                  step={1}
                  value={[editedCoupon.limit]}
                  onValueChange={handleLimitChange}
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-400">1</span>
                  <span className="text-sm text-cartaai-white font-bold">{editedCoupon.limit}</span>
                  <span className="text-sm text-gray-400">500</span>
                </div>
              </div>
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

export default EditCouponModal;
