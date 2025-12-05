import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const DeliveryConfigStep = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-cartaai-black/50 border-cartaai-white/10">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Delivery</Label>
              <p className="text-sm text-cartaai-white/70">Habilitar servicio de entrega a domicilio</p>
            </div>
            <Switch
              checked={data.deliveryEnabled || false}
              onCheckedChange={(checked) => handleChange('deliveryEnabled', checked)}
            />
          </div>

          {data.deliveryEnabled && (
            <div>
              <Label htmlFor="deliveryFee" className="text-cartaai-white">
                Costo de envío base
              </Label>
              <Input
                id="deliveryFee"
                type="number"
                value={data.deliveryFee || ''}
                onChange={(e) => handleChange('deliveryFee', e.target.value)}
                className="bg-cartaai-white/10 text-cartaai-white mt-1"
                placeholder="0.00"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-cartaai-black/50 border-cartaai-white/10">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Recojo en tienda</Label>
              <p className="text-sm text-cartaai-white/70">Permitir que los clientes recojan sus pedidos</p>
            </div>
            <Switch
              checked={data.pickupEnabled || false}
              onCheckedChange={(checked) => handleChange('pickupEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-cartaai-black/50 border-cartaai-white/10">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Consumo en local</Label>
              <p className="text-sm text-cartaai-white/70">Permitir pedidos para consumo en el local</p>
            </div>
            <Switch
              checked={data.dineInEnabled || false}
              onCheckedChange={(checked) => handleChange('dineInEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryConfigStep;