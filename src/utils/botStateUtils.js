import { getApiUrls } from '@/config/api';

const API_URLS = getApiUrls();

export const verifyBotState = async (clientPhone, subdomain, localId) => {
  try {
    const response = await fetch(
      `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-ctx/find-one?subDomain=${subdomain}&localId=${localId}&clientPhone=${clientPhone}`
    );
    const data = await response.json();
    return data.data.chatIsOn;
  } catch (error) {
    console.error('Error al verificar el estado del bot:', error);
    return null;
  }
};

export const fetchAllBotStates = async (subdomain, localId) => {
  try {
    const response = await fetch(
      `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-ctx/find-all?subDomain=${subdomain}&localId=${localId}`
    );
    const { data } = await response.json();
    
    // Convertir el array de estados a un objeto para fácil acceso
    const botStatesMap = {};
    data.forEach(ctx => {
      botStatesMap[ctx.clientPhone] = ctx.chatIsOn;
    });
    
    return botStatesMap;
  } catch (error) {
    console.error('Error al obtener todos los estados de los bots:', error);
    return {};
  }
};

export const updateReadStatus = async (subdomain, localId, clientPhone, isRead) => {
  try {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-ctx/update-chat-on`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subDomain: subdomain,
        localId: localId,
        clientPhone: clientPhone,
        isRead: isRead
      })
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar el estado de lectura');
    }
    
    return true;
  } catch (error) {
    console.error('Error al actualizar el estado de lectura:', error);
    return false;
  }
};