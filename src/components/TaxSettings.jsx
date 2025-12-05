import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TaxSettings = ({ taxData, setTaxData }) => {
  const handleSwitchChange = (field) => {
    setTaxData({
      ...taxData,
      [field]: taxData[field] === "1" ? "0" : "1"
    });
  };

  return (
    <Card className="bg-cartaai-black/50 p-6 rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold dark:text-gray-200 text-gray-700 border-b border-cartaai-white/10 pb-2">
          Configuración de Impuestos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Precios sin impuestos</Label>
          <Switch
            checked={taxData.configuracionPreciosProductosSinImpuesto === "1"}
            onCheckedChange={() => handleSwitchChange('configuracionPreciosProductosSinImpuesto')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Impuestos por modalidad</Label>
          <Switch
            checked={taxData.configuracionImpuestosPorModalidad === "1"}
            onCheckedChange={() => handleSwitchChange('configuracionImpuestosPorModalidad')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Inafecta venta</Label>
          <Switch
            checked={taxData.configuracionImpuestoInafectaVenta === "1"}
            onCheckedChange={() => handleSwitchChange('configuracionImpuestoInafectaVenta')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Inafecta costo de envío</Label>
          <Switch
            checked={taxData.configuracionImpuestoInafectaCostoEnvio === "1"}
            onCheckedChange={() => handleSwitchChange('configuracionImpuestoInafectaCostoEnvio')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxSettings;