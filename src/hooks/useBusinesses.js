import { useState } from 'react';
import { getApiUrls } from '@/config/api';
import { toast } from 'sonner';

export const useBusinesses = (accessToken) => {
  const API_URLS = getApiUrls();
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState(null);

  const fetchUserBusinesses = async (userId) => {
    setIsLoading(true);
    try {
      const userResponse = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      const userResult = await userResponse.json();
      
      if (userResult.type === "1") {
        const userData = userResult.data;
        
        const businessResponse = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-business/get-by-user-id/${userData._id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        const businessResult = await businessResponse.json();
        setBusinesses({
          user: userData,
          businesses: businessResult || []
        });
      } else {
        toast.error('Error al obtener información del usuario');
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Error al obtener los negocios');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    businesses,
    fetchUserBusinesses
  };
};