import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AddCouponModal = ({ isOpen, onClose, onAddCoupon }) => {
  const [couponData, setCouponData] = useState({
    name: '',
    code: '',
    type: '',
    value: '',
    activeFrom: null,
    activeTo: null,
    limit: 1,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'code') {
      const formattedCode = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setCouponData({ ...couponData, [name]: formattedCode });
    } else {
      setCouponData({ ...couponData, [name]: value });
    }
  };

  const handleTypeChange = (value) => {
    setCouponData({ ...couponData, type: value, value: '' });
  };

  const handleLimitChange = (value) => {
    setCouponData({ ...couponData, limit: value[0] });
  };

  const handleDateChange = (field, date) => {
    setCouponData({ ...couponData, [field]: date });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddCoupon(couponData);
    setCouponData({
      name: '',
      code: '',
      type: '',
      value: '',
      activeFrom: null,
      activeTo: null,
      limit: 1,
    });
    onClose();
  };

  const isFormValid = () => {
    return couponData.name && couponData.code && couponData.type && couponData.value && couponData.activeFrom && couponData.activeTo;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Nuevo cupón</DialogTitle>
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
                placeholder="Ingresa el nombre del cupón"
                className="col-span-3 bg-cartaai-white/10 text-cartaai-black placeholder-gray-500"
                onChange={handleInputChange}
                value={couponData.name}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right text-cartaai-white">
                Código
              </Label>
              <div className="col-span-3 space-y-2">
                <Input
                  id="code"
                  name="code"
                  placeholder="INGRESA EL CÓDIGO DEL CUPÓN"
                  className="bg-cartaai-white/10 text-cartaai-black placeholder-gray-500 uppercase"
                  onChange={handleInputChange}
                  value={couponData.code}
                  maxLength={20}
                />
                <p className="text-xs text-gray-400 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Solo letras mayúsculas y números, sin espacios ni acentos.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right text-cartaai-white">
                Tipo
              </Label>
              <Select onValueChange={handleTypeChange} value={couponData.type}>
                <SelectTrigger className="col-span-3 bg-cartaai-white/10 text-cartaai-white">
                  <SelectValue placeholder="Seleccione Tipo" />
                </SelectTrigger>
                <SelectContent className="bg-cartaai-black text-cartaai-white">
                  <SelectItem value="percentage">Porcentaje</SelectItem>
                  <SelectItem value="fixed">Monto fijo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {couponData.type && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right text-cartaai-white">
                  {couponData.type === 'percentage' ? 'Porcentaje' : 'Monto fijo'}
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    placeholder={couponData.type === 'percentage' ? 'Ingrese el porcentaje' : 'Ingrese el monto en soles'}
                    className="bg-cartaai-white/10 text-black placeholder-gray-500"
                    onChange={handleInputChange}
                    value={couponData.value}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black">
                    {couponData.type === 'percentage' ? '%' : 'S/'}
                  </span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-cartaai-white">
                Activo desde
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`col-span-3 bg-cartaai-white/10 text-cartaai-white justify-start text-left font-normal ${!couponData.activeFrom && "text-gray-400"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {couponData.activeFrom ? format(couponData.activeFrom, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-cartaai-black border-cartaai-white/10">
                  <Calendar
                    mode="single"
                    selected={couponData.activeFrom}
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
                    className={`col-span-3 bg-cartaai-white/10 text-cartaai-white justify-start text-left font-normal ${!couponData.activeTo && "text-gray-400"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {couponData.activeTo ? format(couponData.activeTo, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-cartaai-black border-cartaai-white/10">
                  <Calendar
                    mode="single"
                    selected={couponData.activeTo}
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
                  value={[couponData.limit]}
                  onValueChange={handleLimitChange}
                  className="w-full"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-400">1</span>
                  <span className="text-sm text-cartaai-white font-bold">{couponData.limit}</span>
                  <span className="text-sm text-gray-400">500</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-cartaai-red hover:bg-cartaai-red/80 text-white" disabled={!isFormValid()}>
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCouponModal;