export const fetchMenuData = async (subDomain, localId) => {
  try {
    const response = await fetch(
      `https://${subDomain}.restaurant.pe/restaurant/facebook/rest/delivery/cargarCartaMenuEnLinea/${localId}/0`
    );
    const parsedData = await response.json();
    console.log('Datos recibidos de RESTPE:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    throw error;
  }
}; 