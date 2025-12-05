import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createDriver, updateDriver, deleteDriver, fetchDriversByCompany, fetchIndependentDrivers, fetchDrivers, linkDriverToRestaurant, unlinkDriverFromRestaurant } from '../services/deliveryServices';
import DriverFormModal from './DriverFormModal';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssignDriveModal } from './AssignDriveModal';
import { UnassignDriverModal } from './UnassignDriverModal';

const DriversSection = ({ drivers, setDrivers, companies, isLoading, error, subDomain, localId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [driverToEdit, setDriverToEdit] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const { toast } = useToast();
  const [assignDriverToLocal, setAssignDriverToLocal] = useState(false);
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
  const [driverToUnassign, setDriverToUnassign] = useState(null);

  useEffect(() => {
    filterDrivers();
  }, [drivers, filterType, selectedCompanyId, searchTerm]);

  const filterDrivers = async () => {
    let filteredList = [...drivers];
    
    // Filtrar por tipo
    if (filterType === "independent") {
      filteredList = filteredList.filter(driver => !driver.company);
    } else if (filterType === "company" && selectedCompanyId) {
      filteredList = filteredList.filter(driver => driver.company?._id === selectedCompanyId);
    }
    
    // Aplicar búsqueda
    if (searchTerm) {
      filteredList = filteredList.filter(driver => 
        `${driver.firstName} ${driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.phone.includes(searchTerm)
      );
    }
    
    setFilteredDrivers(filteredList);
  };
  
  const loadFilteredDrivers = async () => {
    try {
      let response;
      if (filterType === "independent") {
        response = await fetchIndependentDrivers(subDomain, localId);
      } else if (filterType === "company" && selectedCompanyId) {
        response = await fetchDriversByCompany(selectedCompanyId, subDomain, localId);
      } else {
        response = await fetchDrivers(subDomain, localId);
      }
      
      if (response.type === "1") {
        setDrivers(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching filtered drivers:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los conductores",
        variant: "destructive",
      });
    }
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    if (value !== "company") {
      setSelectedCompanyId("");
    }
  };

  const handleCreateDriver = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await createDriver(formData, subDomain, localId);
      
      if (response && response.data) {
        setDrivers([...drivers, response.data]);
        setIsFormOpen(false);
        toast({
          title: "Éxito",
          description: "Conductor creado correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el conductor",
        variant: "destructive",
      });
      console.error('Error creating driver:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateDriver = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await updateDriver(driverToEdit._id, formData);
      setDrivers(drivers.map(driver => 
        driver._id === driverToEdit._id ? response.data : driver
      ));
      setIsFormOpen(false);
      setDriverToEdit(null);
      toast({
        title: "Éxito",
        description: "Conductor actualizado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el conductor",
        variant: "destructive",
      });
      console.error('Error updating driver:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDriver = async () => {
    try {
      await deleteDriver(driverToDelete._id);
      setDrivers(drivers.filter(driver => driver._id !== driverToDelete._id));
      setIsDeleteDialogOpen(false);
      setDriverToDelete(null);
      toast({
        title: "Éxito",
        description: "Conductor eliminado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el conductor",
        variant: "destructive",
      });
      console.error('Error deleting driver:', error);
    }
  };

  const handleToggleAvailable = async (driver) => {
    try {
      const response = await updateDriver(driver._id, { available: !driver.available });
      setDrivers(drivers.map(d => 
        d._id === driver._id ? response.data : d
      ));
      toast({
        title: "Éxito",
        description: `Conductor ${response.data.available ? 'disponible' : 'no disponible'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del conductor",
        variant: "destructive",
      });
      console.error('Error toggling driver availability:', error);
    }
  };

  const handleToggleActive = async (driver) => {
    try {
      const response = await updateDriver(driver._id, { active: !driver.active });
      setDrivers(drivers.map(d => 
        d._id === driver._id ? response.data : d
      ));
      toast({
        title: "Éxito",
        description: `Conductor ${response.data.active ? 'activado' : 'desactivado'} correctamente`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del conductor",
        variant: "destructive",
      });
      console.error('Error toggling driver status:', error);
    }
  };

  const handleEditClick = (driver) => {
    setDriverToEdit(driver);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (driver) => {
    setDriverToDelete(driver);
    setIsDeleteDialogOpen(true);
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c._id === companyId);
    return company ? company.name : 'Independiente';
  };

  // Función para asignar un conductor a un local específico
  const handleAssignDriverToLocal = async (driverId, localIds) => {
    try {
      await linkDriverToRestaurant(driverId, subDomain, localIds);
      
      // Refrescar la lista de conductores
      loadFilteredDrivers();
      
      toast({
        title: "Éxito",
        description: "Conductor asignado correctamente al local",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar el conductor al local",
        variant: "destructive",
      });
      console.error('Error assigning driver to local:', error);
    }
  };

  // Función para desasignar un conductor de un local específico
  const handleUnassignDriverFromLocal = async (driverId) => {
    try {
      await unlinkDriverFromRestaurant(driverId, subDomain, [localId]);
      
      // Eliminar el conductor de la lista actual
      setDrivers(drivers.filter(driver => driver._id !== driverId));
      
      toast({
        title: "Éxito",
        description: "Conductor desasignado correctamente del local",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo desasignar el conductor del local",
        variant: "destructive",
      });
      console.error('Error unassigning driver from local:', error);
    }
  };

  // Función para desasignar un conductor de locales específicos
  const handleUnassignDriverFromLocals = async (driverId, localIds) => {
    try {
      await unlinkDriverFromRestaurant(driverId, subDomain, localIds);
      
      // Refrescar la lista de conductores
      loadFilteredDrivers();
      
      toast({
        title: "Éxito",
        description: "Conductor desasignado correctamente de los locales",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo desasignar el conductor de los locales",
        variant: "destructive",
      });
      console.error('Error unassigning driver from locals:', error);
    }
  };

  // Modificar la función existente para abrir el modal
  const handleUnassignClick = (driver) => {
    if (localId === "-1") {
      // Si estamos en el localId -1, abrimos el modal para seleccionar locales
      setDriverToUnassign(driver);
      setIsUnassignModalOpen(true);
    } else {
      // Si no, usamos la función existente
      handleUnassignDriverFromLocal(driver._id);
    }
  };

  return (
    <div className="glass-container p-6 rounded-lg space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <Select value={filterType} onValueChange={handleFilterTypeChange}>
            <SelectTrigger className="glass-input w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent className="bg-cartaai-black text-cartaai-white border-cartaai-white/10 z-[99999]">
              <SelectItem value="all">Todos los conductores</SelectItem>
              <SelectItem value="independent">Independientes</SelectItem>
              <SelectItem value="company">Por empresa</SelectItem>
            </SelectContent>
          </Select>
          
          {filterType === "company" && (
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="glass-input w-[180px]">
                <SelectValue placeholder="Seleccionar empresa" />
              </SelectTrigger>
              <SelectContent className="bg-cartaai-black text-cartaai-white border-cartaai-white/10 z-[99999]">
                {companies.map(company => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cartaai-white/70" />
            <Input
              placeholder="Buscar conductor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 glass-input w-full"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => {
            setAssignDriverToLocal(true);
          }} className="glass-button-blue">
            <Plus className="mr-2 h-4 w-4" /> Asignar conductor a local
          </Button>
          
          <Button 
            onClick={() => {
              setDriverToEdit(null);
              setIsFormOpen(true);
            }} 
            className="glass-button-blue"
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo Conductor
          </Button>
        </div>
      </div>


      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      ) : error ? (
        <div className="text-[#ff4d4f] text-center py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {filteredDrivers.length === 0 ? (
            <div className="col-span-full text-center py-8 text-cartaai-white/70">
              No hay conductores registrados con los filtros seleccionados
            </div>
          ) : (
            filteredDrivers.map((driver) => (
              <div 
                key={driver._id} 
                className="glass-container p-3 rounded-lg border border-cartaai-white/10 hover:border-cartaai-white/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-semibold text-cartaai-white truncate max-w-[150px]">
                    {driver.firstName} {driver.lastName}
                  </h3>
                    <p className="text-sm text-cartaai-white/60 truncate">{driver.phone}</p>
                    <p className="text-xs text-cartaai-white/60 truncate max-w-[150px]">
                      {driver.company ? getCompanyName(driver.company) : 'Independiente'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <Badge variant={driver.available ? "success" : "secondary"} className="text-xs mb-1 flex items-center space-x-1 py-0 h-5">
                    {driver.available ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                        <span>Disponible</span>
                        </>
                    ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                        <span>No disponible</span>
                        </>
                      )}
                      </Badge>
                    
                    <div className="flex items-center gap-1">
                      {/* Menú desplegable existente */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#151515] border-white/10 text-white">
                          <DropdownMenuItem 
                            onClick={() => handleEditClick(driver)}
                            className="cursor-pointer hover:bg-white/10"
                          >
                            Editar
                          </DropdownMenuItem>
                          
                          {/* Siempre mostramos la opción de desasignar */}
                          <DropdownMenuItem 
                            onClick={() => handleUnassignClick(driver)}
                            className="cursor-pointer hover:bg-[#ff4d4f]/20 text-[#ff4d4f]"
                          >
                            Desasignar
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleToggleAvailable(driver)}
                            className="cursor-pointer hover:bg-white/10"
                          >
                            {driver.available ? 'Marcar No Disponible' : 'Marcar Disponible'}
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => handleToggleActive(driver)}
                            className="cursor-pointer hover:bg-white/10"
                          >
                            {driver.active ? 'Desactivar' : 'Activar'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-cartaai-white/70">
                  {(driver.vehicleModel || driver.licensePlate) && (
                    <p className="truncate">
                      Vehículo: {driver.vehicleModel} {driver.licensePlate ? `(${driver.licensePlate})` : ''}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <DriverFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setDriverToEdit(null);
        }}
        onSubmit={driverToEdit ? handleUpdateDriver : handleCreateDriver}
        driver={driverToEdit}
        companies={companies}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteDriver}
        title="Eliminar Conductor"
        message={`¿Estás seguro de eliminar al conductor ${driverToDelete?.firstName} ${driverToDelete?.lastName}? Esta acción no se puede deshacer.`}
      />
    <AssignDriveModal
      isOpen={assignDriverToLocal}
      onClose={() => setAssignDriverToLocal(false)}
      handleAssignDriver={handleAssignDriverToLocal}
      isLoading={isLoading}
      error={error}
      selectedDriver={selectedDriver}
      setSelectedDriver={setSelectedDriver}
    />
    <UnassignDriverModal
      isOpen={isUnassignModalOpen}
      onClose={() => setIsUnassignModalOpen(false)}
      handleUnassignDriver={handleUnassignDriverFromLocals}
      isLoading={isLoading}
      error={error}
      driver={driverToUnassign}
    />
    </div>
  );
};

export default DriversSection; 