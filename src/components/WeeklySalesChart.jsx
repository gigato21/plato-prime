import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6'];

const WeeklySalesChart = ({ weeklySalesData }) => {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  if (!weeklySalesData || weeklySalesData.length === 0) {
    return <div className="text-center text-cartaai-white/60">No hay datos disponibles</div>;
  }

  const selectedWeek = weeklySalesData[selectedWeekIndex];
  const dataWeek = selectedWeek.weekData.sales.map(day => ({
    ...day,
    name: day.fullDay // Usar el nombre completo del día para la leyenda
  }));

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background text-gray-700 p-2 rounded shadow-md">
          <p className="font-semibold">{`${payload[0].payload.fullDay}: ${payload[0].payload.formattedValue}`}</p>
          <p className="text-sm">{`vs semana anterior: ${payload[0].payload.compareLastWeek}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select
          value={selectedWeekIndex.toString()}
          onValueChange={(value) => setSelectedWeekIndex(parseInt(value))}
        >
          <SelectTrigger className="w-[200px] glass-input">
            <SelectValue placeholder="Seleccionar semana" />
          </SelectTrigger>
          <SelectContent>
            {weeklySalesData.map((week, index) => (
              <SelectItem key={index} value={index.toString()}>
                {formatDateRange(week.metadata.startDate, week.metadata.endDate)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-cartaai-white/60">
          <p>Total: {selectedWeek.weekData.summary.formattedTotal}</p>
          <p>vs semana anterior: {selectedWeek.weekData.summary.compareLastWeek}%</p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWeek}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              nameKey="name" // Usar el nombre del día para la leyenda
            >
              {dataWeek.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value) => (
                <span className="text-cartaai-white">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklySalesChart;
