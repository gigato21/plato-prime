import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

const AdvancedConfigStep = ({ data, updateData }) => {
  const handleChange = (field) => {
    updateData({
      ...data,
      [field]: data[field] === "1" ? "0" : "1"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-cartaai-black/50 border-cartaai-white/10">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Precios sin impuesto</Label>
              <p className="text-sm text-cartaai-white/70">Configurar precios de productos sin impuesto</p>
            </div>
            <Switch
              checked={data.configuracionPreciosProductosSinImpuesto === "1"}
              onCheckedChange={() => handleChange('configuracionPreciosProductosSinImpuesto')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Impuestos por modalidad</Label>
              <p className="text-sm text-cartaai-white/70">Configurar impuestos por modalidad de venta</p>
            </div>
            <Switch
              checked={data.configuracionImpuestosPorModalidad === "1"}
              onCheckedChange={() => handleChange('configuracionImpuestosPorModalidad')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Precios sin impuesto en nota de venta</Label>
              <p className="text-sm text-cartaai-white/70">Aplicar precios sin impuesto en notas de venta</p>
            </div>
            <Switch
              checked={data.configuracionPreciosProductosSinImpuestoAplicaNotaVenta === "1"}
              onCheckedChange={() => handleChange('configuracionPreciosProductosSinImpuestoAplicaNotaVenta')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Impuesto inafecto en venta</Label>
              <p className="text-sm text-cartaai-white/70">Configurar impuesto inafecto en ventas</p>
            </div>
            <Switch
              checked={data.configuracionImpuestoInafectaVenta === "1"}
              onCheckedChange={() => handleChange('configuracionImpuestoInafectaVenta')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Impuesto inafecto en costo de envío</Label>
              <p className="text-sm text-cartaai-white/70">Configurar impuesto inafecto en costos de envío</p>
            </div>
            <Switch
              checked={data.configuracionImpuestoInafectaCostoEnvio === "1"}
              onCheckedChange={() => handleChange('configuracionImpuestoInafectaCostoEnvio')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Marcas activas</Label>
              <p className="text-sm text-cartaai-white/70">Activar gestión de marcas</p>
            </div>
            <Switch
              checked={data.configuracionMarcasActiva === "1"}
              onCheckedChange={() => handleChange('configuracionMarcasActiva')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-cartaai-white">Marcas en menú en línea</Label>
              <p className="text-sm text-cartaai-white/70">Mostrar marcas en el menú en línea</p>
            </div>
            <Switch
              checked={data.configuracionMarcasMenuEnLineaActiva === "1"}
              onCheckedChange={() => handleChange('configuracionMarcasMenuEnLineaActiva')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedConfigStep;