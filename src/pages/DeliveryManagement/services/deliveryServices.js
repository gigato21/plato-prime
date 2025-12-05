import { getApiUrls } from '@/config/api';

const API_URLS = getApiUrls();
const BASE_URL = `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/delivery`;

// EMPRESAS DE DELIVERY
export const fetchCompanies = async (subDomain, localId) => {
  // Si tenemos subDomain y localId, obtenemos las empresas del restaurante específico
  let url = `${BASE_URL}/companies`;
  if (subDomain && localId) {
    url = `${BASE_URL}/companies/restaurant/${subDomain}/${localId}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener las empresas de delivery");
  return await response.json();
};

export const fetchCompanyById = async (companyId) => {
  const response = await fetch(`${BASE_URL}/companies/${companyId}`);
  if (!response.ok) throw new Error("Error al obtener la empresa de delivery");
  return await response.json();
};

export const createCompany = async (companyData, subDomain, localId) => {
  // Incluimos los datos del restaurante
  const dataToSend = {
    ...companyData,
    subDomain,
    localId
  };
  
  const response = await fetch(`${BASE_URL}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });
  if (!response.ok) throw new Error("Error al crear la empresa de delivery");
  return await response.json();
};

export const updateCompany = async (companyId, companyData) => {
  const response = await fetch(`${BASE_URL}/companies/${companyId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companyData),
  });
  if (!response.ok) throw new Error("Error al actualizar la empresa de delivery");
  return await response.json();
};

export const deleteCompany = async (companyId) => {
  const response = await fetch(`${BASE_URL}/companies/${companyId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error("Error al eliminar la empresa de delivery");
  return await response.json();
};

// CONDUCTORES
export const fetchDrivers = async (subDomain, localId) => {
  // Si tenemos subDomain y localId, obtenemos los conductores del restaurante específico
  let url = `${BASE_URL}/drivers`;
  if (subDomain && localId) {
    url = `${BASE_URL}/drivers/restaurant/${subDomain}/${localId}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener los conductores");
  return await response.json();
};

export const fetchDriverById = async (driverId) => {
  const response = await fetch(`${BASE_URL}/drivers/${driverId}`);
  if (!response.ok) throw new Error("Error al obtener el conductor");
  return await response.json();
};
// OBTENER CONDUCTORES INDEPENDIENTES
export const fetchIndependentDrivers = async (subDomain, localId) => {
  // Primero obtenemos todos los conductores del restaurante
  const allDrivers = await fetchDrivers(subDomain, localId);
  // Luego filtramos para quedarnos solo con los independientes
  if (allDrivers.type === "1" && allDrivers.data) {
    return {
      ...allDrivers,
      data: allDrivers.data.filter(driver => !driver.company)
    };
  }
  return allDrivers;
};
// OBTENER CONDUCTORES POR EMPRESA
export const fetchDriversByCompany = async (companyId, subDomain, localId) => {
  let url = `${BASE_URL}/drivers/company/${companyId}`;
  // Si tenemos subDomain y localId, podríamos filtrar programáticamente después
  
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener los conductores de la empresa");
  
  // Si necesitamos filtrar por restaurante en el cliente
  const result = await response.json();
  if (subDomain && localId && result.type === "1" && result.data) {
    // Aquí podríamos aplicar un filtro adicional si fuera necesario
  }
  
  return result;
};
// CREAR CONDUCTOR
export const createDriver = async (driverData, subDomain, localId) => {
  // Incluimos los datos del restaurante y convertimos localId en un array si no es -1
  const localIds = localId === "-1" ? driverData.localIds || [] : [localId];
  
  const dataToSend = {
    ...driverData,
    subDomain,
    localIds
  };
  
  // Eliminamos localId si existe en driverData
  if (dataToSend.localId) {
    delete dataToSend.localId;
  }
  
  const response = await fetch(`${BASE_URL}/drivers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear el conductor");
  }
  
  return await response.json();
};
// ACTUALIZAR CONDUCTOR
export const updateDriver = async (driverId, driverData) => {
  const response = await fetch(`${BASE_URL}/drivers/${driverId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(driverData),
  });
  if (!response.ok) throw new Error("Error al actualizar el conductor");
  return await response.json();
};
// ELIMINAR CONDUCTOR
export const deleteDriver = async (driverId) => {
  const response = await fetch(`${BASE_URL}/drivers/${driverId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error("Error al eliminar el conductor");
  return await response.json();
};
// VINCULAR EMPRESA A RESTAURANTE
export const linkCompanyToRestaurant = async (linkData) => {
  const response = await fetch(`${BASE_URL}/companies/link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(linkData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al vincular la empresa al restaurante");
  }
  
  return await response.json();
};
// VINCULAR CONDUCTOR A RESTAURANTE
export const linkDriverToRestaurant = async (driverId, subDomain, localIds) => {
  const response = await fetch(`${BASE_URL}/drivers/link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driverId, subDomain, localIds }),
  });
  if (!response.ok) throw new Error("Error al vincular el conductor al restaurante");
  return await response.json();
};

// OBTENER TODAS LAS EMPRESAS DISPONIBLES (para asignar)
export const fetchAllCompanies = async () => {
  const response = await fetch(`${BASE_URL}/companies`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener las empresas de delivery disponibles");
  }
  
  return await response.json();
};

// DESASIGNAR UNA EMPRESA DE UN RESTAURANTE
export const unlinkCompanyFromRestaurant = async (unlinkData) => {
  const response = await fetch(`${BASE_URL}/companies/unlink`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(unlinkData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al desasignar la empresa del restaurante");
  }
  
  return await response.json();
};

// ASIGNAR CONDUCTOR A UN LOCAL
export const assignDriverToLocal = async (driverId, localId, subDomain) => {
  const response = await fetch(`${BASE_URL}/drivers/${driverId}/local/${localId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subDomain }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al asignar el conductor al local");
  }
  
  return await response.json();
};

// DESASIGNAR CONDUCTOR DE LOCALES
export const unlinkDriverFromRestaurant = async (driverId, subDomain, localIds) => {
  const response = await fetch(`${BASE_URL}/drivers/unlink`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driverId, subDomain, localIds }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al desasignar el conductor de los locales");
  }
  
  return await response.json();
}; 