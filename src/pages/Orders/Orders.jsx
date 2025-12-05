import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Kanban, Maximize2, Minimize2 } from 'lucide-react';
import OrdersList from '@/pages/Orders/components/OrdersList';
import OrdersKanban from '@/pages/Orders/components/OrdersKanban';
import OrderFilters from '@/pages/Orders/components/OrderFilters';
import OrderDetailsSidebar from '@/pages/Orders/components/OrderDetailsSidebar';
import { fetchOrders, updateOrderStatus } from './services/apiCallsForOrders';
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import AutoStatusChange from '@/pages/Orders/components/AutoStatusChange';
import { io } from 'socket.io-client';
import { getApiUrls } from '@/config/api';
import { Button } from "@/components/ui/button";

const Orders = () => {
  const [view, setView] = useState("kanban");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: []
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timerConfig, setTimerConfig] = useState({});
  const API_URLS = getApiUrls();
  
  const subDomain = useSelector((state) => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders(subDomain, localId);
        console.log(data, 'RECIEN SALIDAS DEL HORNO')
        const ordersWithTotal = data.orders.map(order => {
          const total = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          return { ...order, total };
        });
        const sortedOrders = ordersWithTotal.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
        setTimerConfig(data.timerConfig);
        console.log('Ejemplo de una orden:', sortedOrders[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    const socket = io(API_URLS.SERVICIOS_GENERALES_URL);
    socket.on('statusUpdate', (data) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === data.orderId 
            ? { ...order, status: data.newStatus }
            : order
        ).sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [subDomain, localId]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsSidebarOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus, statusReason = '') => {
    try {
      await updateOrderStatus(orderId, newStatus, statusReason);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, statusReason }
            : order
        )
      );

      toast.success('Estado de la orden actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      toast.error('Error al actualizar el estado de la orden');
    }
  };

  const handleArchiveOrders = async (orderIds) => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/order/toggle-archived`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderIds: Array.isArray(orderIds) ? orderIds : [orderIds] })
      });

      const data = await response.json();
      
      if (data.type === "1") {
        setOrders(prevOrders => 
          prevOrders.filter(order => !orderIds.includes(order.id))
        );
        toast.success('Órdenes archivadas exitosamente');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error al archivar las órdenes:', error);
      toast.error('Error al archivar las órdenes');
      throw error;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`container mx-auto p-6 space-y-6 pt-0 transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-[9999] m-0 p-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60' : ''
    }`}>
      {loading ? (
        <div className="glass-container p-8 text-center">
          <span className="text-cartaai-white">Cargando órdenes...</span>
        </div>
      ) : error ? (
        <div className="glass-container p-8 text-center text-red-500">
          {error}
        </div>
      ) : (
        <div className={`p-2 rounded-lg ${isFullscreen ? 'relative z-[9999]' : ''}`}>
          <Tabs value={view} onValueChange={setView} className="w-full">
            <div className={`flex justify-between items-center mb-4 ${isFullscreen ? 'sticky top-0 z-[9999] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4' : ''}`}>
              <div className="flex items-center gap-4">
                <AutoStatusChange subDomain={subDomain} localId={localId} timerConfig={timerConfig} />
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 glass-container"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </Button>
                <TabsList className="grid w-[400px] grid-cols-2 glass-container">
                  <TabsTrigger value="kanban" className="flex items-center gap-2">
                    <Kanban className="w-4 h-4" />
                    Kanban
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    Lista
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="list" className={`mt-0 ${isFullscreen ? 'h-screen overflow-auto' : ''}`}>
              {view === "list" && (
                <OrderFilters 
                  filters={filters} 
                  onFiltersChange={setFilters} 
                  className="text-xs p-1"
                  isFullscreen={isFullscreen}
                />
              )}
              <OrdersList 
                orders={orders}
                filters={filters} 
                onViewOrder={handleViewOrder}
                onStatusChange={handleStatusChange}
                onArchiveOrder={handleArchiveOrders}
                isFullscreen={isFullscreen}
              />
            </TabsContent>

            <TabsContent value="kanban" className={`mt-0 ${isFullscreen ? 'h-screen overflow-auto' : ''}`}>
              <OrdersKanban 
                orders={orders}
                setOrders={setOrders}
                onViewOrder={handleViewOrder}
                onStatusChange={handleStatusChange}
                onArchiveOrder={handleArchiveOrders}
                isFullscreen={isFullscreen}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}

      <OrderDetailsSidebar
        order={selectedOrder}
        isOpen={isSidebarOpen}
        onClose={() => {
          setIsSidebarOpen(false);
          setSelectedOrder(null);
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Orders;
