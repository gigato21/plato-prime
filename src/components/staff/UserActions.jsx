import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, CheckCircle, XCircle, Trash2, Building2 } from 'lucide-react';

const UserActions = ({ 
  user, 
  onToggleStatus, 
  onEdit, 
  onDelete, 
  setShowSelect, 
  showSelect,
  assignedLocals,
  setShowLocalsModal,
  isLoading 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => onToggleStatus(user._id)}
        className={`p-2 rounded-full glass-container flex items-center justify-center transition-colors duration-300
          ${user.isActive 
            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
            : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
      >
        {user.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => onEdit(user)}
        className="p-2 glass-container bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-full flex items-center justify-center transition-colors duration-300"
      >
        <Edit2 className="w-5 h-5" />
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => onDelete(user)}
        className="p-2 glass-container bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-full flex items-center justify-center transition-colors duration-300"
      >
        <Trash2 className="w-5 h-5" />
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSelect(!showSelect)}
        className="flex-shrink-0 px-3 py-2 glass-container bg-cartaai-white/5 hover:bg-cartaai-white/10 text-cartaai-white rounded-lg transition-colors duration-300"
        disabled={isLoading}
      >
        <span className="text-sm whitespace-nowrap">{isLoading ? 'Cargando...' : 'Asignar Local'}</span>
      </motion.button>

      {assignedLocals.length > 0 && (
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLocalsModal(true)}
          className="flex items-center gap-2 px-3 py-2 glass-container bg-cartaai-white/5 hover:bg-cartaai-white/10 text-cartaai-white rounded-lg transition-colors duration-300"
        >
          <Building2 className="w-4 h-4" />
          <span className="text-sm">Ver Locales ({assignedLocals.length})</span>
        </motion.button>
      )}
    </div>
  );
};

export default UserActions;