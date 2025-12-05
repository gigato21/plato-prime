import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const CriticalConfigStep = ({ data, updateData }) => {
  const handleSwitchChange = (field) => {
    updateData({
      ...data,
      [field]: data[field] === "1" ? "0" : "1"
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-cartaai-white">
        Configuraciones Críticas
      </h2>

      <div className="glass-container p-6 space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-cartaai-white">Recojo en tienda</Label>
              <p className="text-sm text-cartaai-white/70">
                Permitir que los clientes recojan sus pedidos
              </p>
            </div>
            <Switch
              checked={data.localAceptaRecojo === "1"}
              onCheckedChange={() => handleSwitchChange('localAceptaRecojo')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base text-cartaai-white">Pagos en línea</Label>
              <p className="text-sm text-cartaai-white/70">
                Aceptar pagos en línea para los pedidos
              </p>
            </div>
            <Switch
              checked={data.localAceptaPagoEnLinea === "1"}
              onCheckedChange={() => handleSwitchChange('localAceptaPagoEnLinea')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalConfigStep;