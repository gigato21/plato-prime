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
          value={restaurantData.currency}
          onValueChange={(value) => handleSelectChange('currency', value)}
        >
          <SelectTrigger className="bg-background text-cartaai-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-cartaai-black text-cartaai-white">
            <SelectItem value="Sol - S/ - PEN">Sol - S/ - PEN</SelectItem>
            <SelectItem value="USD - $ - USD">USD - $ - USD</SelectItem>
            <SelectItem value="Euro - € - EUR">Euro - € - EUR</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LocationSettings;