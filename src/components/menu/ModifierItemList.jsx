import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from 'lucide-react';
import StatusToggle from '../StatusToggle';

const ModifierItemList = ({ items, modifierId, onToggleItemStatus, onEditItem, onAddItem }) => {
  return (
    <div className="pl-8 pr-4 py-4 space-y-4 bg-cartaai-white/5 rounded-lg">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-cartaai-white">Opciones del modificador</h4>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onAddItem}
          className="text-cartaai-white hover:text-cartaai-red border-cartaai-white/20"
        >
          Agregar Opción
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-cartaai-white">Nombre</TableHead>
            <TableHead className="text-cartaai-white">Precio</TableHead>
            <TableHead className="text-cartaai-white">Estado</TableHead>
            <TableHead className="text-cartaai-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-cartaai-white">{item.name}</TableCell>
              <TableCell className="text-cartaai-white">S/ {item.price}</TableCell>
              <TableCell>
                <StatusToggle
                  isActive={item.active === 1}
                  onToggle={() => onToggleItemStatus(item, modifierId)}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditItem(item, modifierId)}
                  className="text-cartaai-white hover:text-cartaai-red"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ModifierItemList;