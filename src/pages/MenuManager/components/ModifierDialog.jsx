import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import SelectLocalsModal from "./SelectLocalsModal";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../components/ui/use-toast";
import { getApiUrls } from "@/config/api";
import { EModAction } from "@/types/Action-mod-type";

const ModifierDialog = ({ 
  isOpen, 
  onOpenChange, 
  title, 
  onSubmit, 
  initialData, 
  options, 
  isLoading,
  setIsAddModalOpen,
  actionType,
  rId,
}) => {
  const localId = useSelector((state) => state.auth.localId);
  const [isSelectLocalsModalOpen, setIsSelectLocalsModalOpen] = useState(false);
  const API_URLS = getApiUrls();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const [formData, setFormData] = useState({
    name: '',
    isMultiple: false,
    minQuantity: 0,
    maxQuantity: 1,
    options: []
  });

  const handleLocalsSelected = async (selectedLocals) => {
    setIsAddModalOpen(false);
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/create-multiple-local/${subDomain}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          localsId: selectedLocals,
          rId: `MOD${Date.now()}`,
          source: "0",
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el modificador');
      }
      queryClient.invalidateQueries(['modifiers']);
      toast({
        title: "Éxito",
        description: "Modificador creado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el modificador",
        variant: "destructive",
      });
    }
  }

  const handleLocalsSelectedPatch = async (selectedLocals) => {
    console.log(rId)
    setIsAddModalOpen(false);
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/update-multiple-local`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          subDomain: subDomain,
          localsId: selectedLocals,
          rId: rId,
          source: "0",
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el modificador');
      }
      queryClient.invalidateQueries(['modifiers']);
      toast({
        title: "Éxito",
        description: "Modificador editado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al editar el modificador",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        isMultiple: initialData.isMultiple || false,
        minQuantity: initialData.minQuantity || 0,
        maxQuantity: initialData.maxQuantity || 1,
        options: initialData.options.map(opt => ({
          optionId: opt.optionId,
          name: opt.name,
          price: opt.price,
          stock: opt.stock
        }))
      });
    } else {
      setFormData({
        name: '',
        isMultiple: false,
        minQuantity: 0,
        maxQuantity: 1,
        options: []
      });
    }
  }, [initialData]);

  const handleOptionToggle = (option) => {
    setFormData(prev => {
      const optionExists = prev.options.some(opt => opt.optionId === option.rId);
      
      if (optionExists) {
        return {
          ...prev,
          options: prev.options.filter(opt => opt.optionId !== option.rId)
        };
      } else {
        return {
          ...prev,
          options: [...prev.options, {
            optionId: option.rId,
            name: option.name,
            price: option.price,
            stock: option.stock
          }]
        };
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-700 dark:text-gray-200">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="glass-input"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isMultiple"
                checked={formData.isMultiple}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, isMultiple: checked }))
                }
              />
              <Label htmlFor="isMultiple">Selección múltiple</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantidad mínima</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    minQuantity: parseInt(e.target.value) 
                  }))}
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Cantidad máxima</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.maxQuantity}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    maxQuantity: parseInt(e.target.value) 
                  }))}
                  className="glass-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Opciones</Label>
              <div className="grid grid-cols-2 gap-2">
                {options.map((option) => (
                  <div key={option.rId} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.rId}
                      checked={formData.options.some(opt => opt.optionId === option.rId)}
                      onCheckedChange={() => handleOptionToggle(option)}
                    />
                    <Label htmlFor={option.rId}>{option.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-cartaai-white"
            >
              Cancelar
            </Button>
            {
              localId === "-1" ?
            <Button
              type="button"
              className="bg-cartaai-red hover:bg-cartaai-red/80"
              onClick={() =>{
                  setIsSelectLocalsModalOpen(true)
                }}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
            :
            <Button
              type="submit"
              className="bg-cartaai-red hover:bg-cartaai-red/80"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Button>
          }
         <SelectLocalsModal
        isOpen={isSelectLocalsModalOpen}
        onClose={() => setIsSelectLocalsModalOpen(false)}
        onConfirm={actionType === EModAction.Create ? handleLocalsSelected : handleLocalsSelectedPatch}
        title="Seleccionar locales para actualizar el producto"
      />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModifierDialog;