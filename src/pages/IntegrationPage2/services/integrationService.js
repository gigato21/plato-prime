import { getApiUrls } from "@/config/api";

const API_URLS = getApiUrls();

export const fetchIntegrationData = async (subDomain, localId, token) => {
  try {
    const response = await fetch(
      `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/integration/${subDomain}/${localId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Datos de integración recibidos:', data);
    return data;
  } catch (error) {
    console.error('Error fetching integration data:', error);
    throw error;
  }
}; 