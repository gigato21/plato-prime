import React, { useState } from 'react';
import { 
  Phone, 
  Clock, 
  MessageCircle, 
  FileText, 
  CreditCard,
  ShoppingBag,
  DollarSign,
  Hash,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Archive
} from 'lucide-react';
import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { mockOrders, columns, statusLabels, orderTypeLabels, methodLabels } from '@/pages/Orders/constants/mockData';
import { toast } from "sonner";
import { updateOrderStatus } from '@/pages/Orders/services/apiCallsForOrders';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const OrdersKanban = ({ orders, setOrders, onViewOrder, onArchiveOrder, isFullscreen }) => {
  // Filtrar las órdenes para mostrar solo las del día actual
  const filteredOrders = orders.filter(order => isToday(new Date(order.date)));
  const scrollContainerRef = React.useRef(null);

  const handleDragStart = (e, order) => {
    e.dataTransfer.setData('orderId', order.id);
    e.target.classList.add('opacity-50');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const column = e.target.closest('.kanban-column');
    if (column) {
      column.classList.add('bg-gray-200', 'dark:bg-gray-700');
    }
  };

  const handleDragLeave = (e) => {
    const column = e.target.closest('.kanban-column');
    if (column) {
      column.classList.remove('bg-gray-200', 'dark:bg-gray-700');
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const column = e.target.closest('.kanban-column');
    if (column) {
      column.classList.remove('bg-gray-200', 'dark:bg-gray-700');
    }

    const orderId = e.dataTransfer.getData('orderId');

    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      toast.error("Error al actualizar el estado de la orden");
    }
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const container = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (container) {
        const newScrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleArchiveOrder = async (e, orderId) => {
    e.stopPropagation();
    try {
      await onArchiveOrder([orderId]);
      toast.success('Orden archivada exitosamente');
    } catch (error) {
      toast.error('Error al archivar la orden');
    }
  };

  return (
    <div className={`relative glass-container p-4 rounded-lg ${
      isFullscreen ? 'h-[calc(100vh-120px)]' : ''
    }`}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full glass-container shadow-md"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full glass-container shadow-md"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className={`overflow-x-auto ${isFullscreen ? 'w-screen pr-8' : 'w-[80vw]'}`}>
        <ScrollArea className="w-full rounded-lg" ref={scrollContainerRef}>
          <div className={`flex gap-4 p-4 min-w-max ${
            isFullscreen ? 'h-[calc(100vh-160px)]' : ''
          }`}>
            {columns.map(column => (
              <div 
                key={column.id} 
                className={`flex-shrink-0 rounded-lg kanban-column transition-colors duration-200 ${
                  isFullscreen ? 'w-[400px]' : 'w-[280px]'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className={`glass-container rounded-lg p-4 ${
                  isFullscreen ? 'h-full' : ''
                }`}>
                  <h3 className="font-semibold mb-4 text-cartaai-white text-sm">
                    {column.title}
                    <span className="ml-2 text-xs text-cartaai-white/70">
                      ({filteredOrders.filter(order => order.status === column.id).length})
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {filteredOrders
                      .filter(order => order.status === column.id)
                      .map(order => (
                        <div
                          key={order.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, order)}
                          onDragEnd={handleDragEnd}
                          className="glass-container p-2 rounded-lg border border-white/10 hover:border-white/20 
                            shadow cursor-move hover:shadow-md transition-all text-xs relative group"
                          onClick={() => onViewOrder(order)}
                        >
                          <div className="space-y-1">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                <span className="font-medium">#{order.refId || order.id}</span>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                  align="end"
                                  className={isFullscreen ? 'z-[99999]' : ''}
                                >
                                  <DropdownMenuItem 
                                    onClick={(e) => handleArchiveOrder(e, order.id)}
                                    className="text-red-500 focus:text-red-500"
                                  >
                                    <Archive className="h-4 w-4 mr-2" />
                                    Archivar orden
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            
                            <div className="flex items-center gap-1 text-cartaai-white/70">
                              <Phone className="w-3 h-3" />
                              <span className="text-xs">{order.phone}</span>
                            </div>

                            <div className="flex items-center justify-between text-cartaai-white/70">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                <span className="text-xs">{order.total.toFixed(2)}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-cartaai-white/70">
                              <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                <span className="text-xs">{order.orderType}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                <span className="text-xs">{order.paymentMethod}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-cartaai-white/70">
                              {order.method === 'ia_wsp' ? (
                                <MessageCircle className="w-3 h-3" />
                              ) : (
                                <FileText className="w-3 h-3" />
                              )}
                              <span className="text-xs">
                                {order.method === 'ia_wsp' ? 'IA WhatsApp' : 'Carta Digital'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-cartaai-white/70">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">{format(order.date, "HH:mm", { locale: es })}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default OrdersKanban;
