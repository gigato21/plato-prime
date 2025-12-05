import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LeafletMap from '../LeafletMap';
import { MapPin, Map, Navigation } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ZONE_TYPES, ZONE_TYPE_CONFIGS } from "@/constants/deliveryZones";
const ViewAllZonesModal = ({ isOpen, onClose, zones }) => {
  if (!zones || zones.length === 0) return null;

  const getTypeConfig = (type) => {
    // const configs = {
    //   mapeada: {
    //     label: "Mapeada",
    //     color: "border-blue-500 text-blue-500",
    //     icon: <MapPin className="h-4 w-4 mr-2 text-blue-500" />
    //   },
    //   simple: {
    //     label: "Simple",
    //     color: "border-orange-500 text-orange-500",
    //     icon: <Map className="h-4 w-4 mr-2 text-orange-500" />
    //   },
    //   mileage: {
    //     label: "Por KM",
    //     color: "border-green-500 text-green-500",
    //     icon: <Navigation className="h-4 w-4 mr-2 text-green-500" />
    //   }
    // };
    // return configs[type] || configs.simple;
    return ZONE_TYPE_CONFIGS[type] || ZONE_TYPE_CONFIGS.SIMPLE;
  };

  // Separar zonas por tipo
  const mappedZones = zones.filter(zone => zone.type === ZONE_TYPES.POLYGONS);
  const simpleZones = zones.filter(zone => zone.type === ZONE_TYPES.SIMPLE);
  const mileageZones = zones.filter(zone => zone.type === ZONE_TYPES.MILEAGE);

  // Preparar zonas mapeadas para el mapa
  const polygonZones = mappedZones.map(zone => {
    const sortedPoints = zone.coberturaLocalRuta
      .sort((a, b) => a.id - b.id)
      .map(point => ({
        lat: parseFloat(point.latitude),
        lng: parseFloat(point.longitude)
      }));

    return {
      points: sortedPoints,
      name: zone.coberturaLocalNombre
    };
  });

  // Preparar zonas por kilometraje para el mapa
  const kmZones = mileageZones.map(zone => ({
    center: {
      lat: parseFloat(zone.coordenadasLocal.latitude),
      lng: parseFloat(zone.coordenadasLocal.longitude)
    },
    radius: zone.distanciaBase,
    name: zone.coberturaLocalNombre
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-4 z-[9999] max-w-full md:max-w-5xl h-[calc(100vh-32px)] md:h-[90vh] md:inset-auto md:top-[50%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 glass-container p-0 border-none overflow-hidden">
        <div className="flex flex-col h-full max-h-[calc(100vh-32px)] md:max-h-[90vh]">
          <DialogHeader className="p-6 pb-0 flex-shrink-0">
            <DialogTitle className="text-xl font-semibold text-cartaai-white flex items-center gap-2">
              <Map className="h-5 w-5" />
              Mapa de Zonas de Entrega
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-cartaai-white/10 scrollbar-track-transparent">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              {mappedZones.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-cartaai-white mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    Zonas Mapeadas
                  </h3>
                  <div className="space-y-2">
                    {mappedZones.map((zone) => (
                      <div 
                        key={zone.coberturaLocalId}
                        className="glass-container bg-cartaai-white/5 p-2 text-sm flex items-center justify-between"
                      >
                        <span className="text-cartaai-white">{zone.coberturaLocalNombre}</span>
                        <Badge variant="outline" className="border-blue-500 text-blue-500">
                          {zone.coberturaLocalCostoEnvio} S/
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {simpleZones.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-cartaai-white mb-2 flex items-center">
                    <Map className="h-4 w-4 mr-2 text-orange-500" />
                    Zonas Simples
                  </h3>
                  <div className="space-y-2">
                    {simpleZones.map((zone) => (
                      <div 
                        key={zone.coberturaLocalId}
                        className="glass-container bg-cartaai-white/5 p-2 text-sm flex items-center justify-between"
                      >
                        <span className="text-cartaai-white">{zone.coberturaLocalNombre}</span>
                        <Badge variant="outline" className="border-orange-500 text-orange-500">
                          {zone.coberturaLocalCostoEnvio} S/
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mileageZones.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-cartaai-white mb-2 flex items-center">
                    <Navigation className="h-4 w-4 mr-2 text-green-500" />
                    Zonas por KM
                  </h3>
                  <div className="space-y-2">
                    {mileageZones.map((zone) => (
                      <div 
                        key={zone.coberturaLocalId}
                        className="glass-container bg-cartaai-white/5 p-2 text-sm flex items-center justify-between"
                      >
                        <span className="text-cartaai-white">{zone.coberturaLocalNombre}</span>
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          {zone.costoBase} S/ + {zone.incrementoCosto} S/km
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-[500px] rounded-lg overflow-hidden">
              <LeafletMap
                selectedLocations={[]}
                savedZones={polygonZones}
                kmZones={kmZones}
                restaurantLocation={
                  kmZones[0]?.center || 
                  polygonZones[0]?.points[0] || 
                  { lat: -12.0464, lng: -77.0428 }
                }
                showZoneNames={true}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAllZonesModal;