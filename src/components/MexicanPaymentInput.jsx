import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const paymentMethods = [
  { id: 'oxxo', name: 'OXXO Pay', placeholder: 'Número de referencia OXXO' },
  { id: 'codi', name: 'CoDi', placeholder: 'Número de celular registrado en CoDi' },
  { id: 'spei', name: 'SPEI', placeholder: 'CLABE interbancaria (18 dígitos)' },
];

export const MexicanPaymentInput = ({ type, value, onTypeChange, onValueChange }) => {
  const selectedMethod = paymentMethods.find(m => m.id === type) || paymentMethods[0];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-cartaai-white">Método de pago digital</Label>
        <Select value={type || 'oxxo'} onValueChange={onTypeChange}>
          <SelectTrigger className="bg-cartaai-white/10 text-gray-700 dark:text-gray-200">
            <SelectValue placeholder="Selecciona un método" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((method) => (
              <SelectItem key={method.id} value={method.id}>
                {method.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="paymentReference" className="text-cartaai-white">
          {selectedMethod.name} - Referencia
        </Label>
        <Input
          id="paymentReference"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="bg-cartaai-white/10 text-gray-700"
          placeholder={selectedMethod.placeholder}
        />
      </div>
    </div>
  );
};

export default MexicanPaymentInput;