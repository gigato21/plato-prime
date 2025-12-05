import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, Marker } from 'react-leaflet';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import L from 'leaflet';
import AddressSearch from './AddressSearch';

const DrawZoneMap = ({ onPointsSelected, points = [], savedZones = [] }) => {
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isZoneSaved, setIsZoneSaved] = useState(false);
  const [mapCenter, setMapCenter] = useState([-12.0464, -77.0428]);

  useEffect(() => {
    if (points.length > 0) {
      const formattedPoints = points
        .map(point => {
          if (Array.isArray(point)) {
            return [Number(point[0]), Number(point[1])];
          }
          // Validar y convertir a números
          const lat = parseFloat(point.latitude);
          const lng = parseFloat(point.longitude);
          return !isNaN(lat) && !isNaN(lng) ? [lat, lng] : null;
        })
        .filter(point => point !== null); // Filtrar puntos inválidos

      setSelectedPoints(formattedPoints);
      setMarkers(formattedPoints.map(([lat, lng]) => ({ 
        latitude: lat, 
        longitude: lng 
      })));
    }
  }, [points]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (!isDragging) {
          const { lat, lng } = e.latlng;
          const newPoint = [lat, lng];
          setSelectedPoints(current => [...current, newPoint]);
          setMarkers(current => [...current, {
            id: current.length + 1,
            latitude: lat,
            longitude: lng
          }]);
        }
      }
    });
    return null;
  };

  const handleReset = () => {
    setSelectedPoints([]);
    setMarkers([]);
    setIsZoneSaved(false);
    onPointsSelected([]);
    toast.info("Puntos reiniciados");
  };

  const handleComplete = () => {
    if (markers.length < 3) {
      toast.error("Se necesitan al menos 3 puntos para crear una zona");
      return;
    }
    setIsZoneSaved(true);
    onPointsSelected(markers);
  };

  const handleMarkerDrag = (index, e) => {
    const { lat, lng } = e.target.getLatLng();
    
    const newMarkers = [...markers];
    newMarkers[index] = {
      ...newMarkers[index],
      latitude: lat,
      longitude: lng
    };
    setMarkers(newMarkers);
    
    const newPoints = [...selectedPoints];
    newPoints[index] = [lat, lng];
    setSelectedPoints(newPoints);

    setIsDragging(false);
  };

  const handleLocationFound = (location) => {
    setMapCenter([location.lat, location.lng]);
  };

  const SearchControl = ({ onLocationSelect }) => {
    return (
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[70%] z-[1000]">
        <div className="glass-container bg-cartaai-black/80 p-1 rounded-lg">
          <AddressSearch onLocationSelect={onLocationSelect} />
        </div>
      </div>
    );
  };

  const customIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] rounded-lg overflow-hidden">
        <SearchControl onLocationSelect={handleLocationFound} />
        <MapContainer
          center={mapCenter}
          zoom={13}
          className="h-full w-full rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler />
          
          {/* Display existing zones */}
          {savedZones.map((zone, index) => (
            <Polygon
              key={`saved-zone-${index}`}
              positions={zone.points}
              pathOptions={{ 
                color: `hsl(${(index * 137) % 360}, 70%, 50%)`,
                fillColor: `hsl(${(index * 137) % 360}, 70%, 50%)`,
                fillOpacity: 0.2 
              }}
            />
          ))}

          {/* Display current markers */}
          {markers.map((marker, index) => (
            <Marker
              key={`${index}-${marker.latitude}-${marker.longitude}`}
              position={[Number(marker.latitude), Number(marker.longitude)]}
              icon={customIcon}
              draggable={true}
              eventHandlers={{
                dragstart: () => setIsDragging(true),
                dragend: (e) => handleMarkerDrag(index, e),
                click: () => setIsDragging(true)
              }}
            />
          ))}

          {/* Display current polygon */}
          {selectedPoints.length >= 3 && (
            <Polygon
              positions={selectedPoints}
              pathOptions={{ 
                color: isZoneSaved ? '#4CAF50' : 'red', 
                fillColor: isZoneSaved ? '#4CAF50' : 'red', 
                fillOpacity: 0.2 
              }}
            />
          )}
        </MapContainer>
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          onClick={handleReset}
          variant="outline"
          className="bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20"
        >
          Reiniciar puntos
        </Button>
        <Button
          onClick={handleComplete}
          className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          disabled={markers.length < 3}
        >
          Completar zona
        </Button>
      </div>
      <p className="text-sm text-cartaai-white/70">
        Puntos seleccionados: {markers.length} (mínimo 3)
      </p>
    </div>
  );
};

export default DrawZoneMap;