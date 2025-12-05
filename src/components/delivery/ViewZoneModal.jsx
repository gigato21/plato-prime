import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Package, Truck, Navigation, MapPin, Map } from 'lucide-react';
import LeafletMap from '../LeafletMap';
import { ZONE_TYPE_CONFIGS, ZONE_TYPES } from "@/constants/deliveryZones";
const ViewZoneModal = ({ isOpen, onClose, zone }) => {
  if (!zone) return null;

  const getTypeConfig = (type) => {
      // const configs = {
      //   mapeada: {
      //     label: "Mapeada",
      //     color: "border-blue-500 text-blue-500",
      //     icon: <MapPin className="h-5 w-5" />
      //   },
      //   simple: {
      //     label: "Simple",
      //     color: "border-orange-500 text-orange-500",
      //     icon: <Map className="h-5 w-5" />
      //   },
      //   mileage: {
      //     label: "Por KM",
      //     color: "border-green-500 text-green-500",
    //     icon: <Navigation className="h-5 w-5" />
    //   }
    // };
    // return configs[type] || configs.simple;
    return ZONE_TYPE_CONFIGS[type] || ZONE_TYPE_CONFIGS.SIMPLE;
  };

  const typeConfig = getTypeConfig(zone.type);
  const isKmZone = zone.type === ZONE_TYPES.MILEAGE;
  const isMappedZone = zone.type === ZONE_TYPES.POLYGONS;

  const points = isMappedZone ? zone.coberturaLocalRuta
    .sort((a, b) => a.id - b.id)
    .map(point => ({
      lat: parseFloat(point.latitude),
      lng: parseFloat(point.longitude)
    })) : [];

  const centerPoint = isKmZone ? {
    lat: parseFloat(zone.coordenadasLocal.latitude),
    lng: parseFloat(zone.coordenadasLocal.longitude)
  } : (points[0] || { lat: -12.0464, lng: -77.0428 });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-4 z-[9999] max-w-full md:max-w-3xl h-[calc(100vh-32px)] md:h-[90vh] md:inset-auto md:top-[50%] md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 glass-container p-0 border-none overflow-hidden">
        <div className="flex flex-col h-full max-h-[calc(100vh-32px)] md:max-h-[90vh]">
          <DialogHeader className="p-6 pb-0 flex-shrink-0">
            <DialogTitle className="text-xl font-semibold text-cartaai-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                {typeConfig.icon}
                {zone.coberturaLocalNombre}
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline"
                  className={typeConfig.color}
                >
                  {typeConfig.label}
                </Badge>
                <Badge 
                  className={`${
                    (zone.coberturaLocalEstado === "1" || zone.coberturaLocalEstado === "active")
                      ? "bg-green-500/20 text-green-500" 
                      : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {(zone.coberturaLocalEstado === "1" || zone.coberturaLocalEstado === "active") ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-cartaai-white/10 scrollbar-track-transparent">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-container bg-cartaai-white/5 p-3 space-y-1">
                <div className="flex items-center text-cartaai-white/90">
                  <Clock className="h-4 w-4 mr-2 text-cartaai-white/70" />
                  {zone.coberturaLocalHoraInicio} - {zone.coberturaLocalHoraFin}
                </div>
              </div>
              
              {isKmZone ? (
                <>
                  <div className="glass-container bg-cartaai-white/5 p-3 space-y-1">
                    <div className="flex items-center text-cartaai-white/90">
                      <Truck className="h-4 w-4 mr-2 text-cartaai-white/70" />
                      Base: S/ {zone.costoBase} hasta {zone.distanciaBase}km
                    </div>
                  </div>
                  <div className="glass-container bg-cartaai-white/5 p-3 space-y-1">
                    <div className="flex items-center text-cartaai-white/90">
                      <DollarSign className="h-4 w-4 mr-2 text-cartaai-white/70" />
                      +S/ {zone.incrementoCosto} cada {zone.incrementoPorKm}km
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="glass-container bg-cartaai-white/5 p-3 space-y-1">
                    <div className="flex items-center text-cartaai-white/90">
                      <Truck className="h-4 w-4 mr-2 text-cartaai-white/70" />
                      Envío: S/ {zone.coberturaLocalCostoEnvio}
                    </div>
                  </div>
                  <div className="glass-container bg-cartaai-white/5 p-3 space-y-1">
                    <div className="flex items-center text-cartaai-white/90">
                      <Package className="h-4 w-4 mr-2 text-cartaai-white/70" />
                      Pedido mín: S/ {zone.coberturaLocalPedidoMinimo}
                    </div>
                  </div>
                </>
              )}
            </div>

            {!isKmZone && zone.coberturaLocalPermiteEnvioGratis === "1" && (
              <div className="glass-container bg-cartaai-white/5 p-3">
                <div className="flex items-center text-cartaai-white/90">
                  <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                  Envío gratis en pedidos mayores a S/ {zone.coberturaLocalMinimoParaEnvioGratis}
                </div>
              </div>
            )}

            {isKmZone && zone.rangosPrecios?.length > 0 && (
              <div className="glass-container bg-cartaai-white/5 p-4">
                <h3 className="text-sm font-semibold text-cartaai-white mb-3">Rangos de precios</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {zone.rangosPrecios.map((rango, index) => (
                    <div key={index} className="glass-container bg-cartaai-white/5 p-2 text-sm">
                      <div className="text-cartaai-white/90">
                        {rango.distanciaMin} - {rango.distanciaMax}km
                      </div>
                      <div className="text-cartaai-white font-semibold">
                        S/ {rango.costo}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="h-[400px] rounded-lg overflow-hidden">
              <LeafletMap
                selectedLocations={points}
                savedZones={isMappedZone ? [{ points, name: zone.coberturaLocalNombre }] : []}
                restaurantLocation={centerPoint}
                showKmRadius={isKmZone}
                kmRadius={isKmZone ? zone.distanciaBase : undefined}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewZoneModal;