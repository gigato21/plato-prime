import { getApiUrls } from '@/config/api';

const API_URLS = getApiUrls();
export const fetchUsers = async (subDomain, token) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user/subdomain/${subDomain}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener usuarios');
  }

  const result = await response.json();
  
  if (result.type === "1") {
    return result.data;
  }
  
  throw new Error(result.message || 'Error al obtener usuarios');
};

export const updateUser = async (userId, userData, token) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user/${userId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    throw new Error('Error al actualizar usuario');
  }

  const result = await response.json();
  
  if (result.type === "1") {
    return result.data;
  }
  
  throw new Error(result.message || 'Error al actualizar usuario');
};

// Cache para los locales
let localsCache = null;

export const fetchAvailableLocals = async (subDomain, token) => {
  // Si ya tenemos los locales en cache, los retornamos
  if (localsCache) {
    return localsCache;
  }

  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/locals/${subDomain}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los locales disponibles');
  }

  const result = await response.json();
  localsCache = result.data; // Guardamos en cache
  return result.data;
};

// Función para limpiar el cache si es necesario
export const clearLocalsCache = () => {
  localsCache = null;
};

// Nueva función para obtener todos los user-business
export const fetchAllUserBusinesses = async (subDomain, token) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-business/get-users-subdomain/${subDomain}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los user-business');
  }

  return await response.json();
};

// Mantenemos la función original pero ahora usa el cache de user-businesses
let userBusinessesCache = null;

export const fetchAssignedLocals = async (userId, token) => {
  if (!userBusinessesCache) {
    throw new Error('User businesses no han sido cargados');
  }
  
  return userBusinessesCache[userId] || [];
};

export const assignLocalToUser = async (localData, token) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-business/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(localData),
  });

  if (!response.ok) {
    throw new Error('Error al asignar el local al usuario');
  }

  return await response.json();
};

export const updateUserBusiness = async (userId, businessData, token) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-business/update/${userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(businessData),
  });

  if (!response.ok) {
    throw new Error('Error al actualizar el local asignado');
  }

  return await response.json();
};

export const deleteUserBusiness = async (userId, token) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-business/delete/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar el local asignado');
  }

  return await response.json();
};

export const deleteUser = async (userId, token) => {
  const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al eliminar usuario');
  }

  const result = await response.json();
  
  if (result.type === "1") {
    return result.data;
  }
  
  throw new Error(result.message || 'Error al eliminar usuario');
};

// Función para actualizar el cache
export const setUserBusinessesCache = (data) => {
  userBusinessesCache = data;
};
