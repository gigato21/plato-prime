import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import AddressSearch from './AddressSearch';

const SinglePointMap = ({ initialLocation, onLocationSelect }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const mapRef = useRef(null);
    
    // Centro por defecto basado en initialLocation o Lima
    const defaultCenter = initialLocation?.latitude && initialLocation?.longitude 
      ? [
          parseFloat(initialLocation.latitude) || -12.0464,
          parseFloat(initialLocation.longitude) || -77.0428
        ] 
      : [-12.0464, -77.0428];

    useEffect(() => {
      if (initialLocation?.latitude && initialLocation?.longitude) {
        const lat = parseFloat(initialLocation.latitude);
        const lng = parseFloat(initialLocation.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          setSelectedLocation({ lat, lng });
          mapRef.current?.flyTo([lat, lng], 15);
          return;
        }
      }
      setSelectedLocation({ lat: defaultCenter[0], lng: defaultCenter[1] });
    }, [initialLocation]);

    const MapEvents = () => {
      useMapEvents({
        click: (e) => {
          const { lat, lng } = e.latlng;
          const fixedLat = Number(lat.toFixed(6));
          const fixedLng = Number(lng.toFixed(6));
          setSelectedLocation({ lat: fixedLat, lng: fixedLng });
          onLocationSelect({ lat: fixedLat, lng: fixedLng });
          mapRef.current?.flyTo([fixedLat, fixedLng], 15);
        }
      });
      return null;
    };

    const handleLocationSelect = (location) => {
      setSelectedLocation(location);
      onLocationSelect(location);
      mapRef.current?.flyTo([location.lat, location.lng], 15);
    };

    return (
      <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] w-[80%] max-w-[600px]">
          <div className="glass-container bg-cartaai-black/80 p-2 rounded-lg shadow-lg">
            <AddressSearch
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>
        <MapContainer
          ref={mapRef}
          center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : defaultCenter}
          zoom={13}
          className="h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {selectedLocation && (
            <Marker position={[
              Number(selectedLocation.lat.toFixed(6)), 
              Number(selectedLocation.lng.toFixed(6))
            ]} />
          )}
          <ZoomControl 
            position="bottomright" 
            className="!text-black" 
          />
          <MapEvents />
        </MapContainer>
      </div>
    );
};

export default SinglePointMap; 