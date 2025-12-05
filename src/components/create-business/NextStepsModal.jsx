import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Store, Menu, Clock, MapPin } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '@/services/userService';
import { login } from '@/redux/slices/authSlice';

const NextStepsCard = ({ icon: Icon, title, description, path }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  
  const handleCardClick = async () => {
    try {
      const updatedUserData = await updateUserData(accessToken);
      dispatch(login(updatedUserData));
      navigate(path);
    } catch (error) {
      console.error('Error updating user data:', error);
      navigate(path); // Navigate anyway to not block the user
    }
  };
  
  return (
    <div className="p-6 rounded-lg bg-accent/50 backdrop-blur-sm hover:bg-accent/70 transition-all duration-300 cursor-pointer" onClick={handleCardClick}>
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-full bg-cartaai-red/10">
          <Icon className="h-6 w-6 text-cartaai-red" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

const NextStepsModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);

  const handleClose = async () => {
    try {
      const updatedUserData = await updateUserData(accessToken);
      dispatch(login(updatedUserData));
    } catch (error) {
      console.error('Error updating user data:', error);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            ¡Felicitaciones! Tu negocio ha sido creado
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            Aquí hay algunos pasos sugeridos para comenzar a configurar tu negocio
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <NextStepsCard
            icon={Store}
            title="Configura tu Restaurante"
            description="Personaliza los detalles de tu negocio, agrega imágenes y configura la información básica."
            path="/restaurant"
          />
          
          <NextStepsCard
            icon={Menu}
            title="Crea tu Menú"
            description="Comienza a agregar tus productos, categorías y personaliza tu carta digital."
            path="/menu"
          />
          
          <NextStepsCard
            icon={Clock}
            title="Establece tus Horarios"
            description="Define los horarios de atención y disponibilidad para delivery y recojo en tienda."
            path="/restaurant"
          />
          
          <NextStepsCard
            icon={MapPin}
            title="Configura Zonas de Entrega"
            description="Define las áreas donde realizarás entregas y establece costos de envío."
            path="/delivery-zones"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleClose} className="bg-cartaai-red hover:bg-cartaai-red/80">
            Comenzar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NextStepsModal;