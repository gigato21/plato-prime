import { useState, useEffect } from 'react';
import { getApiUrls } from '@/config/api';

/**
 * Hook para obtener y cachear datos estáticos
 * @param {string} dataType - Tipo de datos a obtener (locations, categories, etc)
 * @param {object} options - Opciones adicionales (expiración de caché, etc)
 * @returns {object} - Datos, estado de carga y error
 */
export const useStaticData = (dataType, options = {}) => {
  const API_URLS = getApiUrls();
  
  // Valores por defecto
  const {
    cacheExpiration = 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    endpoint = null,
    forceRefresh = false,
    transform = data => data, // Función para transformar datos si es necesario
  } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Determinar el endpoint según el tipo de datos
  const getEndpoint = () => {
    if (endpoint) return endpoint;
    
    switch(dataType) {
      case 'locations':
        return `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/static/locations`;
    //   case 'categories':
    //     return `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/static/categories`;
    //   case 'paymentMethods':
    //     return `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/payment-methods`;
      // Puedes añadir más tipos según sea necesario
      default:
        throw new Error(`Tipo de datos '${dataType}' no soportado`);
    }
  };
  
  // Generar clave única para localStorage
  const getCacheKey = () => `static_data_${dataType}`;
  
  // Función para verificar si la caché ha expirado
  const isCacheExpired = (timestamp) => {
    return Date.now() - timestamp > cacheExpiration;
  };
  
  // Cargar datos del servidor
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener el endpoint según el tipo
      const url = getEndpoint();
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const rawData = await response.json();
      
      // Normalizar respuesta (asumimos que ya tiene el formato correcto o lo procesamos)
      const apiData = rawData.data || rawData;
      
      // Transformar datos si es necesario
      const transformedData = transform(apiData);
      
      // Guardar en caché con timestamp
      const cacheData = {
        timestamp: Date.now(),
        data: transformedData
      };
      
      localStorage.setItem(getCacheKey(), JSON.stringify(cacheData));
      
      setData(transformedData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
      console.error(`Error al cargar datos estáticos (${dataType}):`, err);
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar datos de caché o servidor
  const loadData = () => {
    try {
      // Si se fuerza la actualización, no intentar leer caché
      if (forceRefresh) {
        fetchData();
        return;
      }
      
      // Intentar leer de caché
      const cachedDataString = localStorage.getItem(getCacheKey());
      
      if (cachedDataString) {
        const cachedData = JSON.parse(cachedDataString);
        
        // Verificar si la caché ha expirado
        if (!isCacheExpired(cachedData.timestamp)) {
          setData(cachedData.data);
          setLoading(false);
          return;
        }
      }
      
      // Si no hay caché o ha expirado, cargar del servidor
      fetchData();
    } catch (err) {
      console.error('Error al cargar datos de caché:', err);
      fetchData(); // Si hay error leyendo caché, intentar desde servidor
    }
  };
  
  useEffect(() => {
    loadData();
  }, [dataType, forceRefresh]); // Recargar cuando cambie el tipo o se fuerce actualización
  
  // Función para refrescar manualmente los datos
  const refreshData = () => {
    fetchData();
  };
  
  return { data, loading, error, refreshData };
};
