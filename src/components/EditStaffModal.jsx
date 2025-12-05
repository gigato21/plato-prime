import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSelector } from 'react-redux';
import { updateUser } from '@/services/staffService';
import { useToast } from "@/components/ui/use-toast";
import { getApiUrls } from '@/config/api';

const EditStaffModal = ({ isOpen, onClose, onEditStaff, staff }) => {
  const API_URLS = getApiUrls();
  const [editedStaff, setEditedStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    roleName: ''
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (staff) {
      setEditedStaff({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        role: staff.role?._id || '',
        roleName: staff.role?.name || ''
      });
    }
  }, [staff]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/roles`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) throw new Error('Error al obtener roles');
        
        const data = await response.json();
        if (data.type === "1") {
          setRoles(data.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los roles",
          variant: "destructive",
        });
      }
    };

    fetchRoles();
  }, [accessToken, toast]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedStaff(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const handleRoleChange = (value) => {
    const selectedRole = roles.find(role => role._id === value);
    setEditedStaff(prev => ({
      ...prev,
      role: value,
      roleName: selectedRole?.name || ''
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const updateData = {};
      if (editedStaff.name) updateData.name = editedStaff.name;
      if (editedStaff.email) updateData.email = editedStaff.email;
      if (editedStaff.phone) updateData.phone = editedStaff.phone;
      if (editedStaff.role) updateData.role = editedStaff.role;

      const updatedUser = await updateUser(staff._id, updateData, accessToken);
      onEditStaff({
        ...updatedUser,
        roleName: editedStaff.roleName
      });
      toast({
        title: "Éxito",
        description: "Usuario actualizado correctamente",
      });
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el usuario",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Editar miembro del staff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-cartaai-white">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={editedStaff.name}
                onChange={handleInputChange}
                className="col-span-3 glass-input text-cartaai-white border-cartaai-white/20 focus:border-cartaai-red/50 focus:ring-cartaai-red/30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-cartaai-white">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editedStaff.email}
                onChange={handleInputChange}
                className="col-span-3 glass-input text-cartaai-white border-cartaai-white/20 focus:border-cartaai-red/50 focus:ring-cartaai-red/30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right text-cartaai-white">
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                value={editedStaff.phone}
                onChange={handleInputChange}
                className="col-span-3 glass-input text-cartaai-white border-cartaai-white/20 focus:border-cartaai-red/50 focus:ring-cartaai-red/30"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right text-cartaai-white">
                Rol
              </Label>
              <Select
                value={editedStaff.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger className="col-span-3 glass-input text-cartaai-white border-cartaai-white/20 focus:border-cartaai-red/50 focus:ring-cartaai-red/30">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent className="bg-cartaai-black border-cartaai-white/10">
                  {roles.map((role) => (
                    <SelectItem 
                      key={role._id} 
                      value={role._id}
                      className="text-cartaai-white hover:bg-cartaai-white/10"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffModal;