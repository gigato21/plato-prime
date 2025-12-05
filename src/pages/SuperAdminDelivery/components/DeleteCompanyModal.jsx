import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader, AlertTriangle, X } from 'lucide-react';
import { deleteDeliveryCompany } from '../services/superAdminDeliveryService';
import { useToast } from "@/components/ui/use-toast";

const DeleteCompanyModal = ({ company, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!company?._id) return;
    
    setIsDeleting(true);
    try {
      await deleteDeliveryCompany(company._id);
      
      toast({
        title: "Éxito",
        description: "Empresa de delivery eliminada correctamente",
      });
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la empresa de delivery",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="glass-container p-6 rounded-lg animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Eliminar Empresa</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-[#ff4d4f]/20 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-[#ff4d4f]" />
        </div>
        
        <h3 className="text-lg font-medium text-white mb-2">¿Está seguro?</h3>
        <p className="text-center text-white/70 mb-6">
          ¿Realmente desea eliminar la empresa "{company?.name}"? Esta acción no se puede deshacer.
        </p>
        
        <div className="flex space-x-3 mt-4">
          <Button 
            className="glass-button bg-white/20 hover:bg-white/30 border-white/20"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            className="glass-button bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border-[#8B5CF6]/20 text-white"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader className="h-4 w-4 animate-spin mr-2" />
            ) : (
              "Sí, eliminar"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCompanyModal; 