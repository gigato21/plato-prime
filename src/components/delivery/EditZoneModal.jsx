import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Map, Navigation } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import { updateDeliveryZone, updateMileageZone } from '../../services/deliveryZoneService';
import MileageZoneForm from './MileageZoneForm';
import DrawZoneMap from './DrawZoneMap';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ZONE_TYPES, ZONE_TYPE_CONFIGS } from '@/constants/deliveryZones';

const EditZoneModal = ({ isOpen, onClose, zone, onZoneUpdated }) => {
  const [formData, setFormData] = useState(zone || {});
  const [selectedPoints, setSelectedPoints] = useState([]);
  const token = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (zone) {
      setFormData(zone);
      if (zone.type === ZONE_TYPES.POLYGONS && zone.coberturaLocalRuta) {
        const formattedPoints = zone.coberturaLocalRuta.map(point => 
          [parseFloat(point.latitude), parseFloat(point.longitude)]
        );
        setSelectedPoints(formattedPoints);
      }
    }
  }, [zone]); 

  const getTypeConfig = (type) => {
    return ZONE_TYPE_CONFIGS[type] || ZONE_TYPE_CONFIGS.SIMPLE;
  };

  const handleSubmit = async (formData) => {
    try {
      let updatedZone;

      if (zone.type === ZONE_TYPES.MILEAGE) {
        updatedZone = await updateMileageZone(zone._id, formData, token);
      } else {
        const zoneData = {
          ...formData,
          coberturaLocalRuta: zone.type === ZONE_TYPES.POLYGONS ? selectedPoints : undefined
        };
        updatedZone = await updateDeliveryZone(zone._id, zoneData, token);
      }

      onZoneUpdated(updatedZone);
      onClose();
      toast.success('Zona actualizada exitosamente');
    } catch (error) {
      toast.error('Error al actualizar la zona');
    }
  };

  const typeConfig = getTypeConfig(zone?.type);

  if (!zone) return null;

  if (zone.type === ZONE_TYPES.MILEAGE) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1200px] bg-cartaai-black border-cartaai-white/10 overflow-y-auto max-h-[90vh] z-[9999]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-cartaai-white flex items-center gap-2">
              {typeConfig.icon}
              Editar zona por kilometraje
            </DialogTitle>
          </DialogHeader>
          <MileageZoneForm 
            initialData={zone}
            onClose={onClose} 
            onZoneUpdated={onZoneUpdated}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1200px] bg-cartaai-black border-cartaai-white/10 overflow-y-auto max-h-[90vh] z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-cartaai-white flex items-center gap-2">
            {typeConfig.icon}
            Editar zona {typeConfig.label.toLowerCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-cartaai-white">Nombre</Label>
              <Input
                value={formData.coberturaLocalNombre}
                onChange={(e) => setFormData(prev => ({ ...prev, coberturaLocalNombre: e.target.value }))}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-cartaai-white">Costo de envío</Label>
              <Input
                type="number"
                value={formData.coberturaLocalCostoEnvio}
                onChange={(e) => setFormData(prev => ({ ...prev, coberturaLocalCostoEnvio: e.target.value }))}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-cartaai-white">Pedido mínimo</Label>
              <Input
                type="number"
                value={formData.coberturaLocalPedidoMinimo}
                onChange={(e) => setFormData(prev => ({ ...prev, coberturaLocalPedidoMinimo: e.target.value }))}
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-cartaai-white">Tiempo estimado (min)</Label>
              <Input
                type="number"
                value={formData.coberturaLocalTiempoEstimado}
                onChange={(e) => setFormData(prev => ({ ...prev, coberturaLocalTiempoEstimado: e.target.value }))}
                className="glass-input"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.coberturaLocalPermiteEnvioGratis === "1"}
              onCheckedChange={(checked) => setFormData(prev => ({ 
                ...prev, 
                coberturaLocalPermiteEnvioGratis: checked ? "1" : "0" 
              }))}
            />
            <Label className="text-cartaai-white">Permitir envío gratis</Label>
          </div>

          {formData.coberturaLocalPermiteEnvioGratis === "1" && (
            <div className="space-y-2">
              <Label className="text-cartaai-white">Monto mínimo para envío gratis</Label>
              <Input
                type="number"
                value={formData.coberturaLocalMinimoParaEnvioGratis}
                onChange={(e) => setFormData(prev => ({ ...prev, coberturaLocalMinimoParaEnvioGratis: e.target.value }))}
                className="glass-input"
              />
            </div>
          )}

          {zone.type === ZONE_TYPES.POLYGONS && (
            <DrawZoneMap
              onPointsSelected={setSelectedPoints}
              points={selectedPoints}
              savedZones={[]}
            />
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/10"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => handleSubmit(formData)}
              className="bg-cartaai-red hover:bg-cartaai-red/80"
              disabled={zone.type === ZONE_TYPES.POLYGONS && selectedPoints.length < 3}
            >
              Guardar cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditZoneModal; 