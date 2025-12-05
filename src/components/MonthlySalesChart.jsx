import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const metricOptions = [
  { value: 'sales', label: 'Ventas', color: '#FF3B30' },
  { value: 'orders', label: 'Pedidos', color: '#5AC8FA' },
  { value: 'views', label: 'Vistas', color: '#4CD964' },
  { value: 'averageTicket', label: 'Ticket Promedio', color: '#FFCC00' },
];

const months = [
  { month: 'Ene', fullMonth: 'Enero' },
  { month: 'Feb', fullMonth: 'Febrero' },
  { month: 'Mar', fullMonth: 'Marzo' },
  { month: 'Abr', fullMonth: 'Abril' },
  { month: 'May', fullMonth: 'Mayo' },
  { month: 'Jun', fullMonth: 'Junio' },
  { month: 'Jul', fullMonth: 'Julio' },
  { month: 'Ago', fullMonth: 'Agosto' },
  { month: 'Sep', fullMonth: 'Septiembre' },
  { month: 'Oct', fullMonth: 'Octubre' },
  { month: 'Nov', fullMonth: 'Noviembre' },
  { month: 'Dic', fullMonth: 'Diciembre' },
];

const MonthlySalesChart = ({ monthlyData }) => {
  const [selectedMetrics, setSelectedMetrics] = useState(['sales', 'orders', 'views', 'averageTicket']);

  const processedData = useMemo(() => {
    if (!monthlyData?.monthlyData?.metrics) return [];

    const existingData = monthlyData.monthlyData.metrics.reduce((acc, item) => {
      acc[item.month] = {
        month: item.month,
        fullMonth: item.fullMonth,
        year: item.year,
        // Aplanar los valores para que sean directamente accesibles
        sales: item.sales.value,
        orders: item.orders.value,
        views: item.views.value,
        averageTicket: item.averageTicket.value,
        // Mantener los valores formateados para el tooltip
        salesFormatted: item.sales.formattedValue,
        ordersFormatted: item.orders.value.toLocaleString('es-PE'),
        viewsFormatted: item.views.value.toLocaleString('es-PE'),
        averageTicketFormatted: item.averageTicket.formattedValue
      };
      return acc;
    }, {});

    return months.map(({ month, fullMonth }) => {
      if (existingData[month]) {
        return existingData[month];
      }

      // Crear un objeto con valores en 0 para los meses sin datos
      return {
        month,
        fullMonth,
        year: new Date().getFullYear(),
        sales: 0,
        orders: 0,
        views: 0,
        averageTicket: 0,
        salesFormatted: 'S/ 0.00',
        ordersFormatted: '0',
        viewsFormatted: '0',
        averageTicketFormatted: 'S/ 0.00'
      };
    });
  }, [monthlyData]);

  const handleMetricChange = (metric) => {
    setSelectedMetrics((prev) => 
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  const renderYAxis = (metric) => (
    <YAxis
      key={metric}
      yAxisId={metric}
      hide={true}
      tickFormatter={value => value}
      stroke="#fff"
      tick={{ fill: 'currentColor', fontSize: 10 }}
    />
  );

  const renderLines = () => selectedMetrics.map((metric) => (
    <Line
      key={metric}
      type="monotone"
      dataKey={metric}
      name={metric}
      stroke={metricOptions.find(option => option.value === metric).color}
      strokeWidth={2}
      dot={{ r: 4 }}
      activeDot={{ r: 8 }}
      yAxisId={metric}
    />
  ));

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4">
        {metricOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              checked={selectedMetrics.includes(option.value)}
              onCheckedChange={() => handleMetricChange(option.value)}
            />
            <Label
              htmlFor={option.value}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={processedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} vertical={false} />
          <XAxis
            dataKey="month"
            stroke="currentColor"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          {selectedMetrics.map(renderYAxis)}
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(61, 61, 61, 0.6)', 
              border: '1px solid rgba(51, 51, 51, 0.3)', 
              borderRadius: '8px' 
            }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            formatter={(value, name) => {
              const metric = metricOptions.find(opt => opt.value === name);
              const formattedKey = `${name}Formatted`;
              return [processedData.find(d => d[name] === value)?.[formattedKey] || value, metric?.label];
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '16px' }}
          />
          {renderLines()}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesChart;
