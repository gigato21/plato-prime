import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Plus, Check } from 'lucide-react';
import { createDeliveryCompany } from '../services/superAdminDeliveryService';
import { useToast } from "@/components/ui/use-toast";

const CreateCompanyForm = ({ onSuccess, isExpanded: initialExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    address: '',
    phone: '',
    email: '',
    contactPerson: '',
    active: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name.trim() || !formData.taxId.trim()) {
      toast({
        title: "Error",
        description: "Nombre y Tax ID son campos obligatorios",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await createDeliveryCompany(formData);
      
      toast({
        title: "Éxito",
        description: "Empresa de delivery creada correctamente",
      });
      
      // Resetear el formulario
      setFormData({
        name: '',
        taxId: '',
        address: '',
        phone: '',
        email: '',
        contactPerson: '',
        active: true
      });
      
      // Mostrar animación de éxito
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsExpanded(false);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la empresa de delivery",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!isExpanded ? (
        <Button 
          onClick={() => setIsExpanded(true)} 
          className="glass-button bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border-[#3B82F6]/20 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva Empresa
        </Button>
      ) : (
        <div className="glass-container p-6 rounded-lg animate-in fade-in duration-300">
          <h2 className="text-xl font-semibold text-white mb-4">Crear Empresa de Delivery</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nombre <span className="text-[#ff4d4f]">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre de la empresa"
                  className="glass-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxId" className="text-white">
                  Tax ID <span className="text-[#ff4d4f]">*</span>
                </Label>
                <Input
                  id="taxId"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleChange}
                  placeholder="Identificación fiscal"
                  className="glass-input"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-white">Dirección</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Dirección completa (opcional)"
                className="glass-input min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Teléfono de contacto"
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email de contacto"
                  className="glass-input"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="text-white">Persona de Contacto</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Nombre de la persona de contacto"
                className="glass-input"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active" className="text-white">Empresa activa</Label>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button 
                type="button" 
                className="glass-button bg-white/20 hover:bg-white/30 border-white/20"
                onClick={() => setIsExpanded(false)}
                disabled={isSubmitting || isSuccess}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="glass-button bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border-[#3B82F6]/20 text-white min-w-[100px]"
                disabled={isSubmitting || isSuccess}
              >
                {isSubmitting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : isSuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  "Crear Empresa"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateCompanyForm; 