import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Polygon, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AddressSearch from './delivery/AddressSearch';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapEvents = ({ onLocationSelect }) => {
  const map = useMap();
  
  useEffect(() => {
    if (onLocationSelect) {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lng });
      });

      return () => {
        map.off('click');
      };
    }
  }, [map, onLocationSelect]);

  return null;
};

const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  return null;
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

const LeafletMap = ({ 
  onLocationSelect, 
  restaurantLocation, 
  userLocation,
  selectedLocations = [],
  savedZones = [],
  showZoneNames = false,
  showKmRadius,
  kmRadius
}) => {
  const [mapCenter, setMapCenter] = useState(
    restaurantLocation || { lat: -12.0464, lng: -77.0428 }
  );

  const handleLocationFound = (location) => {
    setMapCenter(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const restaurantIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const userIcon = new L.DivIcon({
    className: 'user-location-marker',
    html: '<div class="pulse"></div>',
    iconSize: [20, 20],
  });

  const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="relative h-[400px] rounded-lg overflow-hidden">
      <SearchControl onLocationSelect={handleLocationFound} />
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={13}
        className="h-full w-full rounded-lg"
      >
        <MapController 
          center={[mapCenter.lat, mapCenter.lng]} 
          zoom={13}
        />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {restaurantLocation && (
          <Marker position={restaurantLocation} icon={restaurantIcon} />
        )}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon} />
        )}
        {selectedLocations.map((location, index) => (
          <Marker 
            key={`selected-${index}`}
            position={location}
            icon={selectedIcon}
          />
        ))}
        {selectedLocations.length >= 3 && (
          <Polygon 
            positions={selectedLocations}
            pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.2 }}
          />
        )}
        {savedZones.map((zone, index) => (
          <Polygon
            key={`saved-zone-${index}`}
            positions={zone.points}
            pathOptions={{ 
              color: `hsl(${(index * 137) % 360}, 70%, 50%)`,
              fillColor: `hsl(${(index * 137) % 360}, 70%, 50%)`,
              fillOpacity: 0.2 
            }}
          >
            {showZoneNames && zone.name && (
              <Tooltip permanent direction="center" className="my-labels" style={{ backgroundColor: `hsl(${(index * 137) % 360}, 70%, 50%)` }}>
                {zone.name}
              </Tooltip>
            )}
          </Polygon>
        ))}
        {onLocationSelect && <MapEvents onLocationSelect={onLocationSelect} />}
        <ZoomControl position="bottomright" className="zooms" />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;