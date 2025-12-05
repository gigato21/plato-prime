import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import LeafletMap from '../LeafletMap';

const LocationSection = ({ data, updateData }) => {
  const handleLocationSelect = (location) => {
    updateData({
      ...data,
      localLatitud: location.lat.toString(),
      localLongitud: location.lng.toString()
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  const currentLocation = data.localLatitud && data.localLongitud
    ? { lat: parseFloat(data.localLatitud), lng: parseFloat(data.localLongitud) }
    : { lat: -5.1944900, lng: -80.6328200 };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="mb-3 sm:mb-4">
        <Label className="text-sm sm:text-base dark:text-gray-200 dark:text-gray-200 text-gray-700 mb-2 block">
          Selecciona la ubicación en el mapa
        </Label>
        <div className="h-[250px] sm:h-[300px] w-full rounded-lg overflow-hidden">
          <LeafletMap 
            onLocationSelect={handleLocationSelect}
            restaurantLocation={currentLocation}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="localDireccion" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
            Dirección
          </Label>
          <Input
            id="localDireccion"
            name="localDireccion"
            value={data.localDireccion || ''}
            onChange={handleChange}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
            placeholder="Ej: Av. Las Pizzas 123"
          />
        </div>

        <div>
          <Label htmlFor="localDepartamento" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
            Departamento
          </Label>
          <Input
            id="localDepartamento"
            name="localDepartamento"
            value={data.localDepartamento || ''}
            onChange={handleChange}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
            placeholder="Ej: Lima"
          />
        </div>

        <div>
          <Label htmlFor="localProvincia" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
            Provincia
          </Label>
          <Input
            id="localProvincia"
            name="localProvincia"
            value={data.localProvincia || ''}
            onChange={handleChange}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
            placeholder="Ej: Lima"
          />
        </div>

        <div>
          <Label htmlFor="localDistrito" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
            Distrito
          </Label>
          <Input
            id="localDistrito"
            name="localDistrito"
            value={data.localDistrito || ''}
            onChange={handleChange}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
            placeholder="Ej: Miraflores"
          />
        </div>

        <div>
          <Label htmlFor="localLatitud" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
            Latitud
          </Label>
          <Input
            id="localLatitud"
            name="localLatitud"
            value={data.localLatitud || ''}
            onChange={handleChange}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
            placeholder="-12.1192"
            readOnly
          />
        </div>

        <div>
          <Label htmlFor="localLongitud" className="text-sm sm:text-base dark:text-gray-200 text-gray-700">
            Longitud
          </Label>
          <Input
            id="localLongitud"
            name="localLongitud"
            value={data.localLongitud || ''}
            onChange={handleChange}
            className="glass-input text-cartaai-white mt-1 text-sm sm:text-base h-8 sm:h-10"
            placeholder="-77.0320"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default LocationSection;