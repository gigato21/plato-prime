import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NoResultsFound = ({ onClearFilters }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
      No se encontraron resultados para los filtros seleccionados
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
      Prueba ajustando los filtros o seleccionando un rango de fechas diferente
    </p>
    <Button 
      onClick={onClearFilters}
      variant="outline"
      className="mt-4"
    >
      Limpiar todos los filtros
    </Button>
  </div>
);

export default NoResultsFound;