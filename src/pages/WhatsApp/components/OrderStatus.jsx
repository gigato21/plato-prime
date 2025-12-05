import React from 'react';

const statusColors = {
  aceptado: 'bg-blue-500',
  'en cocina': 'bg-yellow-500',
  'en camino': 'bg-purple-500',
  entregado: 'bg-green-500',
};

const OrderStatus = ({ status }) => {
  if (!status) return null;

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]} text-cartaai-black`}>
      {status}
    </div>
  );
};

export default OrderStatus;