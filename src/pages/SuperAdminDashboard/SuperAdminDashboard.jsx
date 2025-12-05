import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Eye, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import WeeklySalesChart from '../../components/WeeklySalesChart';
import DailySalesChart from '../../components/DailySalesChart';
import MonthlySalesChart from '../../components/MonthlySalesChart';
import MetricCard from '../../components/MetricCard';
import { getApiUrls } from '@/config/api';
import DashboardSkeleton from '@/components/DashboardSkeleton';

const SuperAdminDashboard = () => {
  const API_URLS = getApiUrls();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedSubDomain, setSelectedSubDomain] = useState("all");
  const [subDomains, setSubDomains] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector((state) => state.auth.accessToken);
  
  useEffect(() => {
    fetchSubDomains();
  }, []);

  useEffect(() => {
    if (subDomains.length > 0) {
      fetchDashboardData();
    }
  }, [selectedMonth, selectedSubDomain, subDomains]);

  const fetchSubDomains = async () => {
    try {
      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/superadmin/businesses`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener negocios');
      }

      const data = await response.json();
      if (data.type === "1") {
        setSubDomains(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los negocios');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const url = selectedSubDomain !== "all" 
        ? `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/dashboard/metrics?subDomain=${selectedSubDomain}&month=${selectedMonth}&year=${currentYear}`
        : `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/dashboard/metrics?month=${selectedMonth}&year=${currentYear}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener métricas');
      }

      const data = await response.json();
      if (data.type === "1") {
        setDashboardData(data.data.metrics);
      }
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

  const handleSubDomainChange = (value) => {
    setSelectedSubDomain(value);
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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Panel de Control SuperAdmin</h1>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px] glass-input">
                <SelectValue placeholder="Selecciona un mes" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {format(new Date(2024, month - 1), 'MMMM', { locale: es })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubDomain} onValueChange={setSelectedSubDomain}>
              <SelectTrigger className="w-[180px] glass-input">
                <SelectValue placeholder="Selecciona un negocio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los locales</SelectItem>
                {subDomains.map((business) => (
                  <SelectItem key={business.subDomain} value={business.subDomain}>
                    {business.subDomain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
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

export default SuperAdminDashboard; 