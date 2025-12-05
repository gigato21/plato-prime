import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CountryCodeSelect from '../CountryCodeSelect';
import ValidationTooltip from './ValidationTooltip';
import { useToast } from "@/components/ui/use-toast";

const LocationContactStep = ({ data, updateData }) => {
  const { toast } = useToast();
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    // Required field validation
    if (!value || value.trim() === '') {
      newErrors[name] = { message: 'Este campo es obligatorio' };
      return newErrors;
    }

    // Phone number validations
    if (name === 'localTelefono' || name === 'localWpp') {
      if (value.length < 10) {
        newErrors[name] = { message: 'El número debe tener al menos 10 dígitos' };
      } else {
        delete newErrors[name];
      }
    } else {
      delete newErrors[name];
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone numbers, only allow digits
    if ((name === 'localTelefono' || name === 'localWpp') && !/^\d*$/.test(value)) {
      return;
    }
    
    // Max length validation for phone numbers
    if ((name === 'localTelefono' || name === 'localWpp') && value.length > 15) {
      return;
    }

    const newErrors = validateField(name, value);
    setErrors(newErrors);
    updateData({ ...data, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = validateField(name, value);
    setErrors(newErrors);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-left dark:text-gray-200 text-gray-700 mb-6">
        Ubicación y Contacto
      </h2>
      <div className="space-y-4">
        <div>
          <ValidationTooltip field="localDireccion" errors={errors}>
            <Label htmlFor="localDireccion" className="text-sm dark:text-gray-200 text-gray-700">
              Dirección del negocio
            </Label>
          </ValidationTooltip>
          <Input
            id="localDireccion"
            name="localDireccion"
            value={data.localDireccion || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={255}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
            placeholder="Ej: Av. Las Pizzas 123"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <ValidationTooltip field="localDepartamento" errors={errors}>
              <Label htmlFor="localDepartamento" className="text-sm dark:text-gray-200 text-gray-700">
                Departamento
              </Label>
            </ValidationTooltip>
            <Input
              id="localDepartamento"
              name="localDepartamento"
              value={data.localDepartamento || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
              placeholder="Ej: Lima"
            />
          </div>

          <div>
            <ValidationTooltip field="localProvincia" errors={errors}>
              <Label htmlFor="localProvincia" className="text-sm dark:text-gray-200 text-gray-700">
                Provincia
              </Label>
            </ValidationTooltip>
            <Input
              id="localProvincia"
              name="localProvincia"
              value={data.localProvincia || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
              placeholder="Ej: Lima"
            />
          </div>

          <div>
            <ValidationTooltip field="localDistrito" errors={errors}>
              <Label htmlFor="localDistrito" className="text-sm dark:text-gray-200 text-gray-700">
                Distrito
              </Label>
            </ValidationTooltip>
            <Input
              id="localDistrito"
              name="localDistrito"
              value={data.localDistrito || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
              placeholder="Ej: Miraflores"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <ValidationTooltip field="localTelefono" errors={errors}>
              <Label htmlFor="localTelefono" className="text-sm dark:text-gray-200 text-gray-700">
                Teléfono del negocio
              </Label>
            </ValidationTooltip>
            <div className="flex mt-1">
              <CountryCodeSelect
                value={data.phoneCountryCode || '+51'}
                onChange={(value) => updateData({ ...data, phoneCountryCode: value })}
              />
              <Input
                id="localTelefono"
                name="localTelefono"
                value={data.localTelefono || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                className="glass-input text-cartaai-white ml-2 flex-grow text-sm sm:text-base h-8 sm:h-10"
                placeholder="987654321"
              />
            </div>
          </div>

          <div>
            <ValidationTooltip field="localWpp" errors={errors}>
              <Label htmlFor="localWpp" className="text-sm dark:text-gray-200 text-gray-700">
                WhatsApp del negocio
              </Label>
            </ValidationTooltip>
            <div className="flex mt-1">
              <CountryCodeSelect
                value={data.wppCountryCode || '+51'}
                onChange={(value) => updateData({ ...data, wppCountryCode: value })}
              />
              <Input
                id="localWpp"
                name="localWpp"
                value={data.localWpp || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                className="glass-input text-cartaai-white ml-2 flex-grow text-sm sm:text-base h-8 sm:h-10"
                placeholder="987654321"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationContactStep;