import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const MercadoPagoConfig = ({ mercadoPagoData, setMercadoPagoData }) => {
  const handleSwitchChange = (checked) => {
    setMercadoPagoData(prev => ({ ...prev, enabled: checked }));
  };

  const handleInputChange = (e) => {
    setMercadoPagoData(prev => ({ ...prev, accessToken: e.target.value }));
  };

  return (
    <div className="space-y-6 bg-cartaai-black/50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-cartaai-white border-b border-cartaai-white/10 pb-2">Configuración de Mercado Pago</h2>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="mercadopago-enabled"
          checked={mercadoPagoData.enabled}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="mercadopago-enabled" className="text-cartaai-white">
          Habilita Mercadopago para pagos al realizar tu pedido
        </Label>
      </div>

      <div>
        <Label htmlFor="mercadopago-token" className="text-cartaai-white">Mercadopago access token</Label>
        <Input
          id="mercadopago-token"
          type="text"
          value={mercadoPagoData.accessToken}
          onChange={handleInputChange}
          className="bg-cartaai-white/10 text-cartaai-white mt-1"
          placeholder="Ingresa tu access token de Mercadopago"
        />
      </div>
    </div>
  );
};

export default MercadoPagoConfig;