import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DrawZoneMap from './DrawZoneMap';
const MappedZoneForm = ({ formData, onUpdate, selectedPoints, onPointsSelected }) => {
  const handleChange = (field, value) => {
    onUpdate({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      {/* Campos comunes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-cartaai-white">Nombre</Label>
          <Input
            id="name"
            value={formData.coberturaLocalNombre}
            onChange={(e) => handleChange('coberturaLocalNombre', e.target.value)}
            className="glass-input text-cartaai-white"
            placeholder="Nombre de la zona"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cost" className="text-cartaai-white">Costo de envío</Label>
          <Input
            id="cost"
            type="number"
            value={formData.coberturaLocalCostoEnvio}
            onChange={(e) => handleChange('coberturaLocalCostoEnvio', e.target.value)}
            className="glass-input text-cartaai-white"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Nuevos campos agregados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minOrder" className="text-cartaai-white">Pedido mínimo</Label>
          <Input
            id="minOrder"
            type="number"
            value={formData.coberturaLocalPedidoMinimo}
            onChange={(e) => handleChange('coberturaLocalPedidoMinimo', e.target.value)}
            className="glass-input text-cartaai-white"
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedTime" className="text-cartaai-white">Tiempo estimado (min)</Label>
          <Input
            id="estimatedTime"
            type="number"
            value={formData.coberturaLocalTiempoEstimado}
            onChange={(e) => handleChange('coberturaLocalTiempoEstimado', e.target.value)}
            className="glass-input text-cartaai-white"
            placeholder="30"
            step="5"
          />
        </div>
      </div>

      {/* Mapa para dibujar polígonos */}
      <div className="space-y-2">
        <Label className="text-cartaai-white">Dibuja tu zona en el mapa</Label>
        <DrawZoneMap
          onPointsSelected={onPointsSelected}
          points={selectedPoints}
          savedZones={[]}
        />
      </div>

      {/* Campos adicionales específicos para mapeado */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baseRadius" className="text-cartaai-white">Radio base (KM)</Label>
          <Input
            id="baseRadius"
            type="number"
            value={formData.coberturaLocalRadioKmCobertura}
            onChange={(e) => handleChange('coberturaLocalRadioKmCobertura', e.target.value)}
            className="glass-input text-cartaai-white"
            placeholder="5"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scheduledCost" className="text-cartaai-white">Costo envío programado</Label>
          <Input
            id="scheduledCost"
            type="number"
            value={formData.coberturaLocalCostoEnvioProgramado}
            onChange={(e) => handleChange('coberturaLocalCostoEnvioProgramado', e.target.value)}
            className="glass-input text-cartaai-white"
            placeholder="0.00"
          />
        </div>
      </div> */}
    </div>
  );
};

export default MappedZoneForm; 