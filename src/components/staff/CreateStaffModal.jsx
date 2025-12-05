import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateStaffForm from './CreateStaffForm';
import { useStaffForm } from './useStaffForm';
import { UserPlus } from "lucide-react";

const CreateStaffModal = ({ isOpen, onClose, onSuccess }) => {
  const {
    formData,
    roles,
    isLoading,
    handleInputChange,
    handleRoleChange,
    handleSubmit
  } = useStaffForm({ onSuccess, onClose });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10 w-full max-w-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-cartaai-red" />
            Agregar nuevo miembro del staff
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CreateStaffForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleRoleChange={handleRoleChange}
            roles={roles}
            isLoading={isLoading}
          />
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-cartaai-red hover:bg-cartaai-red/80 text-white w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStaffModal;