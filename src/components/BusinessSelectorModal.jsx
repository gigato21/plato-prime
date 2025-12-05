import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Store, Plus } from 'lucide-react';
import { useState } from 'react';
import CreateLocalForm from './CreateLocalForm';
import LocalsList from './LocalsList';
import { Loader } from "lucide-react";
import { useSelector } from 'react-redux';

const BusinessSelectorModal = ({ isOpen, onClose, businesses, onSelect, isLoading }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const userRole = useSelector(state => state.auth.role);
  const isSuperAdmin = userRole === 'superadmin';
  
  const handleBusinessSelect = (business) => {
    onSelect(business);
  };
  
  if (showCreateForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px] bg-cartaai-black border-cartaai-white/10 text-cartaai-white">
          <CreateLocalForm 
            onClose={onClose}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-cartaai-black border-cartaai-white/10 text-cartaai-white">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="mx-auto bg-cartaai-red/10 p-3 rounded-full w-fit">
              <Store className="w-8 h-8 text-cartaai-red" />
            </div>
            <h2 className="text-2xl font-bold text-cartaai-white">
              {isSuperAdmin ? 'Seleccionar restaurante para supervisar' : 'Selecciona tu local'}
            </h2>
            <p className="text-gray-400">
              {isSuperAdmin 
                ? 'Elige el restaurante que deseas supervisar'
                : userRole === 'admin' 
                  ? 'Elige el local con el que deseas trabajar o crea uno nuevo'
                  : 'Elige el local con el que deseas trabajar'}
            </p>
          </div>

          {userRole === 'admin' && !isSuperAdmin && (
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="outline"
              className="w-full justify-center text-left font-normal hover:bg-cartaai-white/10 border-cartaai-white/10 group transition-all duration-200 hover:border-cartaai-red"
            >
              <Plus className="w-4 h-4 mr-2 text-cartaai-red" />
              <span className="font-medium group-hover:text-cartaai-red transition-colors">
                Crear nuevo local
              </span>
            </Button>
          )}

          {businesses?.businesses?.length > 0 && !isSuperAdmin && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cartaai-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-cartaai-black px-2 text-cartaai-white/60">
                  {userRole === 'admin' ? 'o selecciona un local existente' : 'selecciona un local'}
                </span>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-6 h-6 text-cartaai-red animate-spin" />
            </div>
          ) : (
            <LocalsList 
              businesses={businesses.businesses}
              onSelect={handleBusinessSelect}
              isSuperAdmin={isSuperAdmin}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessSelectorModal;
