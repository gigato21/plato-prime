import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, ClipboardList, Store } from "lucide-react";

const WelcomeModal = ({ isOpen, onClose, onNavigate }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent 
        className="sm:max-w-[425px] z-[999]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            ¡Bienvenido a CartaAI!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Para comenzar a usar todas las funcionalidades, necesitamos algunos datos de tu negocio
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Store className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <h4 className="font-medium">Configura tu negocio</h4>
                <p className="text-sm text-muted-foreground">
                  Agrega el nombre y detalles de tu restaurante
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Building2 className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <h4 className="font-medium">Personaliza tu dominio</h4>
                <p className="text-sm text-muted-foreground">
                  Elige un subdominio único para tu negocio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <ClipboardList className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <h4 className="font-medium">Completa tu menú</h4>
                <p className="text-sm text-muted-foreground">
                  Agrega tus productos y categorías
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={onNavigate}
          >
            Comenzar configuración
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;