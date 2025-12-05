import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import CategoriesTab from '../components/menu/CategoriesTab';
import ProductsTab from './MenuManager/components/ProductsTab';
import ModifiersTab from '../components/menu/ModifiersTab';
import CombosTab from './MenuManager/components/CombosTab';

const Menu = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [hasMenu, setHasMenu] = useState(true); // Estado para controlar si hay menú
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    // Aquí podrías verificar si el negocio tiene menú
    // Por ahora lo simulamos con un estado
    checkIfHasMenu();
  }, [location]);

  const checkIfHasMenu = () => {
    // Aquí iría la lógica para verificar si el negocio tiene menú
    // Por ahora usamos el localStorage como ejemplo
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    setHasMenu(categories.length > 0 || products.length > 0);
  };

  const handleCreateCombo = () => {
    navigate('/create-combo', { state: { from: location.pathname } });
  };

  const handleUploadMenu = () => {
    // Aquí iría la lógica para subir la imagen del menú
    // Por ahora solo mostramos un mensaje
  };

  if (!hasMenu) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 glass-container">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-cartaai-white">
            Aún no tienes un menú configurado
          </h1>
          <p className="text-cartaai-white/80">
            Puedes subir una imagen de tu menú actual y nuestra IA se encargará de procesarla y crear todo el contenido automáticamente.
          </p>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="Placeholder"
              className="rounded-lg shadow-xl w-full max-w-md mx-auto opacity-75"
            />
          </div>
          <Button 
            onClick={handleUploadMenu}
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Subir imagen del menú
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 glass-container">
      <h1 className="text-3xl font-bold mb-6 text-cartaai-white border-b border-cartaai-white/10 pb-4">
        Gestión de Menú
      </h1>
      
      <div className="bg-cartaai-black/30 rounded-lg backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-cartaai-white/10">
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:bg-cartaai-red text-cartaai-white"
            >
              Categorías
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="data-[state=active]:bg-cartaai-red text-cartaai-white"
            >
              Productos
            </TabsTrigger>
            <TabsTrigger 
              value="modifiers" 
              className="data-[state=active]:bg-cartaai-red text-cartaai-white"
            >
              Modificadores
            </TabsTrigger>
            <TabsTrigger 
              value="combos" 
              className="data-[state=active]:bg-cartaai-red text-cartaai-white"
            >
              Combos
            </TabsTrigger>
          </TabsList>
          <div className="p-4">
            <TabsContent value="categories">
              <CategoriesTab />
            </TabsContent>
            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>
            <TabsContent value="modifiers">
              <ModifiersTab />
            </TabsContent>
            <TabsContent value="combos">
              <CombosTab onCreateCombo={handleCreateCombo} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Menu;