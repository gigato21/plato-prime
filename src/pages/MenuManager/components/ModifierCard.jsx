import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from 'lucide-react';
import { Switch } from "@/components/ui/switch";

const ModifierCard = ({ modifier, onEdit, onDelete, onToggle, isLoading }) => {
  return (
    <div className="bg-cartaai-white/10 p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-cartaai-white font-medium">{modifier.name}</h3>
          <p className="text-sm text-gray-400">
            {modifier.isMultiple ? 'Selección múltiple' : 'Selección única'} 
            ({modifier.minQuantity} - {modifier.maxQuantity})
          </p>
          <p className="text-sm text-gray-400">
            {modifier.options.length} opciones
          </p>
        </div>
        <div className="flex space-x-2 items-center">
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-cartaai-red border-t-transparent rounded-full" />
          ) : (
            <Switch
              checked={modifier.status === 1}
              onCheckedChange={onToggle}
              className="data-[state=checked]:bg-cartaai-red"
            />
          )}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(modifier)}
            className="text-cartaai-white hover:text-cartaai-red"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(modifier._id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModifierCard;