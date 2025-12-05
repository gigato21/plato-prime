import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Eye, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import WeeklySalesChart from '../components/WeeklySalesChart';
import DailySalesChart from '../components/DailySalesChart';
import MonthlySalesChart from '../components/MonthlySalesChart';
import MetricCard from '../components/MetricCard';
import { getApiUrls } from '@/config/api';
import DashboardSkeleton from '@/components/DashboardSkeleton';

const Dashboard = () => {
  const API_URLS = getApiUrls();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, localId, subDomain]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/dashboard/metrics?localId=${localId}&subDomain=${subDomain}&month=${selectedMonth}&year=${currentYear}`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener métricas');
      }

      const data = await response.json();
      setDashboardData(data.data.metrics);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las métricas del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  if (isLoading || !dashboardData) {
    return (
      <div className="container mx-auto p-1 space-y-6">
        <DashboardSkeleton />
      </div>
    );
  }

  const metrics = [
    {
      title: "Ventas Totales",
      icon: DollarSign,
      dayValue: dashboardData.sales.day.formattedValue,
      monthValue: dashboardData.sales.month.formattedValue,
      yearValue: dashboardData.sales.year.formattedValue,
      percentage: dashboardData.sales.day.percentage
    },
    {
      title: "Pedidos",
      icon: ShoppingCart,
      dayValue: dashboardData.orders.day.formattedValue,
      monthValue: dashboardData.orders.month.formattedValue,
      yearValue: dashboardData.orders.year.formattedValue,
      percentage: dashboardData.orders.day.percentage
    },
    {
      title: "Vistas",
      icon: Eye,
      dayValue: dashboardData.views.day.formattedValue,
      monthValue: dashboardData.views.month.formattedValue,
      yearValue: dashboardData.views.year.formattedValue,
      percentage: dashboardData.views.day.percentage
    },
    {
      title: "Ticket Promedio",
      icon: TrendingUp,
      dayValue: dashboardData.averageTicket.day.formattedValue,
      monthValue: dashboardData.averageTicket.month.formattedValue,
      yearValue: dashboardData.averageTicket.year.formattedValue,
      percentage: dashboardData.averageTicket.day.percentage
    }
  ];

  return (
    <div className="container mx-auto p-1 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Panel de Control</h1>
        <Select
          onValueChange={handleMonthChange}
          value={selectedMonth}
        >
          <SelectTrigger className="w-[180px] glass-input">
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent className="glass-container">
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glass-container">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Ventas por Día de la Semana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklySalesChart weeklySalesData={dashboardData.weeklySales} />
          </CardContent>
        </Card>

        <Card className="glass-container">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Ventas por Hora del Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailySalesChart hourlySalesData={dashboardData.hourlySalesByDay} />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-container mt-8">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Métricas Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlySalesChart monthlyData={dashboardData.monthlyMetrics} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
