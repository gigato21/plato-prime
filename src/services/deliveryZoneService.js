import { getApiUrls } from "@/config/api";

const API_URLS = getApiUrls();

export const fetchDeliveryZones = async (subDomain, localId) => {
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/coverage-zone/${subDomain}/${localId}`);
    
    if (!response.ok) {
      throw new Error('Error fetching delivery zones');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to fetch delivery zones');
  }
};

export const createDeliveryZone = async (subDomain, localId, zoneData, token) => {
  try {
    // Crear una copia del objeto y eliminar las propiedades no deseadas
    const {  ...cleanZoneData } = zoneData;

    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/coverage-zone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...cleanZoneData,
        subDomain,
        localId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Error creating delivery zone');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to create delivery zone');
  }
};

export const createMileageZone = async (zoneData, token) => {
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/coverage-zone/mileage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(zoneData),
    });
    
    if (!response.ok) {
      throw new Error('Error creating mileage zone');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to create mileage zone');
  }
};

export const updateDeliveryZone = async (zoneId, zoneData, token) => {
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/coverage-zone/${zoneId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(zoneData),
    });
    
    if (!response.ok) {
      throw new Error('Error updating delivery zone');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to update delivery zone');
  }
};

export const updateMileageZone = async (zoneId, zoneData, token) => {
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/coverage-zone/${zoneId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(zoneData),
    });
    
    if (!response.ok) {
      throw new Error('Error updating mileage zone');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error('Failed to update mileage zone');
  }
};

export const deleteDeliveryZone = async (zoneId, token) => {
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/coverage-zone/${zoneId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error deleting delivery zone');
    }
    
    return true;
  } catch (error) {
    throw new Error('Failed to delete delivery zone');
  }
};
