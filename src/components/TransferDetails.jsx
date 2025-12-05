import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const TransferDetails = ({ transferData, onInputChange }) => (
  <div className="space-y-4">
    <Label className="text-cartaai-white">Detalles de Transferencia Bancaria</Label>
    <Select
      value={transferData?.bank || ''}
      onValueChange={(value) => onInputChange('bank', value)}
    >
      <SelectTrigger className="bg-cartaai-white/10 text-cartaai-white">
        <SelectValue placeholder="Seleccione un banco" />
      </SelectTrigger>
      <SelectContent className="bg-cartaai-black text-cartaai-white">
        {['BCP', 'BBVA', 'Interbank', 'Scotiabank'].map((bank) => (
          <SelectItem key={bank} value={bank}>{bank}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Input
      value={transferData?.accountName || ''}
      onChange={(e) => onInputChange('accountName', e.target.value)}
      className="bg-cartaai-white/10 text-gray-700"
      placeholder="Nombre del titular de la cuenta"
    />
    <Input
      value={transferData?.accountNumber || ''}
      onChange={(e) => onInputChange('accountNumber', e.target.value)}
      className="bg-cartaai-white/10 text-gray-700"
      placeholder="Número de cuenta bancaria"
    />
    <Input
      value={transferData?.interBankAccountNumber || ''}
      onChange={(e) => onInputChange('interBankAccountNumber', e.target.value)}
      className="bg-cartaai-white/10 text-gray-700"
      placeholder="Número de cuenta interbancaria"
    />
  </div>
);