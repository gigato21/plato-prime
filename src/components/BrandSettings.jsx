import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BrandSettings = ({ brandData, setBrandData }) => {
  const handleSwitchChange = (field) => {
    setBrandData({
      ...brandData,
      [field]: brandData[field] === "1" ? "0" : "1"
    });
  };

  return (
    <Card className="bg-cartaai-black/50 p-6 rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold dark:text-gray-200 text-gray-700 border-b border-cartaai-white/10 pb-2">
          Configuración de Marcas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Activar marcas</Label>
          <Switch
            checked={brandData.configuracionMarcasActiva === "1"}
            onCheckedChange={() => handleSwitchChange('configuracionMarcasActiva')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="dark:text-gray-200 text-gray-700">Mostrar marcas en menú en línea</Label>
          <Switch
            checked={brandData.configuracionMarcasMenuEnLineaActiva === "1"}
            onCheckedChange={() => handleSwitchChange('configuracionMarcasMenuEnLineaActiva')}
            className="data-[state=checked]:bg-cartaai-red"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandSettings;