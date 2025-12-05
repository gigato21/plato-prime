import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LeafletMap from '../components/LeafletMap';
import { toast } from "sonner";
import { MapPin, Save } from "lucide-react";
import { useSelector } from 'react-redux';
import { getApiUrls } from '@/config/api';
import { useLocationCascade } from '@/hooks/useLocationData';

const Location = () => {
  const API_URLS = getApiUrls();
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    regions,
    provinces,
    districts,
    selectedRegion,
    selectedProvince,
    selectedDistrict,
    handleRegionChange,
    handleProvinceChange,
    handleDistrictChange,
    setLocation,
    loading: loadingLocations
  } = useLocationCascade();
  
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);

  // Cargar datos iniciales del restaurante
  useEffect(() => {
    if (subDomain && localId) {
      fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/?subDomain=${subDomain}&localId=${localId}`)
        .then(response => response.json())
        .then(data => {
          if (data.data.localLatitud && data.data.localLongitud) {
            setRestaurantLocation({
              lat: parseFloat(data.data.localLatitud),
              lng: parseFloat(data.data.localLongitud)
            });
          } else {
            // Ubicación por defecto (Piura)
            setRestaurantLocation({ lat: -5.1944900, lng: -80.6328200 });
          }
          setAddress(data.data.localDireccion || '');
          
          // Usar setLocation para establecer la ubicación de una vez
          if (data.data.localDepartamento || data.data.localProvincia || data.data.localDistrito) {
            setLocation(
              data.data.localDepartamento || '',
              data.data.localProvincia || '',
              data.data.localDistrito || ''
            );
          }
        })
        .catch(error => {
          console.error('Error al cargar la ubicación:', error);
          toast.error('Error al cargar la ubicación del restaurante');
          // Ubicación por defecto en caso de error
          setRestaurantLocation({ lat: -5.1944900, lng: -80.6328200 });
        });
    }
  }, [subDomain, localId, setLocation]);

  const handleLocationSelect = async (newLocation) => {
    setIsLoading(true);
    setRestaurantLocation(newLocation);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.lat}&lon=${newLocation.lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      if (data.display_name) {
        setAddress(data.display_name);
        
        // Intentar extraer información y usar setLocation para actualizar todo junto
        if (data.address) {
          const newDepartamento = data.address.state || data.address.region || '';
          const newProvincia = data.address.city || data.address.town || data.address.county || '';
          const newDistrito = data.address.suburb || data.address.neighbourhood || data.address.district || '';
          
          setLocation(newDepartamento, newProvincia, newDistrito);
        }
      } else {
        setAddress(`Lat: ${newLocation.lat.toFixed(6)}, Lng: ${newLocation.lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress(`Lat: ${newLocation.lat.toFixed(6)}, Lng: ${newLocation.lng.toFixed(6)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    console.log("handleSave llamado", new Date().toISOString()); // Log para depuración
    
    // Prevenir múltiples llamadas simultáneas
    if (isSaving) {
      console.log("Ya hay un guardado en progreso, ignorando");
      return;
    }
    
    if (!subDomain || !localId || !restaurantLocation) {
      toast.error("Información incompleta para guardar");
      return;
    }

    try {
      setIsSaving(true); // Activar bloqueo
      
      const formData = new FormData();
      
      const mappedData = {
        localDireccion: address,
        localLatitud: restaurantLocation.lat.toString(),
        localLongitud: restaurantLocation.lng.toString(),
        localDepartamento: selectedRegion,
        localProvincia: selectedProvince,
        localDistrito: selectedDistrict
      };

      formData.append('data', JSON.stringify(mappedData));

      console.log("Enviando request de guardado:", mappedData);
      
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/update/${subDomain}/${localId}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al guardar la ubicación');
      }

      toast.success('Ubicación guardada correctamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la ubicación');
    } finally {
      setIsSaving(false); // Desactivar bloqueo al finalizar
    }
  };

  if (!restaurantLocation || loadingLocations) {
    return <div>Cargando...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-cartaai-black/30 p-2 rounded-lg backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle className="text-cartaai-white flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Ubicación del restaurante</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <LeafletMap 
              onLocationSelect={handleLocationSelect} 
              restaurantLocation={restaurantLocation}
            />
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            {/* Sección de dirección principal */}
            <div className="space-y-2">
              <h3 className="text-cartaai-white text-sm font-medium">Dirección completa</h3>
              <div className="relative">
                <Input
                  placeholder="Dirección del restaurante"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-transparent text-cartaai-white pr-10
                            border-cartaai-white/30 focus:border-cartaai-red/70
                            transition-all duration-200 placeholder:text-cartaai-white/50"
                />
                {isLoading && (
                  <motion.div 
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-4 h-4 border-2 border-cartaai-red/30 border-t-cartaai-red rounded-full" />
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-cartaai-white/60">
                Selecciona un punto en el mapa o ingresa manualmente la dirección completa
              </p>
            </div>
            
            {/* Sección de división administrativa usando los selectores en cascada */}
            <div className="space-y-2">
              <h3 className="text-cartaai-white text-sm font-medium">División administrativa</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-cartaai-white/80">Región/Departamento</label>
                  <select 
                    value={selectedRegion}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full rounded-md bg-cartaai-black text-cartaai-white
                              border-cartaai-white/30 focus:border-cartaai-red/70
                              transition-all duration-200 h-10 px-3"
                  >
                    <option value="">Selecciona una región</option>
                    {regions.map(region => (
                      <option key={region.name} value={region.name}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-cartaai-white/80">Provincia</label>
                  <select 
                    value={selectedProvince}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    disabled={!selectedRegion || provinces.length === 0}
                    className="w-full rounded-md bg-cartaai-black text-cartaai-white
                              border-cartaai-white/30 focus:border-cartaai-red/70
                              transition-all duration-200 disabled:opacity-50 h-10 px-3"
                  >
                    <option value="">Selecciona una provincia</option>
                    {provinces.map(province => (
                      <option key={province.name} value={province.name}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs text-cartaai-white/80">Distrito</label>
                  <select 
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    disabled={!selectedProvince || districts.length === 0}
                    className="w-full rounded-md bg-cartaai-black text-cartaai-white
                              border-cartaai-white/30 focus:border-cartaai-red/70
                              transition-all duration-200 disabled:opacity-50 h-10 px-3"
                  >
                    <option value="">Selecciona un distrito</option>
                    {districts.map(district => (
                      <option key={district.name} value={district.name}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-xs text-cartaai-white/60">
                Estos campos se completan automáticamente según la ubicación seleccionada en el mapa
              </p>
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full bg-cartaai-red hover:bg-cartaai-red/80 text-white
                        transition-all duration-200 transform hover:scale-[1.02]
                        active:scale-[0.98] mt-4"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Ubicación
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Location;