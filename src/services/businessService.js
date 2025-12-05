import { getApiUrls } from "@/config/api";

const API_URLS = getApiUrls();

export const createBusiness = async (businessData, accessToken, userId) => {
  // Primero creamos el business (local)
  const businessResponse = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      subdominio: businessData.subdominio,
      linkDominio: businessData.linkDominio,
      localNombreComercial: businessData.localNombreComercial,
      localDescripcion: businessData.localDescripcion,
      localDireccion: businessData.localDireccion,
      localDepartamento: businessData.localDepartamento,
      localProvincia: businessData.localProvincia,
      localDistrito: businessData.localDistrito,
      localTelefono: businessData.localTelefono,
      localWpp: businessData.localWpp,
      localAceptaRecojo: businessData.localAceptaRecojo === "1",
      localAceptaPagoEnLinea: businessData.localAceptaPagoEnLinea === "1",
      localPorcentajeImpuesto: businessData.localPorcentajeImpuesto,
      estaAbiertoParaDelivery: true,
      estaAbiertoParaRecojo: true
    })
  });

  if (!businessResponse.ok) {
    throw new Error('Error creating business');
  }

  const businessResult = await businessResponse.json();

  // Luego creamos la relación user-business
  const userBusinessResponse = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/user-business/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      name: businessData.localDescripcion,
      userId: userId,
      subDomain: businessData.subdominio
    })
  });

  if (!userBusinessResponse.ok) {
    throw new Error('Error creating user-business relationship');
  }

  const userBusinessResult = await userBusinessResponse.json();

  return {
    business: businessResult.data,
    userBusiness: userBusinessResult
  };
};