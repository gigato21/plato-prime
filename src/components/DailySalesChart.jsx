import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// Componente personalizado para YAxis
const CustomYAxis = (props) => {
  const defaultProps = {
    stroke: "currentColor",
    axisLine: false,
    tickLine: false,
    tick: false,
    hide: true,
    width: 0,
    height: 0,
    domain: [0, 'auto'],
    allowDataOverflow: false,
    scale: "auto",
    padding: { top: 0, bottom: 0 }
  };

  return <YAxis {...defaultProps} {...props} />;
};

const DailySalesChart = ({ hourlySalesData }) => {
  const [selectedDate, setSelectedDate] = useState(Object.keys(hourlySalesData)[0]);

  if (!hourlySalesData || Object.keys(hourlySalesData).length === 0) {
    return <div className="text-center text-cartaai-white/60">No hay datos disponibles</div>;
  }

  const data = hourlySalesData[selectedDate] || [];

  const handleDateSelect = (date) => {
    // Formatear la fecha sin ajuste de zona horaria
    const formattedDate = format(date, 'yyyy-MM-dd');
    setSelectedDate(formattedDate);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background text-gray-700 p-2 rounded shadow-md">
          <p className="font-semibold">{`${payload[0].payload.hour}: ${payload[0].payload.formattedValue}`}</p>
          <p className="text-sm">{`Pedidos: ${payload[0].payload.orders}`}</p>
          <p className="text-sm">{`Ticket promedio: S/ ${payload[0].payload.averageTicket}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="glass-input">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(parseISO(selectedDate), "PPP", { locale: es })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={parseISO(selectedDate)}
              onSelect={handleDateSelect}
              disabled={(date) => !hourlySalesData[format(date, 'yyyy-MM-dd')]}
              locale={es}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis
            dataKey="hour"
            stroke="currentColor"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 10 }}
            interval={2}
          />
          <CustomYAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="#FF3B30"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;
