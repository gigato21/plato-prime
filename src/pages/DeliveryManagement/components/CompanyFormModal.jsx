import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const CompanyFormModal = ({ isOpen, onClose, onSubmit, company, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    address: '',
    phone: '',
    email: '',
    contactPerson: '',
    active: true
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        taxId: company.taxId || '',
        address: company.address || '',
        phone: company.phone || '',
        email: company.email || '',
        contactPerson: company.contactPerson || '',
        active: company.active !== undefined ? company.active : true
      });
    } else {
      setFormData({
        name: '',
        taxId: '',
        address: '',
        phone: '',
        email: '',
        contactPerson: '',
        active: true
      });
    }
  }, [company, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10 text-cartaai-white sm:max-w-md z-[9999]">
        <DialogHeader>
          <DialogTitle>{company ? 'Editar Empresa' : 'Nueva Empresa'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
          <div>
            <Label htmlFor="taxId">Tax ID *</Label>
            <Input
              id="taxId"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              className="glass-input"
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="glass-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="glass-input"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="contactPerson">Contacto</Label>
            <Input
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="glass-input"
            />
          </div>
          <div>
            <Label htmlFor="active">Estado</Label>
            <Switch
              id="active"
              name="active"
              checked={formData.active}
              onCheckedChange={(value) => setFormData(prev => ({ ...prev, active: value }))}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyFormModal; 