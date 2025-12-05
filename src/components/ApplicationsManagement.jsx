import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import MercadoPagoConfig from './MercadoPagoConfig';
import SocialMediaLinks from './SocialMediaLinks';
import ThemeSelector from './ThemeSelector';

const ApplicationsManagement = () => {
  const [mercadoPagoData, setMercadoPagoData] = useState({
    enabled: false,
    accessToken: '',
  });

  const [socialMediaData, setSocialMediaData] = useState({
    facebook: '',
    twitter: '',
    youtube: '',
    instagram: '',
  });

  const [selectedTheme, setSelectedTheme] = useState('Luxe template');

  const handleSave = () => {
   
    // Aquí iría la lógica para guardar los datos en el backend
  };

  return (
    <div className="space-y-8 p-6 bg-cartaai-black rounded-lg shadow text-cartaai-white">
      <h1 className="text-3xl font-bold border-b border-cartaai-white/10 pb-4">Gestión de Aplicaciones</h1>
      
      <MercadoPagoConfig
        mercadoPagoData={mercadoPagoData}
        setMercadoPagoData={setMercadoPagoData}
      />

      <SocialMediaLinks
        socialMediaData={socialMediaData}
        setSocialMediaData={setSocialMediaData}
      />

      <ThemeSelector
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
      />

      <div className="flex justify-end mt-8">
        <Button onClick={handleSave} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white px-6 py-2">
          Guardar cambios
        </Button>
      </div>
    </div>
  );
};

export default ApplicationsManagement;