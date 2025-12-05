import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from 'lucide-react';

export const ShiftControls = ({ shifts, selectedShift, onAddShift, onDeleteShift, isDelivery = false }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-4 mb-4 overflow-x-auto">
        {shifts.map((shift, index) => (
          <Button
            key={shift.id}
            onClick={() => setSelectedShift(index)}
            className={`${
              selectedShift === index
                ? 'bg-cartaai-red text-white'
                : 'bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20'
            }`}
          >
            {shift.name}
          </Button>
        ))}
      </div>
      <Button onClick={() => onAddShift(isDelivery)} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
        <Plus className="mr-2 h-4 w-4" /> Añadir nuevo turno
      </Button>
      {shifts.length > 1 && (
        <Button 
          onClick={() => onDeleteShift(shifts[selectedShift].id)} 
          variant="ghost" 
          className="text-cartaai-red hover:text-cartaai-red/80"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};