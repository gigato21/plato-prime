import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader, MoreVertical } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { fetchAllCompanies, linkCompanyToRestaurant, unlinkCompanyFromRestaurant } from '../services/deliveryServices';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useToast } from "@/components/ui/use-toast";
import AssignCompanyModal from './AssignCompanyModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DeliveryCompaniesSection = ({ companies, setCompanies, isLoading, error, subDomain, localId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [isLoadingAvailableCompanies, setIsLoadingAvailableCompanies] = useState(false);
  const { toast } = useToast();

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.contactPerson && company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    // Cuando se abre el modal de asignación, cargar las empresas disponibles
    if (isFormOpen) {
      loadAvailableCompanies();
    }
  }, [isFormOpen]);

  const loadAvailableCompanies = async () => {
    setIsLoadingAvailableCompanies(true);
    try {
      const response = await fetchAllCompanies();
      
      if (response && Array.isArray(response.data)) {
        // Filtramos las empresas que ya están asignadas al restaurante
        const assignedCompanyIds = companies.map(company => company._id);
        const availableCompaniesToAssign = response.data.filter(
          company => !assignedCompanyIds.includes(company._id)
        );
        
        setAvailableCompanies(availableCompaniesToAssign);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las empresas disponibles",
        variant: "destructive",
      });
      console.error('Error loading available companies:', error);
    } finally {
      setIsLoadingAvailableCompanies(false);
    }
  };

  const handleAssignCompany = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await linkCompanyToRestaurant(formData);
      
      // Buscamos la empresa recién asignada en la lista de disponibles
      const assignedCompany = availableCompanies.find(c => c._id === formData.companyId);
      
      if (assignedCompany && response.success) {
        // Añadimos la empresa a la lista de empresas del restaurante
        setCompanies([...companies, assignedCompany]);
        setIsFormOpen(false);
        toast({
          title: "Éxito",
          description: "Empresa de delivery asignada correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar la empresa de delivery",
        variant: "destructive",
      });
      console.error('Error assigning company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (company) => {
    try {
      // Aquí solo actualizamos el estado de active/inactive en la relación
      const response = await linkCompanyToRestaurant({
        companyId: company._id,
        subDomain,
        localId,
        active: !company.active
      });
      
      if (response.success) {
        // Actualizar el estado local
        setCompanies(companies.map(c => 
          c._id === company._id ? { ...c, active: !company.active } : c
        ));
        
        toast({
          title: "Éxito",
          description: `Empresa ${!company.active ? 'activada' : 'desactivada'} correctamente`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar el estado de la empresa",
        variant: "destructive",
      });
      console.error('Error toggling company status:', error);
    }
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDeleteDialogOpen(false);
    // Asegurarnos de limpiar la referencia a la empresa después de cerrar el diálogo
    setTimeout(() => setCompanyToDelete(null), 300);
  };

  const handleDeleteCompany = async () => {
    try {
      // Usamos la nueva función para desasignar la empresa del restaurante
      await unlinkCompanyFromRestaurant({
        companyId: companyToDelete._id,
        subDomain,
        localId
      });
      
      setCompanies(companies.filter(company => company._id !== companyToDelete._id));
      setIsDeleteDialogOpen(false);
      setTimeout(() => setCompanyToDelete(null), 300);
      
      toast({
        title: "Éxito",
        description: "Empresa de delivery desasignada correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo desasignar la empresa de delivery",
        variant: "destructive",
      });
      console.error('Error unlinking company:', error);
    }
  };

  return (
    <div className="glass-container p-6 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <Input
            placeholder="Buscar empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 glass-input"
          />
        </div>
        <Button 
          onClick={() => {
            setIsFormOpen(true);
          }} 
          className="bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border-[#3B82F6]/20 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Asignar Empresa
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-[#3B82F6]" />
        </div>
      ) : error ? (
        <div className="text-[#ff4d4f] text-center py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {filteredCompanies.length === 0 ? (
            <div className="col-span-full text-center py-8 text-white/70">
              No hay empresas de delivery asignadas a este restaurante
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <div 
                key={company._id} 
                className="glass-container p-3 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-semibold text-white truncate max-w-[180px]">{company.name}</h3>
                    <p className="text-sm text-white/60">{company.taxId}</p>
                    {company.contactPerson && <p className="text-xs text-white/60">{company.contactPerson}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Badge 
                      className={`text-xs py-0 h-5 ${company.active ? 'bg-[#10B981]/70 hover:bg-[#10B981]/80' : 'bg-[#6B7280]/70 hover:bg-[#6B7280]/80'}`}
                    >
                      {company.active ? 'Activa' : 'Inactiva'}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#151515] border-white/10 text-white">
                        <DropdownMenuItem 
                          onClick={() => handleToggleActive(company)}
                          className="cursor-pointer hover:bg-white/10"
                        >
                          {company.active ? 'Desactivar' : 'Activar'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(company)}
                          className="cursor-pointer hover:bg-[#ff4d4f]/20 text-[#ff4d4f]"
                        >
                          Desasignar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-white/70">
                  {company.phone && (
                    <p className="truncate">{company.phone}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <AssignCompanyModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAssignCompany}
        isSubmitting={isSubmitting}
        availableCompanies={availableCompanies}
        isLoadingCompanies={isLoadingAvailableCompanies}
        subDomain={subDomain}
        localId={localId}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteCompany}
        title="Desasignar Empresa"
        message={`¿Estás seguro de desasignar la empresa ${companyToDelete?.name || ''} de este restaurante? Esta acción no eliminará la empresa del sistema.`}
      />
    </div>
  );
};

export default DeliveryCompaniesSection; 