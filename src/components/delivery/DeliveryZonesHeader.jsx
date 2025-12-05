import { Button } from "@/components/ui/button";
import { Plus, Map } from 'lucide-react';

const DeliveryZonesHeader = ({ onViewAll, onAddZone }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-800">Zonas de Entrega</h1>
        <p className="text-gray-800 text-sm">
          Gestiona las áreas donde ofreces servicio de delivery
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={onViewAll}
          variant="outline"
          className="bg-gray-100/70 dark:bg-gray-800/70 text-gray-800 dark:text-gray-100 hover:bg-gray-800/20 dark:hover:bg-gray-100/20"
        >
          <Map className="mr-2 h-4 w-4" /> Ver mapa completo
        </Button>
        <Button 
          onClick={onAddZone}
          className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva zona
        </Button>
      </div>
    </div>
  );
};

export default DeliveryZonesHeader;