import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getApiUrls } from "@/config/api";

export const useTokenData = () => {
  const API_URLS = getApiUrls();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const { data: availableData } = useQuery({
    queryKey: ['token-data-options'],
    queryFn: async () => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/tokens-usage`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      
      const rawData = await response.json();
      
      if (rawData.type !== "1") {
        throw new Error(rawData.message || 'Error en la respuesta del servidor');
      }

      // Extract unique subdomains and localIds from the response
      const subdomains = new Set();
      const localIds = new Set();

      rawData.data.forEach(client => {
        subdomains.add(client.subDomain);
        localIds.add(client.localId);
      });

      return {
        subdomains: Array.from(subdomains),
        localIds: Array.from(localIds)
      };
    }
  });

  return {
    availableSubdomains: availableData?.subdomains || [],
    availableLocalIds: availableData?.localIds || []
  };
};
