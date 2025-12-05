import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const YapePlinInput = ({ value, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="yapeOPlinNumber" className="text-cartaai-white">Número de Yape o Plin</Label>
    <Input
      id="yapeOPlinNumber"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-cartaai-white/10 text-gray-700"
      placeholder="Ingrese el número de Yape o Plin"
    />
  </div>
);