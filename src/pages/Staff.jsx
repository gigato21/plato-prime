import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import CreateStaffModal from '../components/staff/CreateStaffModal';
import EditStaffModal from '../components/EditStaffModal';
import StaffList from '../components/StaffList';
import ConfirmDialog from '../components/ConfirmDialog';
import { 
  fetchUsers, 
  updateUser, 
  deleteUser, 
  fetchAllUserBusinesses, 
  setUserBusinessesCache,
  fetchAvailableLocals,
  clearLocalsCache 
} from '../services/staffService';

const Staff = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [staffToEdit, setStaffToEdit] = useState(null);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();
  const subDomain = useSelector((state) => state.auth.subDomain);
  const token = useSelector((state) => state.auth.accessToken);

  const loadData = async () => {
    try {
      const [users, userBusinesses, locals] = await Promise.all([
        fetchUsers(subDomain, token),
        fetchAllUserBusinesses(subDomain, token),
        fetchAvailableLocals(subDomain, token)
      ]);

      setUserBusinessesCache(userBusinesses);
      setStaffList(users);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [subDomain, token]);

  const handleToggleStatus = async (staffId) => {
    const staffMember = staffList.find(staff => staff._id === staffId);
    if (!staffMember) return;

    try {
      const updatedUser = await updateUser(
        staffId, 
        { isActive: !staffMember.isActive },
        token
      );
      
      setStaffList(staffList.map(staff => 
        staff._id === staffId ? { ...staff, isActive: updatedUser.isActive } : staff
      ));

      toast({
        title: "Éxito",
        description: "Estado del usuario actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el estado del usuario",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      await deleteUser(staffToDelete._id, token);
      setStaffList(staffList.filter(staff => staff._id !== staffToDelete._id));
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    } finally {
      setStaffToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleEditStaff = (staff) => {
    setStaffToEdit(staff);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedStaff = (editedStaff) => {
    setStaffList(staffList.map(staff => 
      staff._id === editedStaff._id ? {
        ...staff,
        ...editedStaff,
        role: {
          _id: editedStaff.role,
          name: editedStaff.roleName
        }
      } : staff
    ));
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (staff) => {
    setStaffToDelete(staff);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    return () => {
      clearLocalsCache();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cartaai-red"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="glass-container p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-cartaai-red" />
            <div>
              <h1 className="text-3xl font-bold text-cartaai-white">Gestión de Staff</h1>
              <p className="text-sm text-cartaai-white/70">Administra los miembros del equipo</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <UserPlus className="mr-2 h-5 w-5" /> Agregar Staff
          </Button>
        </div>

        <div className="rounded-lg">
          <StaffList 
            staffList={staffList}
            onToggleStatus={handleToggleStatus}
            onDeleteStaff={openDeleteModal}
            onEditStaff={handleEditStaff}
          />
        </div>
      </div>

      <CreateStaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newStaff) => {
          setStaffList([...staffList, newStaff]);
          setIsAddModalOpen(false);
        }}
      />

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditStaff={handleSaveEditedStaff}
        staff={staffToEdit}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStaffToDelete(null);
        }}
        onConfirm={handleDeleteStaff}
        title="Eliminar Usuario"
        message={`¿Estás seguro que deseas eliminar al usuario ${staffToDelete?.name}?`}
      />
    </div>
  );
};

export default Staff;
