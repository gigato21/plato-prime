import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { User, Mail, Phone, Lock, AlertTriangle } from 'lucide-react';
import CountryCodeSelect from './CountryCodeSelect';
import { useSelector } from 'react-redux';

const ProfileModal = ({ isOpen, onClose }) => {
  const userData = useSelector((state) => state.auth.userData);
  
  // Split phone into code and number if it exists
  const phoneCode = userData?.phone?.split(' ')[0] || '+51';
  const phoneNumber = userData?.phone?.split(' ')[1] || '';

  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phoneCode: phoneCode,
    phoneNumber: phoneNumber
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePhoneCodeChange = (value) => {
    setProfileData({ ...profileData, phoneCode: value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Cambios guardados",
      description: "Los cambios en tu perfil han sido guardados exitosamente.",
    });
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword === passwordData.confirmPassword) {
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada exitosamente.",
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleCloseAccount = () => {
    toast({
      title: "Cuenta cerrada",
      description: "Tu cuenta ha sido cerrada exitosamente.",
      variant: "destructive",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-container border-cartaai-white/10 max-w-md z-[998]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Mi Perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <User className="text-cartaai-red w-4 h-4" />
              <div className="flex-1">
                <Label htmlFor="name" className="text-xs font-medium">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="glass-input text-sm mt-1 h-7"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="text-cartaai-red w-4 h-4" />
              <div className="flex-1">
                <Label htmlFor="email" className="text-xs font-medium">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="glass-input text-sm mt-1 h-7"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="text-cartaai-red w-4 h-4" />
              <div className="flex-1">
                <Label htmlFor="phone" className="text-xs font-medium">Teléfono</Label>
                <div className="flex space-x-2 mt-1">
                  <CountryCodeSelect
                    value={profileData.phoneCode}
                    onChange={handlePhoneCodeChange}
                  />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    className="flex-1 glass-input text-sm h-7"
                  />
                </div>
              </div>
            </div>
          </div>
          <Button onClick={handleSaveProfile} className="w-full bg-cartaai-red hover:bg-cartaai-red/80 text-sm h-7">
            Guardar cambios
          </Button>
        </div>
        <div className="space-y-2 py-2 border-t border-cartaai-white/10">
          <h3 className="text-sm font-semibold flex items-center">
            <Lock className="mr-2 text-cartaai-red w-4 h-4" />
            Cambiar contraseña
          </h3>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Contraseña actual"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="glass-input text-sm h-7"
            />
            <Input
              type="password"
              placeholder="Nueva contraseña"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="glass-input text-sm h-7"
            />
            <Input
              type="password"
              placeholder="Confirmar nueva contraseña"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="glass-input text-sm h-7"
            />
          </div>
          <Button onClick={handleChangePassword} className="w-full bg-cartaai-red hover:bg-cartaai-red/80 text-sm h-7">
            Cambiar contraseña
          </Button>
        </div>
        <DialogFooter className="flex flex-col items-stretch">
          <Button 
            onClick={handleCloseAccount} 
            variant="outline" 
            className="w-full text-cartaai-red border-cartaai-red hover:bg-cartaai-red/10 text-sm h-7"
          >
            <AlertTriangle className="mr-2 h-3 w-3" />
            Cerrar cuenta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;