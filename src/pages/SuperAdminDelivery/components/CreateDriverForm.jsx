import { useState, useEffect } from 'react';
import { createDriver } from '../services/driversService';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getApiUrls } from "@/config/api";

const { SERVICIOS_GENERALES_URL } = getApiUrls();

const CreateDriverForm = ({ onSuccess }) => {
  const [companies, setCompanies] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    licensePlate: '',
    vehicleModel: '',
    company: undefined,
    active: true,
    available: true,
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${SERVICIOS_GENERALES_URL}/api/v1/delivery/companies`);
        if (!response.ok) throw new Error('Error al cargar empresas');
        const data = await response.json();
        console.log('companies', data.data);
        setCompanies(data.data);
      } catch (error) {
        console.error('Error al cargar empresas:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const driverData = { ...formData };
      if (!driverData.company) {
        delete driverData.company;
      }
      await createDriver(driverData);
      onSuccess();
    } catch (error) {
      console.error('Error al crear conductor:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (value) => {
    setFormData(prev => ({ ...prev, company: value === "none" ? undefined : value }));
  };

  const handleSwitchChange = (name) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-white">Nombre</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
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
            required
            className="glass-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
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
            required
            className="glass-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleModel" className="text-white">Modelo de Vehículo</Label>
          <Input
            id="vehicleModel"
            name="vehicleModel"
            value={formData.vehicleModel}
            onChange={handleChange}
            required
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
            required
            className="glass-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company" className="text-white">Empresa (Opcional)</Label>
        <Select
          value={formData.company || "none"}
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
        Crear Conductor
      </Button>
    </form>
  );
};

export default CreateDriverForm; 