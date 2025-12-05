import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Store, GitBranch } from 'lucide-react';

const BusinessSetupChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cartaai-black">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-cartaai-white">
            Configura tu Negocio
          </h1>
          <p className="text-cartaai-white/60">
            Elige cómo quieres configurar tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Opción Normal */}
          <Card 
            className="p-6 cursor-pointer hover:bg-cartaai-white/5 transition-all duration-300 border border-cartaai-white/10"
            onClick={() => navigate('/create-business')}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-cartaai-red/10 rounded-full">
                <Store className="w-8 h-8 text-cartaai-red" />
              </div>
              <h2 className="text-xl font-semibold text-cartaai-white">
                Configuración Normal
              </h2>
              <p className="text-center text-cartaai-white/60">
                Configura tu negocio desde cero con todos los detalles necesarios.
                Ideal para negocios nuevos.
              </p>
            </div>
          </Card>

          {/* Opción Integración */}
          <Card 
            className="p-6 cursor-pointer hover:bg-cartaai-white/5 transition-all duration-300 border border-cartaai-white/10"
            onClick={() => navigate('/integration-setup')}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-cartaai-red/10 rounded-full">
                <GitBranch className="w-8 h-8 text-cartaai-red" />
              </div>
              <h2 className="text-xl font-semibold text-cartaai-white">
                Configuración para Integración
              </h2>
              <p className="text-center text-cartaai-white/60">
                Configura lo básico para preparar tu negocio para una integración.
                Ideal si ya tienes un sistema existente.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessSetupChoice; 