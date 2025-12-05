import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LeafletMap from '../LeafletMap';

const LocationStep = ({ data, updateData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateData({ ...data, [name]: value });
  };

  const handleLocationSelect = (location) => {
    updateData({ 
      ...data, 
      latitude: location.lat, 
      longitude: location.lng 
    });
  };

  const restaurantLocation = data.latitude && data.longitude 
    ? { lat: data.latitude, lng: data.longitude }
    : { lat: -5.1944900, lng: -80.6328200 }; // Ubicación por defecto en Piura

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="address" className="text-cartaai-white">
          Dirección
        </Label>
        <Input
          id="address"
          name="address"
          value={data.address || ''}
          onChange={handleChange}
          className="bg-cartaai-white/10 text-cartaai-white mt-1"
          placeholder="Ingresa la dirección de tu negocio"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-cartaai-white">
          Teléfono
        </Label>
        <Input
          id="phone"
          name="phone"
          value={data.phone || ''}
          onChange={handleChange}
          className="bg-cartaai-white/10 text-cartaai-white mt-1"
          placeholder="Ingresa el teléfono de contacto"
        />
      </div>

      <div>
        <Label className="text-cartaai-white mb-2 block">
          Ubicación en el Mapa
        </Label>
        <div className="h-[400px] w-full rounded-lg overflow-hidden">
          <LeafletMap 
            onLocationSelect={handleLocationSelect}
            restaurantLocation={restaurantLocation}
          />
        </div>
      </div>

      {data.latitude && data.longitude && (
        <div className="text-sm text-cartaai-white/70">
          Ubicación seleccionada: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default LocationStep;