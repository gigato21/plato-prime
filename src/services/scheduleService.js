import { getApiUrls } from "@/config/api";

const API_URLS = getApiUrls();

export const updateSchedule = async (subDomain, localId, scheduleData, accessToken) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/update/${subDomain}/${localId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(scheduleData)
  });

  if (!response.ok) {
    throw new Error('Error updating schedule');
  }

  return await response.json();
};