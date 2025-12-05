import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

const BasicInfoStep = ({ data, updateData }) => {
  const [touched, setTouched] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updates = { ...data, [name]: value };
    
    // Actualizar automáticamente linkDominio cuando cambie el subdominio
    if (name === 'subdominio') {
      updates.linkDominio = `${value || ''}.cartaai.pe`;
    }
    
    updateData(updates);
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const getValidationError = (field) => {
    if (!touched[field]) return '';
    
    switch (field) {
      case 'localNombreComercial':
        if (!data[field]) return 'Campo requerido';
        if (data[field].length < 3) return 'Mínimo 3 caracteres';
        if (data[field].length > 50) return 'Máximo 50 caracteres';
        break;
      case 'subdominio':
        if (!data[field]) return 'Campo requerido';
        if (data[field].length < 3) return 'Mínimo 3 caracteres';
        if (data[field].length > 20) return 'Máximo 20 caracteres';
        break;
      case 'linkDominio':
        if (!data[field]) return 'Campo requerido';
        if (data[field].length < 3) return 'Mínimo 3 caracteres';
        if (data[field].length > 60) return 'Máximo 60 caracteres';
        break;
      case 'localDescripcion':
        if (data[field]?.length > 255) return 'Máximo 255 caracteres';
        break;
    }
    return '';
  };

  const ValidationTooltip = ({ field, children }) => {
    const error = getValidationError(field);
    return error ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center">
            {children}
            <AlertCircle className="h-4 w-4 ml-1 text-red-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-red-500 text-white">
          <p>{error}</p>
        </TooltipContent>
      </Tooltip>
    ) : children;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Información Básica del Negocio</h2>
      
      <div className="space-y-4">
        <div>
          <ValidationTooltip field="localNombreComercial">
            <Label htmlFor="localNombreComercial" className="text-sm dark:text-gray-200 text-gray-700">
              Nombre Comercial <span className="text-red-500">*</span>
            </Label>
          </ValidationTooltip>
          <Input
            id="localNombreComercial"
            name="localNombreComercial"
            value={data.localNombreComercial || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className="glass-input text-cartaai-white mt-1"
            placeholder="Ej: Pizza Feliz S.A.C."
            required
            minLength={3}
            maxLength={50}
          />
        </div>

        <div>
          <ValidationTooltip field="subdominio">
            <Label htmlFor="subdominio" className="text-sm dark:text-gray-200 text-gray-700">
              Subdominio <span className="text-red-500">*</span>
            </Label>
          </ValidationTooltip>
          <Input
            id="subdominio"
            name="subdominio"
            value={data.subdominio || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className="glass-input text-cartaai-white mt-1"
            placeholder="Ej: pizzafeliz"
            required
            minLength={3}
            maxLength={20}
          />
          <p className="text-xs dark:text-gray-200 text-gray-700 mt-1">
            Tu menú estará disponible en: {data.subdominio || 'ejemplo'}.cartaai.com
          </p>
        </div>

        <div>
          <ValidationTooltip field="linkDominio">
            <Label htmlFor="linkDominio" className="text-sm dark:text-gray-200 text-gray-700">
              Link del Dominio <span className="text-red-500">*</span>
            </Label>
          </ValidationTooltip>
          <Input
            id="linkDominio"
            name="linkDominio"
            value={data.linkDominio || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className="glass-input text-cartaai-white mt-1"
            placeholder="subdominio.cartaai.pe"
            required
            disabled
          />
        </div>

        <div>
          <ValidationTooltip field="localDescripcion">
            <Label htmlFor="localDescripcion" className="text-sm dark:text-gray-200 text-gray-700">
              Descripción (opcional)
            </Label>
          </ValidationTooltip>
          <Textarea
            id="localDescripcion"
            name="localDescripcion"
            value={data.localDescripcion || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className="glass-input text-cartaai-white mt-1"
            placeholder="Describe tu negocio"
            rows={3}
            maxLength={255}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;