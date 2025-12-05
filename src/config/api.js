export const 
getApiUrls = () => {
  const environment = import.meta.env.VITE_APP_ENV || 'local';
  const authState = JSON.parse(localStorage.getItem('authState'));
  const subdomain = authState?.subDomain || 'baileys';
  let providerUrl = `https://${subdomain}-provider-${environment}.up.railway.app`;
  
  const urls = {
    development: {
      SERVICIOS_GENERALES_URL: import.meta.env.VITE_SERVICIOS_GENERALES_URL || 'https://dev.ssgg.api.cartaai.pe',
      BOT_PROVIDER_URL: providerUrl
    },
    production: {
      SERVICIOS_GENERALES_URL: import.meta.env.VITE_SERVICIOS_GENERALES_URL || 'https://ssgg.api.cartaai.pe',
      BOT_PROVIDER_URL: providerUrl
    },
    local: {
      SERVICIOS_GENERALES_URL: import.meta.env.VITE_SERVICIOS_GENERALES_URL || 'http://localhost:3000',
      BOT_PROVIDER_URL: providerUrl
    }
  };
  return urls[environment] || urls.development;
};

