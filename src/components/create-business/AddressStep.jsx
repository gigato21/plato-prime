import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddressStep = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  const handleSelectChange = (field, value) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="localDepartamento" className="text-cartaai-white">
            Departamento
          </Label>
          <Select
            value={data.localDepartamento || ''}
            onValueChange={(value) => handleSelectChange('localDepartamento', value)}
          >
            <SelectTrigger className="glass-input text-cartaai-white mt-1">
              <SelectValue placeholder="Selecciona departamento" />
            </SelectTrigger>
            <SelectContent className="bg-cartaai-black text-cartaai-white">
              <SelectItem value="Lima">Lima</SelectItem>
              <SelectItem value="Arequipa">Arequipa</SelectItem>
              <SelectItem value="Cusco">Cusco</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="localProvincia" className="text-cartaai-white">
            Provincia
          </Label>
          <Select
            value={data.localProvincia || ''}
            onValueChange={(value) => handleSelectChange('localProvincia', value)}
          >
            <SelectTrigger className="glass-input text-cartaai-white mt-1">
              <SelectValue placeholder="Selecciona provincia" />
            </SelectTrigger>
            <SelectContent className="bg-cartaai-black text-cartaai-white">
              <SelectItem value="Lima">Lima</SelectItem>
              <SelectItem value="Callao">Callao</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="localDistrito" className="text-cartaai-white">
            Distrito
          </Label>
          <Select
            value={data.localDistrito || ''}
            onValueChange={(value) => handleSelectChange('localDistrito', value)}
          >
            <SelectTrigger className="glass-input text-cartaai-white mt-1">
              <SelectValue placeholder="Selecciona distrito" />
            </SelectTrigger>
            <SelectContent className="bg-cartaai-black text-cartaai-white">
              <SelectItem value="Miraflores">Miraflores</SelectItem>
              <SelectItem value="San Isidro">San Isidro</SelectItem>
              <SelectItem value="Barranco">Barranco</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="localDireccion" className="text-cartaai-white">
          Dirección completa
        </Label>
        <Input
          id="localDireccion"
          name="localDireccion"
          value={data.localDireccion || ''}
          onChange={handleChange}
          className="glass-input text-cartaai-white mt-1"
          placeholder="Ej: Av. Las Pizzas 123"
        />
      </div>

      <div>
        <Label htmlFor="localMontoMinimo" className="text-cartaai-white">
          Monto mínimo de pedido
        </Label>
        <Input
          id="localMontoMinimo"
          name="localMontoMinimo"
          type="number"
          value={data.localMontoMinimo || ''}
          onChange={handleChange}
          className="glass-input text-cartaai-white mt-1"
          placeholder="Ej: 30.00"
        />
      </div>
    </div>
  );
};

export default AddressStep;