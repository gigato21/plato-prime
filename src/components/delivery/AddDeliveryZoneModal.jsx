import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSelector } from 'react-redux';
import { getApiUrls } from '@/config/api';
import DrawZoneMap from './DrawZoneMap';
import { toast } from "sonner";
import { MapPin, Map, Navigation } from 'lucide-react';
import { Card } from "@/components/ui/card";
import MileageZoneForm from './MileageZoneForm';
import { ZONE_TYPES } from '@/constants/deliveryZones';
import SimpleZoneForm from './SimpleZoneForm';
import MappedZoneForm from './MappedZoneForm';

const AddDeliveryZoneModal = ({ isOpen, onClose, onAddZone }) => {
  const API_URLS = getApiUrls();
  const [step, setStep] = useState('choice'); // 'choice', 'mapped', 'simple', 'mileage'
  const [zoneData, setZoneData] = useState({
    coberturaLocalNombre: '',
    coberturaLocalCostoEnvio: '',
    coberturaLocalEstado: '1',
    coberturaLocalColor: '#FF0000',
    coberturaLocalHoraInicio: '09:00',
    coberturaLocalHoraFin: '22:00',
    coberturaLocalMinimoParaEnvioGratis: '0',
    coberturaLocalPermiteEnvioGratis: '0',
    coberturaLocalTipoCobertura: 'delivery',
    coberturaLocalPedidoMinimo: '0',
    coberturaLocalTiempoEstimado: '30',
    coberturaLocalRadioKmCobertura: '5',
    coberturaLocalLatitudRadio: '-12.0464',
    coberturaLocalLongitudRadio: '-77.0428',
    coberturaLocalCostoEnvioProgramado: '0'
  });
  const [selectedPoints, setSelectedPoints] = useState([]);

  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleSubmit = async () => {
    try {
      const endpoint = step === ZONE_TYPES.SIMPLE 
        ? `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/coverage-zone/simple`
        : `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/coverage-zone`;

      // Preparamos los datos base que son comunes para ambos tipos
      const baseData = {
        coberturaLocalId: `ZONE_${localId}_${Date.now()}`,
        localId,
        subDomain,
        coberturaLocalNombre: zoneData.coberturaLocalNombre,
        coberturaLocalCostoEnvio: zoneData.coberturaLocalCostoEnvio,
        coberturaLocalEstado: zoneData.coberturaLocalEstado,
        coberturaLocalColor: zoneData.coberturaLocalColor,
        coberturaLocalHoraInicio: zoneData.coberturaLocalHoraInicio,
        coberturaLocalHoraFin: zoneData.coberturaLocalHoraFin,
        coberturaLocalMinimoParaEnvioGratis: zoneData.coberturaLocalMinimoParaEnvioGratis,
        coberturaLocalPermiteEnvioGratis: zoneData.coberturaLocalPermiteEnvioGratis,
        coberturaLocalTipoCobertura: zoneData.coberturaLocalTipoCobertura,
        coberturaLocalPedidoMinimo: zoneData.coberturaLocalPedidoMinimo,
        coberturaLocalTiempoEstimado: zoneData.coberturaLocalTiempoEstimado
      };

      // Si es zona mapeada, agregamos los campos adicionales
      const requestData = step === 'mapped' 
        ? {
            ...baseData,
            coberturaLocalRuta: selectedPoints,
            coberturaLocalRadioKmCobertura: zoneData.coberturaLocalRadioKmCobertura.toString(),
            coberturaLocalLatitudRadio: zoneData.coberturaLocalLatitudRadio.toString(),
            coberturaLocalLongitudRadio: zoneData.coberturaLocalLongitudRadio.toString(),
            coberturaLocalCostoEnvioProgramado: zoneData.coberturaLocalCostoEnvioProgramado.toString(),
            type: ZONE_TYPES.POLYGONS
          }
        :{...baseData, type: ZONE_TYPES.SIMPLE};

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.type === "1") {
        onAddZone(data.data);
        toast.success(`Zona ${step === ZONE_TYPES.SIMPLE ? ZONE_TYPES.SIMPLE : ZONE_TYPES.POLYGONS} creada exitosamente`);
        onClose();
      } else {
        toast.error(data.message || 'Error al crear la zona');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear la zona');
    }
  };

  const handleClose = () => {
    setStep('choice');
    onClose();
  };

  if (step === ZONE_TYPES.MILEAGE) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[1200px] bg-cartaai-black border-cartaai-white/10 overflow-y-auto max-h-[90vh] z-[9999]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-cartaai-white flex items-center gap-2">
              <Navigation className="h-5 w-5 text-green-500" />
              Crear zona por kilometraje
            </DialogTitle>
          </DialogHeader>
          <MileageZoneForm onClose={() => setStep('choice')} onAddZone={onAddZone} />
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'choice') {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[525px] bg-cartaai-black border-cartaai-white/10 z-[9999]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-cartaai-white">
              Crear nueva zona de entrega
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <Card 
              className="p-4 cursor-pointer hover:bg-cartaai-white/5 transition-all duration-300 border border-cartaai-white/10"
              onClick={() => setStep('mapped')}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <MapPin className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-cartaai-white">Zona Mapeada</h3>
                  <p className="text-sm text-cartaai-white/60">
                    Define el área de entrega dibujando en el mapa
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:bg-cartaai-white/5 transition-all duration-300 border border-cartaai-white/10"
              onClick={() => setStep('simple')}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-500/10 rounded-full">
                  <Map className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-cartaai-white">Zona Simple</h3>
                  <p className="text-sm text-cartaai-white/60">
                    Crea una zona sin definir área en el mapa
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-4 cursor-pointer hover:bg-cartaai-white/5 transition-all duration-300 border border-cartaai-white/10"
              onClick={() => setStep('mileage')}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Navigation className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-cartaai-white">Zona por KM</h3>
                  <p className="text-sm text-cartaai-white/60">
                    Configura costos basados en distancia
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] bg-cartaai-black border-cartaai-white/10 overflow-y-auto max-h-[80vh] z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-cartaai-white">
            {step === 'mapped' ? 'Crear zona mapeada' : 'Crear zona simple'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'mapped' ? (
            <MappedZoneForm
              formData={zoneData}
              onUpdate={setZoneData}
              selectedPoints={selectedPoints}
              onPointsSelected={setSelectedPoints}
            />
          ) : (
            <SimpleZoneForm
              formData={zoneData}
              onUpdate={setZoneData}
            />
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setStep('choice')}
            className="border-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/10"
          >
            Atrás
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-cartaai-red hover:bg-cartaai-red/80"
            disabled={step === 'mapped' && selectedPoints.length < 3}
          >
            Crear zona
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeliveryZoneModal;