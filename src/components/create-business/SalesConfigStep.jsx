import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import TaxSettings from '../TaxSettings';
import LocationSettings from '../LocationSettings';

const SalesConfigStep = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  const handleSwitchChange = (field) => {
    updateData({
      ...data,
      [field]: data[field] === "1" ? "0" : "1"
    });
  };

  const handleTaxDataChange = (taxData) => {
    updateData({ ...data, ...taxData });
  };

  const handleRestaurantDataChange = (restaurantData) => {
    updateData({ ...data, ...restaurantData });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold dark:text-gray-200 text-gray-700">Configuración de Ventas</h2>
      
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="localMontoMinimo" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
            Monto Mínimo de Pedido
          </Label>
          <Input
            id="localMontoMinimo"
            name="localMontoMinimo"
            type="number"
            step="0.01"
            value={data.localMontoMinimo || '30.00'}
            onChange={handleChange}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
          />
        </div>

        <div>
          <Label htmlFor="localPorcentajeImpuesto" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
            Porcentaje de Impuesto
          </Label>
          <Input
            id="localPorcentajeImpuesto"
            name="localPorcentajeImpuesto"
            type="number"
            step="0.01"
            value={data.localPorcentajeImpuesto || '18'}
            onChange={handleChange}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="dark:text-gray-200 text-gray-700">Carta Genérica</Label>
            <Switch
              checked={data.localCartaGenerica === "1"}
              onCheckedChange={() => handleSwitchChange('localCartaGenerica')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="dark:text-gray-200 text-gray-700">Permite Comprobante Menu Online</Label>
            <Switch
              checked={data.localPermiteComprobanteMenuOnline === "1"}
              onCheckedChange={() => handleSwitchChange('localPermiteComprobanteMenuOnline')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="dark:text-gray-200 text-gray-700">Precios sin Impuesto Aplica Nota Venta</Label>
            <Switch
              checked={data.configuracionPreciosProductosSinImpuestoAplicaNotaVenta === "1"}
              onCheckedChange={() => handleSwitchChange('configuracionPreciosProductosSinImpuestoAplicaNotaVenta')}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>
        </div>

        <LocationSettings 
          restaurantData={data} 
          setRestaurantData={handleRestaurantDataChange}
        />

        <TaxSettings 
          taxData={data}
          setTaxData={handleTaxDataChange}
        />
      </div>
    </div>
  );
};

export default SalesConfigStep;