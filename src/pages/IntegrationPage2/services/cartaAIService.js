import { getApiUrls } from "@/config/api";

const API_URLS = getApiUrls();

export const fetchCartaAIData = async (subDomain, token) => {

  try {
    const response = await fetch(
      `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/v2/integration/${subDomain}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const parsedData = await response.json();
    console.log('Datos recibidos de CARTAAI:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error fetching CARTAAI data:', error);
    throw error;
  }
}; 