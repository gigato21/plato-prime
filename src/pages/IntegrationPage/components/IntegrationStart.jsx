import React from 'react';
import { Button } from "@/components/ui/button";
import { Rocket, Database, RefreshCw, ServerIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

const IntegrationStart = ({ onStartIntegration, isLoading }) => {
  const subDomain = useSelector((state) => state.auth.subDomain || "demo");
  
  return (
    <div className="glass-container p-8 text-center">
      <Rocket className="w-16 h-16 text-cartaai-red mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-cartaai-white mb-4">Integración RESTPE - CARTAAI</h2>
      <p className="text-cartaai-white/80 mb-6 max-w-2xl mx-auto">
        Este proceso sincronizará los datos desde RESTPE a CARTAAI. Se conectará con tu 
        cuenta de RESTPE usando el subdominio <span className="font-bold">{subDomain}</span> y
        obtendrá todos los productos, categorías y presentaciones para integrarlos en CARTAAI.
      </p>
      
      <div className="bg-cartaai-white/10 p-4 rounded-lg mb-6 text-left max-w-2xl mx-auto">
        <h3 className="text-md font-semibold text-cartaai-white mb-2 flex items-center">
          <ServerIcon className="w-4 h-4 mr-2" /> Endpoint de conexión:
        </h3>
        <code className="bg-cartaai-white/5 p-2 rounded block text-xs text-cartaai-white/90 overflow-x-auto">
          https://{subDomain}.restaurant.pe/restaurant/facebook/rest/delivery/cargarCartaMenuEnLinea/1/0
        </code>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
        <Button 
          onClick={onStartIntegration}
          disabled={isLoading}
          className="bg-cartaai-red hover:bg-cartaai-red/90 text-white px-8 py-6 text-lg flex items-center gap-2"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Database className="w-5 h-5" />
          )}
          {isLoading ? 'Conectando con RESTPE...' : 'Comenzar Integración'}
        </Button>
      </div>
      
      <div className="mt-6 text-cartaai-white/60 text-sm">
        <p>Este proceso puede tomar algunos minutos dependiendo de la cantidad de datos.</p>
        <p className="mt-1">La información se obtendrá desde tu cuenta de RESTPE y se preparará para la sincronización manual.</p>
      </div>
    </div>
  );
};

export default IntegrationStart; 