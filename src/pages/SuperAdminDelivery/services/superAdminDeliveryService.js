import { getApiUrls } from '@/config/api';

const API_URLS = getApiUrls();
const BASE_URL = `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/delivery`;

export const createDeliveryCompany = async (companyData) => {
  try {
    const response = await fetch(`${BASE_URL}/companies/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear la empresa de delivery");
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating delivery company:', error);
    throw error;
  }
};

export const fetchDeliveryCompanies = async () => {
  try {
    // Endpoint exacto: /delivery/companies
    const response = await fetch(`${BASE_URL}/companies`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las empresas de delivery");
    }
    
    const result = await response.json();
    
    // No lanzamos un error si success es true
    // Solo validamos que el objeto tenga la estructura esperada
    if (result.data === undefined) {
      throw new Error("Formato de respuesta inválido");
    }
    
    return result; // Devolvemos el objeto completo con success, message y data
  } catch (error) {
    console.error('Error fetching delivery companies:', error);
    throw error;
  }
};

export const updateDeliveryCompany = async (companyId, companyData) => {
  try {
    const response = await fetch(`${BASE_URL}/companies/${companyId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(companyData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar la empresa de delivery");
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating delivery company:', error);
    throw error;
  }
};

export const deleteDeliveryCompany = async (companyId) => {
  try {
    const response = await fetch(`${BASE_URL}/companies/${companyId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar la empresa de delivery");
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting delivery company:', error);
    throw error;
  }
}; 