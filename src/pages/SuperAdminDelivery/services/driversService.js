import { getApiUrls } from "@/config/api";

const { SERVICIOS_GENERALES_URL } = getApiUrls();

export const createDriver = async (driverData) => {
  try {
    const response = await fetch(`${SERVICIOS_GENERALES_URL}/api/v1/delivery/drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(driverData)
    });

    if (!response.ok) {
      throw new Error('Error en la petición');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getDrivers = async () => {
  try {
    const response = await fetch(`${SERVICIOS_GENERALES_URL}/api/v1/delivery/drivers`);
    
    if (!response.ok) {
      throw new Error('Error en la petición');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const updateDriver = async (id, driverData) => {
  try {
    const response = await fetch(`${SERVICIOS_GENERALES_URL}/api/v1/delivery/drivers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(driverData)
    });

    if (!response.ok) {
      throw new Error('Error en la petición');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteDriver = async (id) => {
  try {
    const response = await fetch(`${SERVICIOS_GENERALES_URL}/api/v1/delivery/drivers/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Error al eliminar conductor');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}; 