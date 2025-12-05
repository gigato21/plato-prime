import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const ConvertToModifierModal = ({ isOpen, onClose, product }) => {
  const API_URLS = getApiUrls();
  const [selectedOption, setSelectedOption] = useState('existing');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const accessToken = useSelector(state => state.auth.accessToken);
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener grupos de modificadores
  const { data: modifiers = [], isLoading: isLoadingModifiers, refetch: refetchModifiers } = useQuery({
    queryKey: ['modifiers'],
    queryFn: async () => {
      setIsLoading(true);
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (!response.ok) throw new Error('Error al cargar modificadores');
      setIsLoading(false);
      return response.json();
    }
  });

  // Crear nuevo grupo de modificadores
  const createModifierGroup = useMutation({
    mutationFn: async (name) => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/modificadores/create/${subDomain}/${localId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          rId: `MOD${Date.now()}`,
          source: "0",
          options: [],
          isMultiple: true,
          minQuantity: 0,
          maxQuantity: 999
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el grupo');
      }

      return response.json();
    },
    onSuccess: async (data) => {
      await refetchModifiers();
      setSelectedOption('existing');
      setSelectedGroupId(data.rId);
      toast({
        title: "Éxito",
        description: "Grupo creado correctamente. Ahora puedes convertir el producto.",
      });
      setIsCreatingGroup(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsCreatingGroup(false);
    }
  });

  // Convertir producto a modificador
  const convertToModifier = useMutation({
    mutationFn: async ({ modifierGroupId, originalProductId }) => {
      setIsLoading(true);
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/convert-to-modifier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          modifierGroupId,
          originalProductId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al convertir el producto');
      }

      return response.json();
    },
    onSuccess: () => {
      setIsLoading(false);
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['modifiers']);
      toast({
        title: "Éxito",
        description: "Producto convertido a modificador correctamente",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del grupo es requerido",
        variant: "destructive",
      });
      return;
    }
    setIsCreatingGroup(true);
    await createModifierGroup.mutateAsync(newGroupName);
  };

  const handleConvert = () => {
    if (!selectedGroupId) {
      toast({
        title: "Error",
        description: "Debes seleccionar un grupo",
        variant: "destructive",
      });
      return;
    }

    convertToModifier.mutate({
      modifierGroupId: selectedGroupId,
      originalProductId: product.rId
    });
  };

  if (isLoadingModifiers) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-cartaai-red" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convertir Producto a Modificador</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <RadioGroup
            value={selectedOption}
            onValueChange={setSelectedOption}
            className="gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing">Usar grupo existente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">Crear nuevo grupo</Label>
            </div>
          </RadioGroup>

          {selectedOption === 'existing' && (
            <div className="grid gap-2">
              <Label>Seleccionar grupo</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
              >
                <option value="">Seleccionar grupo...</option>
                {modifiers.map((modifier) => (
                  <option key={modifier.rId} value={modifier.rId}>
                    {modifier.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedOption === 'new' && (
            <div className="grid gap-2">
              <Label>Nombre del nuevo grupo</Label>
              <div className="flex gap-2">
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ingrese el nombre del grupo"
                  disabled={isCreatingGroup}
                />
                <Button 
                  onClick={handleCreateGroup}
                  disabled={isCreatingGroup || !newGroupName.trim()}
                >
                  {isCreatingGroup ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Crear'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConvert}
            disabled={
              !selectedGroupId ||
              selectedOption === 'new' ||
              isLoading
            }
            className="bg-cartaai-red hover:bg-cartaai-red/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Convirtiendo...
              </>
            ) : (
              'Convertir'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConvertToModifierModal; 