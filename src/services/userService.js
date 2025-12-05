import { getApiUrls } from "@/config/api";

const API_URLS = getApiUrls();

export const updateUserData = async (accessToken) => {
  const userResponse = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const userResult = await userResponse.json();
  
  if (userResult.type === "1") {
    return {
      ...userResult.data,
      role: userResult.data.role.name,
      accessToken,
    };
  }
  
  throw new Error('Error al actualizar información del usuario');
};