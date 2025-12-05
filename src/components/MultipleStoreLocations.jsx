import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LeafletMap from './LeafletMap';
import { toast } from "sonner";

const MultipleStoreLocations = () => {
  const [stores, setStores] = useState([]);
  const [currentStore, setCurrentStore] = useState({ name: '', location: null, address: '' });

  const handleLocationSelect = async (newLocation) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.lat}&lon=${newLocation.lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      const address = data.display_name || `Lat: ${newLocation.lat.toFixed(6)}, Lng: ${newLocation.lng.toFixed(6)}`;
      setCurrentStore(prev => ({ ...prev, location: newLocation, address }));
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("No se pudo obtener la dirección");
    }
  };

  const handleAddStore = () => {
    if (currentStore.name && currentStore.location) {
      setStores([...stores, currentStore]);
      setCurrentStore({ name: '', location: null, address: '' });
      toast.success("Tienda añadida correctamente");
    } else {
      toast.error("Por favor, ingrese el nombre de la tienda y seleccione una ubicación");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-cartaai-white">Agregar Ubicaciones de Tiendas</h3>
      <div className="space-y-4">
        <Input
          placeholder="Nombre de la tienda"
          value={currentStore.name}
          onChange={(e) => setCurrentStore(prev => ({ ...prev, name: e.target.value }))}
          className="bg-cartaai-white/10 text-cartaai-white"
        />
        <LeafletMap 
          onLocationSelect={handleLocationSelect}
          selectedLocations={stores.map(store => store.location)}
        />
        <Input
          placeholder="Dirección de la tienda"
          value={currentStore.address}
          readOnly
          className="bg-cartaai-white/10 text-cartaai-white"
        />
        <Button onClick={handleAddStore} className="w-full bg-cartaai-red hover:bg-cartaai-red/80 text-white">
          Agregar Tienda
        </Button>
      </div>
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-cartaai-white">Tiendas Agregadas:</h4>
        {stores.map((store, index) => (
          <div key={index} className="bg-cartaai-white/10 p-2 rounded">
            <p className="text-cartaai-white">{store.name}: {store.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleStoreLocations;