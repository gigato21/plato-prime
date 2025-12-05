import React from 'react';

const CustomerBadge = ({ isNew }) => {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
      isNew 
        ? 'bg-cartaai-red/20 text-cartaai-red border border-cartaai-red/30' 
        : 'bg-cartaai-white/10 text-cartaai-white border border-cartaai-white/30'
    }`}>
      {isNew ? 'Nuevo' : 'Rec'}
    </span>
  );
};

export default CustomerBadge;