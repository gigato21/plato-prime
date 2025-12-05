import { getApiUrls } from '@/config/api';

const API_URLS = getApiUrls();

export const syncBotState = async (clientPhone, subdomain, localId, newState) => {
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
        chatIsOn: newState
      })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado del bot');
    }

    return true;
  } catch (error) {
    console.error('Error en syncBotState:', error);
    return false;
  }
};

export const emitBotStateChange = (socket, clientPhone, chatbotNumber, newState) => {
  if (socket) {
    socket.emit('botStateChange', {
      clientPhone,
      chatbotNumber,
      newState
    });
  }
};