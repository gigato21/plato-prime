import React from 'react';
import { Button } from "@/components/ui/button";
import CustomSelect from '@/components/ui/CustomSelect';
import { motion } from 'framer-motion';

const LocalSelector = ({ 
  showSelect, 
  locals, 
  selectedLocal, 
  onLocalSelect, 
  onAssign, 
  isLoading 
}) => {
  if (!showSelect) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 space-y-3"
    >
      <CustomSelect 
        options={locals.map(local => ({ 
          value: local.localId, 
          label: local.localDescripcion 
        }))} 
        onChange={(e) => onLocalSelect(locals.find(local => local.localId === e.target.value))} 
        value={selectedLocal ? selectedLocal.localId : ''} 
      />
      <Button 
        onClick={onAssign} 
        className="w-full bg-cartaai-red hover:bg-cartaai-red/80 text-white"
        disabled={isLoading}
      >
        {isLoading ? 'Asignando...' : 'Confirmar Asignación'}
      </Button>
    </motion.div>
  );
};

export default LocalSelector;