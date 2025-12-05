
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import TimeInput from '../TimeInput';
import { Switch } from "@/components/ui/switch";

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const ScheduleSection = ({ title, schedules, onScheduleChange }) => {
  return (
    <Card className="glass-container mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="dark:text-gray-200 text-gray-700 text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {daysOfWeek.map((day) => {
            const daySchedule = schedules.find(s => s.horarioAtencionDiaDia === day) || {
              horarioAtencionDiaEstado: "0",
              horarioAtencionList: [{ horarioAtencionInicio: "11:00", horarioAtencionFin: "22:00" }]
            };
            
            return (
              <div key={day} className="flex items-center space-x-4">
                <Switch
                  id={`${title}-${day}`}
                  checked={daySchedule.horarioAtencionDiaEstado === "1"}
                  onCheckedChange={(checked) => {
                    onScheduleChange(day, {
                      ...daySchedule,
                      horarioAtencionDiaEstado: checked ? "1" : "0"
                    });
                  }}
                />
                <Label
                  htmlFor={`${title}-${day}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-200 text-gray-700 w-24"
                >
                  {day}
                </Label>
                <TimeInput
                  value={daySchedule.horarioAtencionList[0]?.horarioAtencionInicio || "11:00"}
                  onChange={(value) => {
                    onScheduleChange(day, {
                      ...daySchedule,
                      horarioAtencionList: [{
                        ...daySchedule.horarioAtencionList[0],
                        horarioAtencionInicio: value
                      }]
                    });
                  }}
                  disabled={daySchedule.horarioAtencionDiaEstado !== "1"}
                />
                <span className="dark:text-gray-200 text-gray-700">-</span>
                <TimeInput
                  value={daySchedule.horarioAtencionList[0]?.horarioAtencionFin || "22:00"}
                  onChange={(value) => {
                    onScheduleChange(day, {
                      ...daySchedule,
                      horarioAtencionList: [{
                        ...daySchedule.horarioAtencionList[0],
                        horarioAtencionFin: value
                      }]
                    });
                  }}
                  disabled={daySchedule.horarioAtencionDiaEstado !== "1"}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const WorkingHoursStep = ({ data, updateData }) => {
  const handleScheduleChange = (type, day, newSchedule) => {
    const scheduleKey = {
      'delivery': 'horarioParaDelivery',
      'pickup': 'horarioParaRecojo',
      'scheduled': 'horarioParaProgramarPedidos'
    }[type];

    const updatedSchedules = [...(data[scheduleKey] || [])];
    const dayIndex = updatedSchedules.findIndex(s => s.horarioAtencionDiaDia === day);

    if (dayIndex >= 0) {
      updatedSchedules[dayIndex] = {
        ...updatedSchedules[dayIndex],
        ...newSchedule
      };
    } else {
      updatedSchedules.push({
        horarioAtencionDiaId: String(Date.now()),
        horarioAtencionDiaDia: day,
        horarioAtencionDiaTipo: type === 'delivery' ? "1" : type === 'pickup' ? "2" : "3",
        ...newSchedule
      });
    }

    updateData({
      ...data,
      [scheduleKey]: updatedSchedules
    });
  };

  return (
    <div className="space-y-6">
      <Label className="dark:text-gray-200 text-gray-700 text-lg">Horarios de Atención</Label>
      
      <ScheduleSection
        title="Horario para Delivery"
        schedules={data.horarioParaDelivery || []}
        onScheduleChange={(day, schedule) => handleScheduleChange('delivery', day, schedule)}
      />

      <ScheduleSection
        title="Horario para Recojo en Tienda"
        schedules={data.horarioParaRecojo || []}
        onScheduleChange={(day, schedule) => handleScheduleChange('pickup', day, schedule)}
      />

      <ScheduleSection
        title="Horario para Programar Pedidos"
        schedules={data.horarioParaProgramarPedidos || []}
        onScheduleChange={(day, schedule) => handleScheduleChange('scheduled', day, schedule)}
      />
    </div>
  );
};

export default WorkingHoursStep;