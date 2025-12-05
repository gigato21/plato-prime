import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { fetchAvailableLocals, assignLocalToUser, fetchAssignedLocals, updateUserBusiness, deleteUserBusiness } from '@/services/staffService';
import UserCardHeader from './UserCardHeader';
import UserRole from './UserRole';
import UserActions from './UserActions';
import LocalSelector from './LocalSelector';
import AssignedLocalsModal from './AssignedLocalsModal';

const UserCard = ({ user, onToggleStatus, onEdit, onDelete }) => {
  const [locals, setLocals] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [assignedLocals, setAssignedLocals] = useState([]);
  const [showSelect, setShowSelect] = useState(false);
  const [showLocalsModal, setShowLocalsModal] = useState(false);
  const { toast } = useToast();
  const token = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain);

  useEffect(() => {
    loadAssignedLocals();
    handleFetchLocals();
  }, [user._id, token]);

  const loadAssignedLocals = async () => {
    try {
      const locals = await fetchAssignedLocals(user._id, token);
      setAssignedLocals(locals);
    } catch (error) {
      console.error('Error al cargar los locales asignados:', error);
    }
  };

  const handleFetchLocals = async () => {
    setIsLoading(true);
    try {
      const availableLocals = await fetchAvailableLocals(subDomain, token);
      setLocals(availableLocals);
    } catch (error) {
      console.error(error.message);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los locales',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignLocal = async () => {
    if (!selectedLocal) return;
    setIsLoading(true);
    const localData = {
      name: selectedLocal.localDescripcion,
      userId: user._id,
      subDomain: selectedLocal.subdominio,
      localId: selectedLocal.localId,
    };
    try {
      await assignLocalToUser(localData, token);
      toast({
        title: 'Éxito',
        description: 'Local asignado correctamente',
      });
      await loadAssignedLocals();
    } catch (error) {
      console.error(error.message);
      toast({
        title: 'Error',
        description: 'No se pudo asignar el local',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setShowSelect(false);
    }
  };

  const handleUpdateLocal = async (localId, newData) => {
    setIsLoading(true);
    try {
      await updateUserBusiness(user._id, {
        localId,
        ...newData
      }, token);
      toast({
        title: 'Éxito',
        description: 'Local actualizado correctamente',
      });
      await loadAssignedLocals();
    } catch (error) {
      console.error(error.message);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el local',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocal = async (userId) => {
    setIsLoading(true);
    try {
      await deleteUserBusiness(userId, token);
      toast({
        title: 'Éxito',
        description: 'Local eliminado correctamente',
      });
      await loadAssignedLocals();
    } catch (error) {
      console.error(error.message);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el local',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-container shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl border border-white/10">
      <UserCardHeader user={user} />
      <UserRole role={user.role} />
      <UserActions 
        user={user}
        onToggleStatus={onToggleStatus}
        onEdit={onEdit}
        onDelete={onDelete}
        setShowSelect={setShowSelect}
        showSelect={showSelect}
        assignedLocals={assignedLocals}
        setShowLocalsModal={setShowLocalsModal}
        isLoading={isLoading}
      />

      <LocalSelector 
        showSelect={showSelect}
        locals={locals}
        selectedLocal={selectedLocal}
        onLocalSelect={setSelectedLocal}
        onAssign={handleAssignLocal}
        isLoading={isLoading}
      />

      <AssignedLocalsModal 
        isOpen={showLocalsModal}
        onClose={() => setShowLocalsModal(false)}
        assignedLocals={assignedLocals}
        onDelete={handleDeleteLocal}
        onUpdate={handleUpdateLocal}
        locals={locals}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserCard;