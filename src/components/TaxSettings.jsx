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
          Configuración de IVA
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          En México el IVA general es del 16%. Configura cómo se aplica a tus productos.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="dark:text-gray-200 text-gray-700">Precios sin IVA</Label>
            <p className="text-xs text-muted-foreground">Los precios mostrados no incluyen IVA</p>
          </div>
          <Switch
            checked={taxData.configuracionPreciosProductosSinImpuesto === "1"}
            onCheckedChange={() => handleSwitchChange('configuracionPreciosProductosSinImpuesto')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="dark:text-gray-200 text-gray-700">IVA por modalidad</Label>
            <p className="text-xs text-muted-foreground">Aplica IVA diferente según delivery o en local</p>
          </div>
          <Switch
            checked={taxData.configuracionImpuestosPorModalidad === "1"}
            onCheckedChange={() => handleSwitchChange('configuracionImpuestosPorModalidad')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="dark:text-gray-200 text-gray-700">Venta exenta de IVA</Label>
            <p className="text-xs text-muted-foreground">Productos con tasa 0% de IVA</p>
          </div>
          <Switch
            checked={taxData.configuracionImpuestoInafectaVenta === "1"}
            onCheckedChange={() => handleSwitchChange('configuracionImpuestoInafectaVenta')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label className="dark:text-gray-200 text-gray-700">Envío exento de IVA</Label>
            <p className="text-xs text-muted-foreground">El costo de envío no incluye IVA</p>
          </div>
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