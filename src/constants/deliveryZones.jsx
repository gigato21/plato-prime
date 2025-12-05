import { MapPin, Map, Navigation } from "lucide-react";

// Contendría las constantes de tipos y configuraciones relacionadas
export const ZONE_TYPES = {
  POLYGONS: 'poligonos',
  SIMPLE: 'simple',
  MILEAGE: 'mileage'
};

export const ZONE_TYPE_CONFIGS = {
    [ZONE_TYPES.POLYGONS]: {
      label: "Polígonos",
      color: "border-blue-500 text-blue-500",
      icon: <MapPin className="h-4 w-4 mr-2 text-blue-500" />
    },
    [ZONE_TYPES.SIMPLE]: {
      label: "Simple",
      color: "border-orange-500 text-orange-500",
      icon: <Map className="h-4 w-4 mr-2 text-orange-500" />
    },
    [ZONE_TYPES.MILEAGE]: {
      label: "Por KM",
      color: "border-green-500 text-green-500",
      icon: <Navigation className="h-4 w-4 mr-2 text-green-500" />
    }
  };