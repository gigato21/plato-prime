import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OrderDetailsSidebar from '../Orders/components/OrderDetailsSidebar';
import { fetchOrdersAdmin } from '../Orders/services/apiCallsForOrders';
import { toast } from 'sonner';
import OrdersListAdmin from './components/OrdersListAdmin';

const SuperAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadOrders();
  }, [pagination.page, pagination.startDate, pagination.endDate]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetchOrdersAdmin(
        pagination.startDate,
        pagination.endDate,
        pagination.page
      );
      
      setOrders(response?.orders);
      setPagination(prev => ({
        ...prev,
        total: response?.pagination?.total,
        totalPages: response?.pagination?.totalPages
      }));
    } catch (error) {
      toast.error('Error al cargar las órdenes');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsSidebarOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus, reason = '') => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el estado');
      console.error('Error:', error);
    }
  };

  const handleArchiveOrder = async (orderIds) => {
    try {
      const updatedOrders = orders.filter(order => !orderIds.includes(order.id));
      setOrders(updatedOrders);
      
      if (selectedOrder && orderIds.includes(selectedOrder.id)) {
        setSelectedOrder(null);
        setIsSidebarOpen(false);
      }
      
      toast.success('Órdenes archivadas correctamente');
    } catch (error) {
      toast.error('Error al archivar las órdenes');
      console.error('Error:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleDateChange = (startDate, endDate) => {
    setPagination(prev => ({
      ...prev,
      page: 1,
      startDate,
      endDate
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Órdenes Globales</h1>
      
      <OrdersListAdmin
        orders={orders}
        filters={{ status: [], startDate: pagination.startDate, endDate: pagination.endDate }}
        onViewOrder={handleViewOrder}
        onStatusChange={handleStatusChange}
        onArchiveOrder={handleArchiveOrder}
        isFullscreen={false}
        pagination={pagination}
        onPageChange={handlePageChange}
        onDateChange={handleDateChange}
        isLoading={isLoading}
      />

      <OrderDetailsSidebar
        order={selectedOrder}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  );
};

export default SuperAdminOrders; 