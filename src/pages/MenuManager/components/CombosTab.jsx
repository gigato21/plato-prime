import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import CreateComboForm from './CreateComboForm';
import CombosList from './CombosList';

const CombosTab = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleComboCreated = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cartaai-white">Combos</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-cartaai-red hover:bg-cartaai-red/80"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Combo
        </Button>
      </div>

      <CombosList refreshTrigger={refreshTrigger} />

      <CreateComboForm 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleComboCreated}
      />
    </div>
  );
};

export default CombosTab;