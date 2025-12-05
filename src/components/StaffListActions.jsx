import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const StaffListActions = ({ 
  staffList, 
  selectedStaff, 
  onSelectAll, 
  onDeleteSelected, 
  onToggleActivationSelected 
}) => {
  const allSelected = staffList.length === selectedStaff.length;
  const allSelectedAreInactive = selectedStaff.length > 0 && 
    selectedStaff.every(id => !staffList.find(staff => staff.id === id).isActive);

  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="flex items-center">
        <Checkbox
          id="select-all"
          checked={allSelected}
          onCheckedChange={onSelectAll}
        />
        <label htmlFor="select-all" className="ml-2 text-sm text-cartaai-white">
          Seleccionar todos
        </label>
      </div>
      {selectedStaff.length > 0 && (
        <div className="space-x-2">
          <Button 
            onClick={onDeleteSelected}
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          >
            Eliminar seleccionados ({selectedStaff.length})
          </Button>
          <Button 
            onClick={onToggleActivationSelected}
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          >
            {allSelectedAreInactive ? 'Activar' : 'Desactivar'} seleccionados ({selectedStaff.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default StaffListActions;