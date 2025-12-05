// src/hooks/useLocationData.js

import { useState, useEffect, useCallback } from 'react';
import { useStaticData } from './useStaticData';

/**
 * Hook especializado para manejar datos de ubicación en cascada
 * @returns {Object} Datos y funciones para gestionar selecciones de ubicación
 */
export const useLocationCascade = () => {
  // Estado para las selecciones actuales
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  // Cargar todas las regiones usando el hook genérico
  const { 
    data: allRegions, 
    loading: loadingRegions, 
    error: errorRegions,
    refreshData: refreshRegions
  } = useStaticData('locations');
  
  // Estados derivados
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  // Actualizar provincias cuando cambia la región seleccionada
  useEffect(() => {
    if (!allRegions || !selectedRegion) {
      setProvinces([]);
      setSelectedProvince('');
      return;
    }
    
    const region = allRegions.find(r => r.name === selectedRegion);
    if (region && region.provinces) {
      setProvinces(region.provinces);
    } else {
      setProvinces([]);
    }
    
    // Resetear selección de provincia y distrito
    setSelectedProvince('');
    setSelectedDistrict('');
  }, [selectedRegion, allRegions]);
  
  // Actualizar distritos cuando cambia la provincia seleccionada
  useEffect(() => {
    if (!provinces || !selectedProvince) {
      setDistricts([]);
      return;
    }
    
    const province = provinces.find(p => p.name === selectedProvince);
    if (province && province.districts) {
      setDistricts(province.districts);
      
      // En lugar de resetear, verificar si el distrito sigue siendo válido
      if (selectedDistrict) {
        const isValidDistrict = province.districts.some(
          d => d.name === selectedDistrict
        );
        
        // Solo resetear si el distrito ya no es válido en la nueva provincia
        if (!isValidDistrict) {
          console.log("Distrito no válido para la nueva provincia, reseteando");
          setSelectedDistrict('');
        }
      }
    } else {
      setDistricts([]);
    }
  }, [selectedProvince, provinces, selectedDistrict]);
  
  // Manejadores para cambios en selecciones
  const handleRegionChange = useCallback((regionName) => {
    setSelectedRegion(regionName);
  }, []);
  
  const handleProvinceChange = useCallback((provinceName) => {
    setSelectedProvince(provinceName);
  }, []);
  
  const handleDistrictChange = useCallback((districtName) => {
    setSelectedDistrict(districtName);
  }, []);
  
  // Función para establecer una ubicación completa de una vez
  const setLocation = useCallback((region, province, district) => {
    // console.log("setLocation llamado con:", { region, province, district });
    
    // Guardar distrito para aplicarlo después
    const districtToSet = district;
    
    // Primero establecer región
    setSelectedRegion(region || '');
    
    // Asíncrono - encontrar y establecer provincia
    if (allRegions?.length > 0 && region) {
      const regionObj = allRegions.find(r => 
        r.name.toLowerCase() === region.toLowerCase()
      );
      
      if (regionObj?.provinces) {
        setProvinces(regionObj.provinces);
        setSelectedProvince(province || '');
        
        // Si hay distrito, esperar al siguiente ciclo para establecerlo
        if (districtToSet && province) {
          setTimeout(() => {
            const provinceObj = regionObj.provinces.find(p => 
              p.name.toLowerCase() === province.toLowerCase()
            );
            
            if (provinceObj?.districts) {
              const districtObj = provinceObj.districts.find(d => 
                d.name.toLowerCase() === districtToSet.toLowerCase()
              );
              
              if (districtObj) {
                // console.log("Estableciendo distrito con retraso:", districtObj.name);
                setSelectedDistrict(districtObj.name);
              }
            }
          }, 0);
        }
      }
    }
  }, [allRegions]);
  
  return {
    // Datos
    regions: allRegions || [],
    provinces,
    districts,
    
    // Selecciones actuales
    selectedRegion,
    selectedProvince,
    selectedDistrict,
    
    // Manejadores
    handleRegionChange,
    handleProvinceChange,
    handleDistrictChange,
    setLocation,
    
    // Estados
    loading: loadingRegions,
    error: errorRegions,
    
    // Acciones
    refresh: refreshRegions
  };
};