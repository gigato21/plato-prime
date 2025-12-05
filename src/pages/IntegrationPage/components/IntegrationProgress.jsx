import React from 'react';
import { Check, Circle, Clock } from 'lucide-react';

const IntegrationProgress = ({ steps }) => {
  // Calcular el porcentaje de progreso total
  const totalSteps = steps.length;
  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  return (
    <div className="glass-container p-6 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-cartaai-white">Progreso de la Integración</h3>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-cartaai-white/60" />
          <span className="text-sm font-medium text-cartaai-white/60">
            Progreso total: {progressPercentage}%
          </span>
        </div>
      </div>
      
      <div className="w-full bg-cartaai-white/10 h-1.5 rounded-full mb-6">
        <div 
          className="bg-blue-500 h-1.5 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className="flex flex-wrap gap-2 md:gap-0 justify-between items-center relative">
        {/* Línea conectora */}
        <div className="absolute h-0.5 bg-gray-300 top-5 left-8 right-8 -z-10 hidden md:block"></div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center text-center w-full md:w-auto">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
              ${step.completed ? 'bg-green-500' : step.current ? 'bg-blue-500' : 'bg-gray-300'}`}>
              {step.completed ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Circle className="w-5 h-5 text-white" />
              )}
            </div>
            <span className={`text-xs font-medium ${
              step.completed ? 'text-green-500' : 
              step.current ? 'text-blue-500' : 
              'text-cartaai-white/60'
            }`}>
              {step.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegrationProgress; 