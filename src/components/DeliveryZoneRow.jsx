import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';

const DeliveryZoneRow = ({ zone, onEdit, onDelete }) => {
  return (
    <tr className="text-cartaai-white">
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {zone.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {zone.cost}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {zone.phone}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <Button
          onClick={() => onEdit(zone)}
          className="mr-2 bg-cartaai-white/10 hover:bg-cartaai-white/20"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => onDelete(zone.id)}
          className="bg-cartaai-red hover:bg-cartaai-red/80"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default DeliveryZoneRow;