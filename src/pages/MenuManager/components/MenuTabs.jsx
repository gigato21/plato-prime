import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Box, List, Package } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MenuTabs = ({ activeTab, onTabChange, children }) => {
  const tabs = [
    { id: 'categories', icon: Folder, label: 'Categorías', tooltip: 'Gestiona las categorías de tu menú' },
    { id: 'combos', icon: Package, label: 'Combos', tooltip: 'Administra los combos de tu menú' },
    { id: 'products', icon: Box, label: 'Productos', tooltip: 'Administra los productos de tu menú' },
    { id: 'options', icon: List, label: 'Opciones', tooltip: 'Configura las opciones disponibles' },
    { id: 'modifiers', icon: List, label: 'Modificadores', tooltip: 'Gestiona los modificadores de productos' },
  ];

  return (
    <Tabs defaultValue={activeTab} className="w-full" onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-5 glass-container mb-6">
        <TooltipProvider>
          {tabs.map(({ id, icon: Icon, label, tooltip }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value={id} 
                  className={`text-cartaai-white transition-all duration-300 hover:bg-white/5 ${activeTab === id ? 'dark:bg-white/10 bg-gray-500/30' : ''}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TabsList>
      {children}
    </Tabs>
  );
};

export default MenuTabs;