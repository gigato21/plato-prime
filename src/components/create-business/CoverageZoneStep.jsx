import React, { useState } from 'react';
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import LeafletMap from '../LeafletMap';
import ZoneForm from './ZoneForm';
import SavedZonesList from './SavedZonesList';

const CoverageZoneStep = ({ data, updateData }) => {
  const [currentZone, setCurrentZone] = useState({
    coberturaLocalNombre: '',
    coberturaLocalCostoEnvio: '',
    coberturaLocalRuta: [],
    coberturaLocalMinimoParaEnvioGratis: '',
    coberturaLocalPermiteEnvioGratis: '0'
  });
  const [selectedPoints, setSelectedPoints] = useState([]);

  const handleLocationSelect = (location) => {
    if (selectedPoints.length >= 3) {
      toast.error("Ya has seleccionado 3 puntos. Guarda la zona o reinicia.");
      return;
    }
    setSelectedPoints([...selectedPoints, location]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentZone(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFreeDeliveryToggle = (checked) => {
    setCurrentZone(prev => ({
      ...prev,
      coberturaLocalPermiteEnvioGratis: checked ? '1' : '0'
    }));
  };

  const handleSaveZone = () => {
    if (selectedPoints.length !== 3) {
      toast.error("Debes seleccionar exactamente 3 puntos en el mapa");
      return;
    }

    if (!currentZone.coberturaLocalNombre || !currentZone.coberturaLocalCostoEnvio) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    const newZone = {
      ...currentZone,
      coberturaLocalId: Date.now().toString(),
      coberturaLocalEstado: "1",
      coberturaLocalRuta: selectedPoints.map(point => ({
        latitude: point.lat,
        longitude: point.lng
      }))
    };

    const updatedZonas = [...(data.zonaCobertura || []), newZone];
    updateData({ ...data, zonaCobertura: updatedZonas });
    
    setCurrentZone({
      coberturaLocalNombre: '',
      coberturaLocalCostoEnvio: '',
      coberturaLocalRuta: [],
      coberturaLocalMinimoParaEnvioGratis: '',
      coberturaLocalPermiteEnvioGratis: '0'
    });
    setSelectedPoints([]);
    toast.success("Zona de cobertura agregada exitosamente");
  };

  const handleReset = () => {
    setSelectedPoints([]);
    toast.info("Puntos reiniciados");
  };

  // Convert saved zones to map points format
  const savedZonesPoints = data.zonaCobertura?.map(zone => 
    zone.coberturaLocalRuta.map(point => ({
      lat: point.latitude,
      lng: point.longitude
    }))
  ) || [];

  return (
    <div className="space-y-6">
      <ZoneForm
        currentZone={currentZone}
        onInputChange={handleInputChange}
        onFreeDeliveryToggle={handleFreeDeliveryToggle}
        onSaveZone={handleSaveZone}
        onReset={handleReset}
        selectedPoints={selectedPoints}
      />

      <div className="space-y-2">
        <Label className="text-cartaai-white">
          Selecciona 3 puntos en el mapa para definir la zona ({selectedPoints.length}/3)
        </Label>
        <div className="h-[400px] w-full rounded-lg overflow-hidden">
          <LeafletMap
            onLocationSelect={handleLocationSelect}
            selectedLocations={selectedPoints}
            savedZones={savedZonesPoints}
          />
        </div>
      </div>

      <SavedZonesList zones={data.zonaCobertura} />
    </div>
  );
};

export default CoverageZoneStep;