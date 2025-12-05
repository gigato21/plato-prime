import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SetupOptionsModal = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-lg w-full p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h2 className="text-2xl font-bold text-cartaai-white text-center mb-6">
          Configuración de Negocio
        </h2>
        
        <div className="space-y-6">
          <div className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
               onClick={() => onSelect('normal')}>
            <h3 className="text-lg font-semibold text-cartaai-white mb-2">
              Configuración Normal
            </h3>
            <p className="text-sm text-cartaai-white/80">
              Configura tu negocio desde cero con todos los detalles necesarios.
            </p>
          </div>

          <div className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
               onClick={() => onSelect('integration')}>
            <h3 className="text-lg font-semibold text-cartaai-white mb-2">
              Configuración para Integración
            </h3>
            <p className="text-sm text-cartaai-white/80">
              Configura lo básico para preparar tu negocio para una integración posterior.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SetupOptionsModal; 