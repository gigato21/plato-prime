import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader, Phone, Mail, MapPin, User, Calendar, MoreVertical, Building2, Edit, Trash, Users } from 'lucide-react';
import { fetchDeliveryCompanies } from '../services/superAdminDeliveryService';
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditCompanyForm from './EditCompanyForm';
import DeleteCompanyModal from './DeleteCompanyModal';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();

  // Definimos la función formatDate que faltaba
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  const loadCompanies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchDeliveryCompanies();
      
      // Verificamos que la respuesta tenga la propiedad 'data'
      if (response && Array.isArray(response.data)) {
        setCompanies(response.data);
        setFilteredCompanies(response.data);
        
        // Opcional: mostrar mensaje toast
        if (response.message) {
          toast({
            description: response.message,
          });
        }
      } else {
        throw new Error("Formato de respuesta inválido");
      }
    } catch (error) {
      setError(error.message || "Ocurrió un error al cargar las empresas");
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las empresas de delivery",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar empresas al montar el componente
  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(company => 
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.taxId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.contactPerson && company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCompanies(filtered);
    }
  }, [searchTerm, companies]);

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  const handleDelete = (company) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  const handleCompanyUpdated = () => {
    loadCompanies();
    setIsEditModalOpen(false);
  };

  const handleCompanyDeleted = () => {
    loadCompanies();
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <Input
            placeholder="Buscar empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 glass-input"
          />
        </div>
        <Button 
          onClick={loadCompanies} 
          className="glass-button glass-button-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin mr-2" />
          ) : (
            "Actualizar Lista"
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-[#ff4d4f]" />
        </div>
      ) : error ? (
        <div className="text-[#ff4d4f] text-center py-6 glass-container p-4 rounded-lg">
          {error}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-12 glass-container p-6 rounded-lg">
          <p className="text-white/70">No se encontraron empresas de delivery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <div 
              key={company._id} 
              className="glass-container overflow-hidden rounded-lg shadow-lg border border-white/10 hover:border-white/30 transition-all duration-300 flex flex-col"
            >
              {/* Encabezado de la tarjeta con fondo de gradiente */}
              <div className="bg-gradient-to-r from-[#121212]/60 to-[#3B82F6]/30 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="bg-[#3B82F6]/30 p-2 rounded-full mr-3">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white truncate max-w-[150px]">
                        {company.name}
                      </h3>
                      <p className="text-sm text-white/80">{company.taxId}</p>
                    </div>
                  </div>
                  
                  <Badge 
                    className={`text-xs py-0 h-5 ${company.active ? 'bg-[#10B981]/70 hover:bg-[#10B981]/80' : 'bg-[#6B7280]/70 hover:bg-[#6B7280]/80'}`}
                  >
                    {company.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </div>
              
              {/* Cuerpo de la tarjeta */}
              <div className="p-4 flex-1">
                <div className="space-y-2 text-sm text-white/80">
                  {company.contactPerson && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-white/60" />
                      <span className="truncate">{company.contactPerson}</span>
                    </div>
                  )}
                  
                  {company.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-white/60" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  
                  {company.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-white/60" />
                      <span className="truncate">{company.email}</span>
                    </div>
                  )}
                  
                  {company.address && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-white/60" />
                      <span className="truncate">{company.address}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Pie de la tarjeta */}
              <div className="p-3 bg-[#121212]/30 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center text-xs text-white/50">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(company.createdAt)}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="glass-button-icon glass-button-sm bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border-[#3B82F6]/20"
                    title="Editar"
                    onClick={() => handleEdit(company)}
                  >
                    <Edit className="h-3.5 w-3.5 text-white" />
                  </Button>
                  <Button 
                    className="glass-button-icon glass-button-sm bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border-[#8B5CF6]/20"
                    title="Eliminar"
                    onClick={() => handleDelete(company)}
                  >
                    <Trash className="h-3.5 w-3.5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-3xl">
          {selectedCompany && (
            <EditCompanyForm 
              company={selectedCompany}
              onClose={() => setIsEditModalOpen(false)}
              onSuccess={handleCompanyUpdated}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de eliminación */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
          {selectedCompany && (
            <DeleteCompanyModal
              company={selectedCompany}
              onClose={() => setIsDeleteModalOpen(false)}
              onSuccess={handleCompanyDeleted}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesList; 