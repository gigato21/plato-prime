import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Building2, ShoppingCart, CreditCard, Cog } from 'lucide-react';
import { toast } from "sonner";
import RestaurantSubmodule from '../components/RestaurantSubmodule';
import WelcomeModal from '../components/WelcomeModal';

const Restaurant = () => {
  const [selectedModule, setSelectedModule] = useState('gestion');
  const [selectedSubModule, setSelectedSubModule] = useState('info');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);

  useEffect(() => {
    if (!subDomain || !localId) {
      setShowWelcomeModal(true);
    }
  }, [subDomain, localId]);

  const handleNavigateToRestaurant = () => {
    setShowWelcomeModal(false);
  };

  const handleModuleClick = (moduleId) => {
    if (moduleId === 'aplicaciones') {
      toast.info("Esta funcionalidad estará disponible próximamente", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }
    setSelectedModule(moduleId);
  };

  const subModules = [
    { id: 'info', title: 'Información General', icon: Building2 },
    { id: 'config', title: 'Pedidos', icon: ShoppingCart },
    { id: 'staff', title: 'Servicios', icon: Cog },
    { id: 'payments', title: 'Pagos', icon: CreditCard },
  ];

  const modules = [
    { id: 'gestion', title: 'Gestión de restaurantes' },
    { id: 'aplicaciones', title: 'Aplicaciones' },
    { id: 'horario', title: 'Horario de trabajo' },
    { id: 'ubicacion', title: 'Ubicación' },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-container p-6 animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-gray-700 border-b border-cartaai-white/10 pb-4">
          Gestión de Restaurante
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {modules.map((module, index) => (
            <button
              key={module.id}
              className={`p-6 rounded-lg flex flex-col items-center justify-center transition-all duration-300 
                ${selectedModule === module.id
                  ? 'bg-cartaai-red text-cartaai-black shadow-lg scale-100'
                  : 'bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20'
                } hover:shadow-lg hover:-translate-y-0.5 transform-gpu`}
              onClick={() => handleModuleClick(module.id)}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fade-in-up 0.5s ease-out forwards'
              }}
            >
              <span className="text-sm font-medium text-center">{module.title}</span>
            </button>
          ))}
        </div>

        {selectedModule === 'gestion' && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {subModules.map((subModule, index) => (
              <button
                key={subModule.id}
                onClick={() => setSelectedSubModule(subModule.id)}
                className={`p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all duration-300
                  ${selectedSubModule === subModule.id
                    ? 'bg-cartaai-red/20 text-cartaai-red scale-100'
                    : 'bg-cartaai-white/5 text-cartaai-white hover:bg-cartaai-white/10'
                  } hover:shadow-md hover:-translate-y-0.5 transform-gpu`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fade-in-up 0.5s ease-out forwards'
                }}
              >
                <subModule.icon className="w-6 h-6" />
                <span className="text-xs font-medium text-center">{subModule.title}</span>
              </button>
            ))}
          </div>
        )}
        
        <RestaurantSubmodule 
          selectedModule={selectedModule} 
          selectedSubModule={selectedSubModule}
        />
      </div>

      <WelcomeModal 
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onNavigate={handleNavigateToRestaurant}
      />

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Restaurant;