import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

const MenuHeader = ({ onGoBack }) => {
  return (
    <Button 
      onClick={onGoBack} 
      className="absolute top-8 left-4 glass-container hover:bg-white/20 dark:hover:bg-black/20 text-cartaai-white z-10 backdrop-blur-md"
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Panel
    </Button>
  );
};

export default MenuHeader;