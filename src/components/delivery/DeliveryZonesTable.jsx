import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, Package, Truck, Map, Navigation, Eye, Edit2, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ZONE_TYPES, ZONE_TYPE_CONFIGS } from "@/constants/deliveryZones";

const DeliveryZonesTable = ({ zones, onViewZone, onEditZone, onDeleteZone }) => {
  const getTypeConfig = (type) => {
    // const configs = {
    //   mapeada: {
    //     label: "Mapeada",
    //     color: "border-blue-500 text-blue-500",
    //     icon: <MapPin className="h-4 w-4" />
    //   },
    //   simple: {
    //     label: "Simple",
    //     color: "border-orange-500 text-orange-500",
    //     icon: <Map className="h-4 w-4" />
    //   },
    //   mileage: {
    //     label: "Por KM",
    //     color: "border-green-500 text-green-500",
    //     icon: <Navigation className="h-4 w-4" />
    //   }
    // };
    // return configs[type] || configs.simple;
    return ZONE_TYPE_CONFIGS[type] || ZONE_TYPE_CONFIGS.SIMPLE;
  };
  
  return (
    <div className="glass-container rounded-lg overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-cartaai-white font-semibold">Nombre</TableHead>
            <TableHead className="text-cartaai-white font-semibold">Tipo</TableHead>
            <TableHead className="text-cartaai-white font-semibold">Horario</TableHead>
            <TableHead className="text-cartaai-white font-semibold">Costos</TableHead>
            <TableHead className="text-cartaai-white font-semibold">Tiempo Est.</TableHead>
            <TableHead className="text-cartaai-white font-semibold">Estado</TableHead>
            <TableHead className="text-cartaai-white font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {zones.map((zone) => {
            const typeConfig = getTypeConfig(zone.type);
            const isKmZone = zone.type === ZONE_TYPES.MILEAGE;

            return (
              <TableRow key={zone.coberturaLocalId} className="hover:bg-cartaai-white/5 transition-colors">
                <TableCell className="text-cartaai-white font-medium">
                  {zone.coberturaLocalNombre}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={typeConfig.color}
                  >
                    {typeConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-cartaai-white/90">
                    <Clock className="h-4 w-4 mr-2 text-cartaai-white/70" />
                    {zone.coberturaLocalHoraInicio} - {zone.coberturaLocalHoraFin}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {isKmZone ? (
                      <>
                        <div className="flex items-center text-cartaai-white/90">
                          <Truck className="h-4 w-4 mr-2 text-cartaai-white/70" />
                          Base: S/ {zone.costoBase} hasta {zone.distanciaBase}km
                        </div>
                        <div className="flex items-center text-cartaai-white/90">
                          <DollarSign className="h-4 w-4 mr-2 text-cartaai-white/70" />
                          +S/ {zone.incrementoCosto} cada {zone.incrementoPorKm}km
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center text-cartaai-white/90">
                          <Truck className="h-4 w-4 mr-2 text-cartaai-white/70" />
                          S/ {zone.coberturaLocalCostoEnvio}
                        </div>
                        <div className="flex items-center text-cartaai-white/90">
                          <Package className="h-4 w-4 mr-2 text-cartaai-white/70" />
                          Mín. S/ {zone.coberturaLocalPedidoMinimo}
                        </div>
                        {zone.coberturaLocalPermiteEnvioGratis === "1" && (
                          <div className="flex items-center text-cartaai-white/90">
                            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                            Gratis {'>'} S/ {zone.coberturaLocalMinimoParaEnvioGratis}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-cartaai-white border-cartaai-white/20">
                    {zone.coberturaLocalTiempoEstimado} min
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={`${
                      (zone.coberturaLocalEstado === "1" || zone.coberturaLocalEstado === "active")
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {(zone.coberturaLocalEstado === "1" || zone.coberturaLocalEstado === "active") ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-cartaai-white hover:text-cartaai-white/80"
                      onClick={() => onViewZone(zone)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon" 
                      className="text-cartaai-white hover:text-cartaai-white/80"
                      onClick={() => onEditZone(zone)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDeleteZone(zone)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryZonesTable;