import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';

const ItemsDetailModal = ({ isOpen, onClose, items, orderId }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10 text-cartaai-white">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Detalles del Pedido #{orderId}</DialogTitle>
          <button 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-cartaai-white" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Artículos:</h4>
          <ul className="list-disc pl-5">
            {items.map((item, index) => (
              <li key={index} className="mb-2">
                <div>
                  <p className="font-medium">{item.name || `Producto ${item.productId}`}</p>
                  {item.description && (
                    <p className="text-sm text-gray-400">{item.description}</p>
                  )}
                  {item.modificatorSelectionList?.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 text-sm text-gray-400">
                      {item.modificatorSelectionList.map((mod, idx) => (
                        <li key={idx}>
                          {mod.groupName}: {mod.optionName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemsDetailModal;