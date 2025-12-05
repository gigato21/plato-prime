import React from 'react';
import { EditButton, DeleteButton, AutoChangeButton } from './CustomStandardButtons';
import { Button } from "@/components/ui/button";

const AcceptedOrders = ({ 
  acceptedOrders, 
  autoChangeEnabled, 
  toggleAutoChange, 
  handleEditOrder, 
  handleDeleteOrder 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cartaai-white">Pedidos Aceptados</h2>
        <AutoChangeButton 
          isActive={autoChangeEnabled} 
          onClick={toggleAutoChange}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-cartaai-white">
          <thead>
            <tr className="bg-cartaai-black/50">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Cliente</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {acceptedOrders.map(order => (
              <tr key={order.id} className="border-b border-cartaai-white/10">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.clientName}</td>
                <td className="px-4 py-2">{order.total}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <EditButton onClick={() => handleEditOrder(order)} />
                    <DeleteButton onClick={() => handleDeleteOrder(order.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcceptedOrders;