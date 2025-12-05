import { useState, useEffect } from 'react';
import { updateDriver } from '../services/driversService';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const EditDriverForm = ({ driver, companies, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: driver.firstName,
    lastName: driver.lastName,
    phone: driver.phone,
    email: driver.email,
    licensePlate: driver.licensePlate,
    vehicleModel: driver.vehicleModel,
    company: driver.company?._id || "none",
    active: driver.active,
    available: driver.available,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {};
      // Solo incluimos los campos que han sido modificados
      Object.keys(formData).forEach(key => {
        if (formData[key] !== driver[key]) {
          if (key === 'company') {
            updateData[key] = formData[key] === "none" ? undefined : formData[key];
          } else {
            updateData[key] = formData[key];
          }
        }
      });

      await updateDriver(driver._id, updateData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar conductor:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (value) => {
    setFormData(prev => ({ ...prev, company: value }));
  };

  const handleSwitchChange = (name) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-container-no-blur max-h-[80vh] overflow-y-auto">
        <DialogHeader className="top-0 z-10 pb-4">
          <DialogTitle className="text-white">Editar Conductor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white">Nombre</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white">Apellido</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleModel" className="text-white">Modelo de Vehículo</Label>
            <Input
              id="vehicleModel"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licensePlate" className="text-white">Placa</Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-white">Empresa (Opcional)</Label>
            <Select
              value={formData.company}
              onValueChange={handleCompanyChange}
            >
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Selecciona una empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguna empresa</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={() => handleSwitchChange('active')}
              />
              <Label htmlFor="active" className="text-white">Activo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={() => handleSwitchChange('available')}
              />
              <Label htmlFor="available" className="text-white">Disponible</Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full glass-button bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border-[#3B82F6]/20 text-white"
          >
            Actualizar Conductor
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDriverForm; 