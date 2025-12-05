import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector, useDispatch } from 'react-redux';
import { getApiUrls } from '@/config/api';
import { setLocals, setLoading, setError } from '@/redux/slices/localsSlice';
import { Loader } from "lucide-react";
import { toast } from "sonner";

const SelectLocalsModal = ({ isOpen, onClose, onConfirm, title }) => {
  const API_URLS = getApiUrls();
  const [selectedLocals, setSelectedLocals] = useState([]);
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const { locals, isLoading, error } = useSelector((state) => state.locals);

  useEffect(() => {
    const fetchLocals = async () => {
      if (localId === "-1" && locals.length === 0) {
        dispatch(setLoading());
        try {
          const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/locals/${subDomain}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          });
          
          if (!response.ok) throw new Error('Error al cargar locales');
          
          const data = await response.json();
          if (data.type === "1") {
            // Filtramos el local -1 ya que no necesitamos mostrarlo en la selección
            const filteredLocals = data.data.filter(local => local.localId !== "-1");
            dispatch(setLocals(filteredLocals));
          } else {
            throw new Error(data.message || 'Error al cargar locales');
          }
        } catch (error) {
          dispatch(setError(error.message));
          toast.error("Error al cargar los locales");
        }
      }
    };

    fetchLocals();
  }, [dispatch, accessToken, subDomain, localId, locals.length]);

  const handleToggleLocal = (localId) => {
    setSelectedLocals(prev => {
      if (prev.includes(localId)) {
        // Si se deselecciona un local, también quitar el "-1"
        const filtered = prev.filter(id => id !== localId && id !== "-1");
        return filtered;
      } else {
        // Si se seleccionan todos los locales, incluir el "-1"
        const newSelected = [...prev, localId];
        if (newSelected.length === locals.length) {
          return ["-1", ...newSelected];
        }
        return newSelected;
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      // Incluir todos los localIds incluyendo el "-1"
      const allLocalIds = ["-1", ...locals.map(local => local.localId)];
      setSelectedLocals(allLocalIds);
    } else {
      setSelectedLocals([]);
    }
  };

  const handleConfirm = () => {
    if (selectedLocals.length === 0) {
      toast.error("Debes seleccionar al menos un local");
      return;
    }
    onConfirm(selectedLocals);
    setSelectedLocals([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader className="w-6 h-6 text-cartaai-red animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              {error}
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2 border-b border-cartaai-white/10 pb-2">
                <Checkbox
                  id="select-all"
                  checked={selectedLocals.length === locals.length}
                  onCheckedChange={handleSelectAll}
                  className="border-2 border-cartaai-white/50 data-[state=checked]:bg-cartaai-red data-[state=checked]:border-cartaai-red"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-cartaai-white"
                >
                  Seleccionar todos
                </label>
              </div>
              {locals.map((local) => (
                <div key={local.localId} className="flex items-center space-x-2">
                  <Checkbox
                    id={`local-${local.localId}`}
                    checked={selectedLocals.includes(local.localId)}
                    onCheckedChange={() => handleToggleLocal(local.localId)}
                    className="border-2 border-cartaai-white/50 data-[state=checked]:bg-cartaai-red data-[state=checked]:border-cartaai-red"
                  />
                  <label
                    htmlFor={`local-${local.localId}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-cartaai-white"
                  >
                    {local.localNombreComercial} - {local.localDireccion}
                  </label>
                </div>
              ))}
            </>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleConfirm}
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectLocalsModal;