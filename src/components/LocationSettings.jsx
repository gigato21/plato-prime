import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LocationSettings = ({ restaurantData, setRestaurantData }) => {
  const handleSelectChange = (name, value) => {
    setRestaurantData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="currency" className="dark:text-gray-200 text-gray-700">Moneda</Label>
        <Select
          value={restaurantData.currency || "Peso Mexicano - $ - MXN"}
          onValueChange={(value) => handleSelectChange('currency', value)}
        >
          <SelectTrigger className="bg-background text-foreground">
            <SelectValue placeholder="Selecciona una moneda" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground z-50">
            <SelectItem value="Peso Mexicano - $ - MXN">Peso Mexicano - $ - MXN</SelectItem>
            <SelectItem value="USD - $ - USD">Dólar - $ - USD</SelectItem>
            <SelectItem value="Euro - € - EUR">Euro - € - EUR</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSettings;