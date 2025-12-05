import { getApiUrls } from "@/config/api";

const API_URLS = getApiUrls();

export const fetchWorkingHours = async (subDomain, localId) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/working-hours/${subDomain}/${localId}`);
  
  if (!response.ok) {
    throw new Error('Error fetching working hours');
  }

  const data = await response.json();
  return data.data;
};

export const updateWorkingHours = async (subDomain, localId, workingHoursData, accessToken) => {
  
  const response = await fetch(
    `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/working-hours/${subDomain}/${localId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(workingHoursData),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error response:', errorData);
    throw new Error('Error updating working hours');
  }

  return await response.json();
};