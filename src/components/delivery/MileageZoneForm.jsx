import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import SinglePointMap from './SinglePointMap';
import { createMileageZone, updateMileageZone } from '../../services/deliveryZoneService';

const MileageZoneForm = ({ onClose, onAddZone, onZoneUpdated, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    coberturaLocalNombre: '',
    coberturaLocalHoraInicio: '09:00',
    coberturaLocalHoraFin: '22:00',
    coberturaLocalPedidoMinimo: '',
    coberturaLocalTiempoEstimado: '',
    distanciaBase: '',
    costoBase: '',
    incrementoPorKm: '',
    incrementoCosto: '',
    coberturaLocalId: initialData?.localId,
    coberturaLocalEstado: initialData?.coberturaLocalEstado || '1',
    coordenadasLocal: {
      latitude: initialData?.coordenadasLocal?.latitude || '-12.0464',
      longitude: initialData?.coordenadasLocal?.longitude || '-77.0428'
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        coordenadasLocal: initialData.coordenadasLocal || {
          latitude: '-12.0464',
          longitude: '-77.0428'
        }
      });
    }
  }, [initialData]);

  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const token = useSelector((state) => state.auth.accessToken);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      coordenadasLocal: {
        latitude: location.lat.toString(),
        longitude: location.lng.toString()
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        subDomain,
        localId,
        distanciaBase: parseFloat(formData.distanciaBase),
        costoBase: parseFloat(formData.costoBase),
        incrementoPorKm: parseFloat(formData.incrementoPorKm),
        incrementoCosto: parseFloat(formData.incrementoCosto),
        coordenadasLocal: {
          latitude: parseFloat(formData.coordenadasLocal.latitude),
          longitude: parseFloat(formData.coordenadasLocal.longitude)
        },
        coberturaLocalId: localId,
        coberturaLocalEstado: '1',
        type: 'mileage'
      };

      if (isEditing && initialData?._id) {
        const updatedZone = await updateMileageZone(initialData._id, payload, token);
        if (updatedZone) {
          onZoneUpdated({
            ...updatedZone,
            coberturaLocalId: localId,
            type: 'mileage'
          });
        }
      } else {
        const newZone = await createMileageZone(payload, token);
        if (newZone) {
          onAddZone({
            ...newZone,
            coberturaLocalId: localId,
            type: 'mileage'
          });
        }
      }
      
      toast.success(`Zona ${isEditing ? 'actualizada' : 'creada'} exitosamente`);
      onClose();
    } catch (error) {
      console.error('Error al guardar la zona:', error);
      toast.error(error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la zona`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-6">
        {/* Columna izquierda - Formulario */}
        <div className="space-y-6">
          {/* Sección Información Básica */}
          <div className="glass-container p-4 space-y-4">
            <h3 className="text-sm font-semibold text-cartaai-white/90">Información Básica</h3>
            <div>
              <Label className="text-cartaai-white">Nombre de la zona</Label>
              <Input
                name="coberturaLocalNombre"
                value={formData.coberturaLocalNombre}
                onChange={handleInputChange}
                className="glass-input"
              />
            </div>
            <div>
              <Label className="text-cartaai-white">Tiempo estimado (min)</Label>
              <Input
                name="coberturaLocalTiempoEstimado"
                value={formData.coberturaLocalTiempoEstimado}
                onChange={handleInputChange}
                type="number"
                className="glass-input w-[120px]"
              />
            </div>
          </div>

          {/* Sección Configuración de Costos */}
          <div className="glass-container p-4 space-y-4">
            <h3 className="text-sm font-semibold text-cartaai-white/90">Configuración de Costos</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-cartaai-white">Distancia base (km)</Label>
                <Input
                  name="distanciaBase"
                  value={formData.distanciaBase}
                  onChange={handleInputChange}
                  type="number"
                  className="glass-input w-[120px]"
                />
              </div>
              <div>
                <Label className="text-cartaai-white">Costo base (S/)</Label>
                <Input
                  name="costoBase"
                  value={formData.costoBase}
                  onChange={handleInputChange}
                  type="number"
                  className="glass-input w-[120px]"
                />
              </div>
              <div>
                <Label className="text-cartaai-white">Incremento por KM</Label>
                <Input
                  name="incrementoPorKm"
                  value={formData.incrementoPorKm}
                  onChange={handleInputChange}
                  type="number"
                  className="glass-input w-[120px]"
                />
              </div>
              <div>
                <Label className="text-cartaai-white">Costo por incremento (S/)</Label>
                <Input
                  name="incrementoCosto"
                  value={formData.incrementoCosto}
                  onChange={handleInputChange}
                  type="number"
                  className="glass-input w-[120px]"
                />
              </div>
            </div>
          </div>

          {/* Sección Horarios y Pedido Mínimo */}
          <div className="glass-container p-4 space-y-4">
            <h3 className="text-sm font-semibold text-cartaai-white/90">Horarios y Pedido Mínimo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-cartaai-white">Hora de inicio</Label>
                <Input
                  name="coberturaLocalHoraInicio"
                  value={formData.coberturaLocalHoraInicio}
                  onChange={handleInputChange}
                  type="time"
                  className="glass-input w-[120px]"
                />
              </div>
              <div>
                <Label className="text-cartaai-white">Hora de fin</Label>
                <Input
                  name="coberturaLocalHoraFin"
                  value={formData.coberturaLocalHoraFin}
                  onChange={handleInputChange}
                  type="time"
                  className="glass-input w-[120px]"
                />
              </div>
            </div>
            <div>
              <Label className="text-cartaai-white">Pedido mínimo (S/)</Label>
              <Input
                name="coberturaLocalPedidoMinimo"
                value={formData.coberturaLocalPedidoMinimo}
                onChange={handleInputChange}
                type="number"
                className="glass-input w-[120px]"
              />
            </div>
          </div>
        </div>

        {/* Columna derecha - Mapa */}
        <div className="space-y-4">
          <div className="glass-container p-4 space-y-4">
            <h3 className="text-sm font-semibold text-cartaai-white/90">Ubicación del Local</h3>
            <div className="h-[calc(100vh-300px)] rounded-lg overflow-hidden">
              <SinglePointMap
                initialLocation={formData.coordenadasLocal}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/10"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-cartaai-red hover:bg-cartaai-red/80"
        >
          {isEditing ? 'Guardar cambios' : 'Crear zona'}
        </Button>
      </div>
    </form>
  );
};

export default MileageZoneForm; 