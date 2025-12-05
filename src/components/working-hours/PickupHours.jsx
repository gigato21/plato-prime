import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DaySchedule } from './DaySchedule';
import { toast } from "sonner";
import { useSelector } from 'react-redux';
import { updateSchedule } from '@/services/scheduleService';
import { formatScheduleData } from '@/utils/scheduleFormatter';

export const PickupHours = ({ 
  shifts, 
  onToggleDay, 
  onTimeChange,
  onAnticipationChange,
  onSave,
  isSaving 
}) => {
  const { accessToken, subDomain, localId } = useSelector((state) => state.auth);

  if (!shifts || !shifts[0] || !shifts[0].times) {
    return null;
  }

  const handleSave = async () => {
    try {
      const formattedData = formatScheduleData(shifts, 'pickup');
      await updateSchedule(subDomain, localId, formattedData, accessToken);
      toast.success("Horario de recojo guardado correctamente");
    } catch (error) {
      toast.error("Error al guardar el horario de recojo");
    }
  };

  return (
    <Card className="bg-cartaai-black/30 p-4 rounded-lg backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-gray-700">Horario de Recojo en Tienda</CardTitle>
        <Button 
          onClick={onSave}
          className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          disabled={isSaving}
        >
          {isSaving ? 'Guardando...' : 'Guardar Horario'}
        </Button>
      </CardHeader>
      <CardContent>
        {daysOfWeek.map((day, index) => (
          <DaySchedule
            key={day}
            day={day}
            times={shifts[0].times[index]}
            onToggleDay={onToggleDay}
            onTimeChange={onTimeChange}
            onAnticipationChange={onAnticipationChange}
            disabled={!shifts[0].times[index].enabled}
          />
        ))}
      </CardContent>
    </Card>
  );
};

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];