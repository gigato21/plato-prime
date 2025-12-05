import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ZONE_TYPES } from "@/constants/deliveryZones";
const SimpleZoneForm = ({ formData, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
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
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="freeDelivery"
          checked={formData.coberturaLocalPermiteEnvioGratis === "1"}
          onCheckedChange={(checked) => handleChange('coberturaLocalPermiteEnvioGratis', checked ? "1" : "0")}
        />
        <Label htmlFor="freeDelivery" className="text-cartaai-white">Permitir envío gratis</Label>
      </div>

      {formData.coberturaLocalPermiteEnvioGratis === "1" && (
        <div className="space-y-2">
          <Label htmlFor="minFreeDelivery" className="text-cartaai-white">Monto mínimo para envío gratis</Label>
          <Input
            id="minFreeDelivery"
            type="number"
            value={formData.coberturaLocalMinimoParaEnvioGratis}
            onChange={(e) => handleChange('coberturaLocalMinimoParaEnvioGratis', e.target.value)}
            className="glass-input text-cartaai-white"
            placeholder="0.00"
          />
        </div>
      )}
    </div>
  );
};

export default SimpleZoneForm; 