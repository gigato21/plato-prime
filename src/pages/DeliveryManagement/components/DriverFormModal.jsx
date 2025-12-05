import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector } from 'react-redux';
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader, X, ChevronDown, ChevronUp } from "lucide-react";
import { getApiUrls } from '@/config/api';

const DriverFormModal = ({ isOpen, onClose, onSubmit, driver, companies, isSubmitting }) => {
  const API_URLS = getApiUrls();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    licensePlate: '',
    vehicleModel: '',
    company: null,
    driverType: 'independent',
    active: true,
    available: false,
    localIds: [],
    subDomain: ''
  });
  
  const [showCompanyOptions, setShowCompanyOptions] = useState(false);
  const [showLocalsSelector, setShowLocalsSelector] = useState(false);
  const [locals, setLocals] = useState([]);
  const [isLoadingLocals, setIsLoadingLocals] = useState(false);
  const [localsError, setLocalsError] = useState(null);
  
  const accessToken = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);

  useEffect(() => {
    if (driver) {
      setFormData({
        firstName: driver.firstName || '',
        lastName: driver.lastName || '',
        phone: driver.phone || '',
        email: driver.email || '',
        licensePlate: driver.licensePlate || '',
        vehicleModel: driver.vehicleModel || '',
        company: driver.company?._id || driver.company || null,
        driverType: driver.company ? 'company' : 'independent',
        active: driver.active !== undefined ? driver.active : true,
        available: driver.available !== undefined ? driver.available : false,
        localIds: driver.localIds || [],
        subDomain: driver.subDomain || subDomain
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        licensePlate: '',
        vehicleModel: '',
        company: null,
        driverType: 'independent',
        active: true,
        available: false,
        localIds: localId === "-1" ? [] : [localId],
        subDomain: subDomain
      });
    }
  }, [driver, isOpen, localId, subDomain]);

  // Cargar locales cuando se abre el selector
  useEffect(() => {
    const fetchLocals = async () => {
      if (showLocalsSelector && subDomain) {
        setIsLoadingLocals(true);
        setLocalsError(null);
        try {
          const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/locals/${subDomain}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          });
          
          if (!response.ok) throw new Error('Error al cargar locales');
          
          const data = await response.json();
          if (data.type === "1") {
            const filteredLocals = data.data.filter(local => local.localId !== "-1");
            setLocals(filteredLocals);
          } else {
            throw new Error(data.message || 'Error al cargar locales');
          }
        } catch (error) {
          setLocalsError(error.message);
        } finally {
          setIsLoadingLocals(false);
        }
      }
    };

    fetchLocals();
  }, [showLocalsSelector, subDomain, accessToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDriverTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      driverType: value,
      company: value === 'independent' ? null : prev.company
    }));
  };

  const handleCompanyChange = (value) => {
    setFormData(prev => ({
      ...prev,
      company: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear una copia del formData con todos los campos necesarios
    const submitData = { 
      ...formData,
      subDomain: subDomain || formData.subDomain // Asegurarse de que subDomain siempre tenga un valor
    };
    
    // Eliminar el campo driverType que no es parte del modelo
    delete submitData.driverType;
    
    // Si es independiente, asegurarse de que company sea null
    if (formData.driverType === 'independent') {
      submitData.company = null;
    }
    
    // Validar localIds cuando estamos en localId -1
    if (localId === "-1" && (!submitData.localIds || submitData.localIds.length === 0)) {
      alert("Debes seleccionar al menos un local");
      return;
    }
    
    // Verificación adicional para asegurar que subDomain esté presente
    if (!submitData.subDomain) {
      console.error("Error: subDomain es requerido");
      alert("Error: No se pudo determinar el subdominio. Por favor, intenta nuevamente.");
      return;
    }
    
    console.log('Enviando datos al servidor:', submitData);
    onSubmit(submitData);
  };

  const handleToggleLocal = (localId) => {
    setFormData(prev => {
      const localIds = prev.localIds || [];
      if (localIds.includes(localId)) {
        return { ...prev, localIds: localIds.filter(id => id !== localId) };
      } else {
        return { ...prev, localIds: [...localIds, localId] };
      }
    });
  };

  const handleSelectAllLocals = (checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        localIds: locals.map(local => local.localId)
      }));
    } else {
      setFormData(prev => ({ ...prev, localIds: [] }));
    }
  };

  const handleRemoveLocal = (localIdToRemove) => {
    setFormData(prev => ({
      ...prev,
      localIds: prev.localIds.filter(id => id !== localIdToRemove)
    }));
  };

  // Componente auxiliar para mostrar los locales seleccionados
  const SelectedLocals = ({ localIds, onRemove }) => {
    if (!localIds || localIds.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {localIds.map(localId => (
          <Badge 
            key={localId} 
            className="bg-white/10 hover:bg-white/20 text-white flex items-center gap-1"
          >
            Local {localId}
            <button 
              type="button" 
              onClick={() => onRemove(localId)}
              className="hover:text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#151515] border-white/10 text-white sm:max-w-md z-[1000] absolute overflow-visible">
        <DialogHeader>
          <DialogTitle>{driver ? 'Editar Conductor' : 'Nuevo Conductor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="glass-input"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Apellido *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="glass-input"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="glass-input"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licensePlate">Placa</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
            <div>
              <Label htmlFor="vehicleModel">Modelo de vehículo</Label>
              <Input
                id="vehicleModel"
                name="vehicleModel"
                value={formData.vehicleModel}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
          </div>
          
          <div>
            <Label>Tipo de conductor</Label>
            <RadioGroup 
              value={formData.driverType} 
              onValueChange={handleDriverTypeChange}
              className="flex space-x-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="independent" id="independent" />
                <Label htmlFor="independent" className="cursor-pointer">Independiente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company" className="cursor-pointer">Asignado a empresa</Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.driverType === 'company' && (
            <div className="relative">
              <Label htmlFor="company">Empresa *</Label>
              <div 
                className="glass-input flex items-center justify-between cursor-pointer"
                onClick={() => setShowCompanyOptions(!showCompanyOptions)}
              >
                <span className={formData.company ? "text-white" : "text-white/50"}>
                  {formData.company 
                    ? companies.find(c => c._id === formData.company)?.name || "Selecciona una empresa"
                    : "Selecciona una empresa"}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50">
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </div>
              
              {showCompanyOptions && (
                <div className="absolute w-full bg-[#151515] border border-white/10 rounded-md mt-1 max-h-[200px] overflow-y-auto z-[99999] shadow-lg">
                  {companies.map(company => (
                    <div 
                      key={company._id} 
                      className={`px-3 py-2 hover:bg-white/10 cursor-pointer ${formData.company === company._id ? 'bg-blue-500/20' : ''}`}
                      onClick={() => {
                        handleCompanyChange(company._id);
                        setShowCompanyOptions(false);
                      }}
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Label htmlFor="available">Disponible</Label>
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(value) => setFormData(prev => ({ ...prev, available: value }))}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="active">Activo</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(value) => setFormData(prev => ({ ...prev, active: value }))}
              />
            </div>
          </div>
          
          {/* Sección para seleccionar locales (integrada en el formulario) */}
          {localId === "-1" && (
            <div className="border border-white/10 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <Label className="font-semibold">Locales asignados</Label>
                <Button 
                  type="button" 
                  variant="outline"
                  size="sm"
                  className="glass-button-sm flex items-center gap-1"
                  onClick={() => setShowLocalsSelector(!showLocalsSelector)}
                >
                  {showLocalsSelector ? (
                    <>
                      <ChevronUp size={16} />
                      <span>Ocultar</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} />
                      <span>Mostrar</span>
                    </>
                  )}
                </Button>
              </div>
              
              {/* Mostrar locales seleccionados como badges */}
              <SelectedLocals 
                localIds={formData.localIds} 
                onRemove={handleRemoveLocal} 
              />
              
              {/* Selector de locales expandible */}
              {showLocalsSelector && (
                <div className="mt-3 border-t border-white/10 pt-3">
                  {isLoadingLocals ? (
                    <div className="flex justify-center py-4">
                      <Loader className="animate-spin text-blue-500" />
                    </div>
                  ) : localsError ? (
                    <div className="text-red-500 text-center py-2">
                      {localsError}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-white/10">
                        <Checkbox 
                          id="select-all-locals-direct"
                          checked={formData.localIds.length === locals.length && locals.length > 0}
                          onCheckedChange={handleSelectAllLocals}
                          className="border-white/50"
                        />
                        <label 
                          htmlFor="select-all-locals-direct"
                          className="text-sm font-medium text-white cursor-pointer"
                        >
                          Seleccionar todos
                        </label>
                      </div>
                      
                      <div className="max-h-[200px] overflow-y-auto pr-2">
                        {locals.map(local => (
                          <div 
                            key={local.localId} 
                            className="flex items-center space-x-2 py-1.5"
                          >
                            <Checkbox 
                              id={`local-direct-${local.localId}`}
                              checked={formData.localIds.includes(local.localId)}
                              onCheckedChange={() => handleToggleLocal(local.localId)}
                              className="border-white/50"
                            />
                            <label 
                              htmlFor={`local-direct-${local.localId}`}
                              className="text-sm text-white cursor-pointer"
                            >
                              {local.localNombreComercial} - {local.localDireccion}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="glass-button">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="glass-button-blue">
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DriverFormModal; 