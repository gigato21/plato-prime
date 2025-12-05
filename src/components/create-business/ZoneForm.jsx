
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ZoneForm = ({ 
  currentZone, 
  onInputChange, 
  onFreeDeliveryToggle, 
  onSaveZone, 
  onReset,

}) => {
  return (
    <Card className="glass-container">
      <CardHeader>
        <CardTitle className="dark:text-gray-200 text-gray-700">Nueva Zona de Cobertura</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="zoneName" className="dark:text-gray-200 text-gray-700">
              Nombre de la zona
            </Label>
            <Input
              id="zoneName"
              name="coberturaLocalNombre"
              value={currentZone.coberturaLocalNombre}
              onChange={onInputChange}
              placeholder="Ej: Zona Centro"
              className="glass-input dark:text-gray-200 text-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryCost" className="dark:text-gray-200 text-gray-700">
              Costo de envío
            </Label>
            <Input
              id="deliveryCost"
              name="coberturaLocalCostoEnvio"
              type="number"
              value={currentZone.coberturaLocalCostoEnvio}
              onChange={onInputChange}
              placeholder="Ej: 5.00"
              className="glass-input dark:text-gray-200 text-gray-700"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="freeDelivery"
            checked={currentZone.coberturaLocalPermiteEnvioGratis === '1'}
            onCheckedChange={onFreeDeliveryToggle}
          />
          <Label htmlFor="freeDelivery" className="dark:text-gray-200 text-gray-700">
            Permitir envío gratis
          </Label>
        </div>

        {currentZone.coberturaLocalPermiteEnvioGratis === '1' && (
          <div className="space-y-2">
            <Label htmlFor="minFreeDelivery" className="dark:text-gray-200 text-gray-700">
              Monto mínimo para envío gratis
            </Label>
            <Input
              id="minFreeDelivery"
              name="coberturaLocalMinimoParaEnvioGratis"
              type="number"
              value={currentZone.coberturaLocalMinimoParaEnvioGratis}
              onChange={onInputChange}
              placeholder="Ej: 80.00"
              className="glass-input dark:text-gray-200 text-gray-700"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={onReset}
            variant="outline" 
            className="bg-cartaai-white/10 dark:text-gray-200 text-gray-700 hover:bg-cartaai-white/20"
          >
            Reiniciar puntos
          </Button>
          <Button 
            onClick={onSaveZone}
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          >
            Guardar zona
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoneForm;