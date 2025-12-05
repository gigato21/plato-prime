import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from 'react-redux';
import { getApiUrls } from '@/config/api';
import { useToast } from "@/components/ui/use-toast";

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
  const API_URLS = getApiUrls();
  const [newCategory, setNewCategory] = useState({ name: '', active: true });
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { toast } = useToast();

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es obligatorio",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/categorias`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rId: `CATEGORIA_${Date.now()}`, // Generamos un ID único
          source: "MANUAL",
          name: newCategory.name,
          order: "1" // Por defecto
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear la categoría');
      }

      const data = await response.json();
      onAddCategory({ ...data, active: true });
      setNewCategory({ name: '', active: true });
      toast({
        title: "Éxito",
        description: "Categoría creada correctamente",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      });
      console.error('Error creating category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">Añadir nueva categoría</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Nombre de la categoría"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className="bg-cartaai-white/10 text-cartaai-white"
        />
        <DialogFooter>
          <Button 
            onClick={handleAddCategory} 
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Añadir categoría'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;