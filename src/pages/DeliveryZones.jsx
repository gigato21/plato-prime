import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import ViewZoneModal from '../components/delivery/ViewZoneModal';
import ViewAllZonesModal from '../components/delivery/ViewAllZonesModal';
import AddDeliveryZoneModal from '../components/delivery/AddDeliveryZoneModal';
import DeliveryZonesHeader from '../components/delivery/DeliveryZonesHeader';
import DeliveryZonesTable from '../components/delivery/DeliveryZonesTable';
import { fetchDeliveryZones, deleteDeliveryZone } from '../services/deliveryZoneService';
import { Loader2 } from 'lucide-react';
import EditZoneModal from '../components/delivery/EditZoneModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DeliveryZones = () => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoneToDelete, setZoneToDelete] = useState(null);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const token = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const loadZones = async () => {
      try {
        setIsLoading(true);
        const zonesData = await fetchDeliveryZones(subDomain, localId);
        
        // Normalizar los tipos de zonas
        const normalizedZones = zonesData.map(zone => {
          if (zone.type) {
            // Si ya tiene type, lo dejamos como está
            return zone;
          }
          
          // Si no tiene type, lo determinamos por el coberturaLocalRuta
          return {
            ...zone,
            type: zone.coberturaLocalRuta?.length > 0 ? 
              ZONE_TYPES.POLYGONS : 
              ZONE_TYPES.SIMPLE
          };
        });

        setZones(normalizedZones);
      } catch (error) {
        console.error('Error fetching zones:', error);
        toast.error('Error al cargar las zonas de entrega');
      } finally {
        setIsLoading(false);
      }
    };

    if (subDomain && localId) {
      loadZones();
    }
  }, [subDomain, localId]);

  const handleViewZone = (zone) => {
    setSelectedZone(zone);
    setIsViewModalOpen(true);
  };

  const handleAddZone = (newZone) => {
    setZones(prevZones => [...prevZones, newZone]);
    toast.success('Zona de entrega creada exitosamente');
    setIsAddModalOpen(false);
  };

  const handleEditZone = (zone) => {
    setSelectedZone(zone);
    setIsEditModalOpen(true);
  };

  const handleZoneUpdated = (updatedZone) => {
    setZones(prev => prev.map(zone => 
      zone.coberturaLocalId === updatedZone.coberturaLocalId ? updatedZone : zone
    ));
    setIsEditModalOpen(false);
    setSelectedZone(null);
  };

  const handleDeleteZone = (zone) => {
    setZoneToDelete(zone);
  };

  const confirmDelete = async () => {
    try {
      await deleteDeliveryZone(zoneToDelete._id, token);
      setZones(prev => prev.filter(zone => zone._id !== zoneToDelete._id));
      toast.success('Zona eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la zona');
    } finally {
      setZoneToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-cartaai-red" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-in">
      <DeliveryZonesHeader 
        onViewAll={() => setIsViewAllModalOpen(true)}
        onAddZone={() => setIsAddModalOpen(true)}
      />

      {zones.length === 0 ? (
        <div className="glass-container p-8 text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">No hay zonas de entrega configuradas</h3>
          <p className="text-gray-700">
            Comienza creando tu primera zona de entrega para gestionar tus envíos
          </p>
        </div>
      ) : (
        <DeliveryZonesTable 
          zones={zones}
          onViewZone={handleViewZone}
          onEditZone={handleEditZone}
          onDeleteZone={handleDeleteZone}
        />
      )}

      <ViewZoneModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedZone(null);
        }}
        zone={selectedZone}
      />

      <ViewAllZonesModal
        isOpen={isViewAllModalOpen}
        onClose={() => setIsViewAllModalOpen(false)}
        zones={zones}
      />

      <AddDeliveryZoneModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddZone={handleAddZone}
      />

      <EditZoneModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedZone(null);
        }}
        zone={selectedZone}
        onZoneUpdated={handleZoneUpdated}
      />

      <AlertDialog open={!!zoneToDelete} onOpenChange={() => setZoneToDelete(null)}>
        <AlertDialogContent className="bg-cartaai-black border-cartaai-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-cartaai-white">
              ¿Estás seguro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-cartaai-white/70">
              Esta acción no se puede deshacer. Se eliminará permanentemente la zona
              "{zoneToDelete?.coberturaLocalNombre}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeliveryZones;