import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const PaymentMethodCheckbox = ({ id, label, checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id={id}
      checked={checked}
      onCheckedChange={onChange}
    />
    <Label htmlFor={id} className="text-cartaai-white">
      {label}
    </Label>
  </div>
);