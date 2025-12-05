import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Clock, 
  MessageCircle, 
  FileText, 
  CreditCard,
  ShoppingBag,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  Archive,
  AlertCircle,
  CheckCircle2,
  MinusCircle
} from 'lucide-react';
import { format, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { mockOrders, statusStyles, statusLabels, orderTypeLabels, methodLabels } from '@/pages/Orders/constants/mockData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const StatusOrder = {
  ACEPTADO: 'Aceptado',
  EN_COCINA: 'En cocina',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
};

const OrdersList = ({ orders, filters, onViewOrder, onStatusChange, onArchiveOrder, isFullscreen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  const getStatusColor = (status) => {
    const colors = {
      [StatusOrder.ACEPTADO]: "text-yellow-500 bg-yellow-500/10",
      [StatusOrder.EN_COCINA]: "text-blue-500 bg-blue-500/10",
      [StatusOrder.EN_CAMINO]: "text-orange-500 bg-orange-500/10",
      [StatusOrder.ENTREGADO]: "text-green-500 bg-green-500/10",
      [StatusOrder.CANCELADO]: "text-red-500 bg-red-500/10",
    };
    return colors[status] || "text-gray-500 bg-gray-500/10";
  };

  const getMethodBadge = (method) => {
    const badges = {
      ia_wsp: { label: "IA WhatsApp", class: "bg-green-500/10 text-green-500" },
      digital_menu: { label: "Carta Digital", class: "bg-blue-500/10 text-blue-500" },
    };
    return badges[method] || { label: method, class: "bg-gray-500/10 text-gray-500" };
  };

  const getOrderTypeBadge = (type) => {
    const badges = {
      delivery: { label: "Delivery", class: "bg-purple-500/10 text-purple-500" },
      pickup: { label: "Recojo", class: "bg-orange-500/10 text-orange-500" },
    };
    return badges[type] || { label: type, class: "bg-gray-500/10 text-gray-500" };
  };

  const getIntegrationStatusBadge = (status, origin) => {
    const badges = {
      PENDING: {
        icon: <Clock className="h-3 w-3" />,
        class: "bg-yellow-500/10 text-yellow-500",
        label: "Pendiente"
      },
      SUCCESS: {
        icon: <CheckCircle2 className="h-3 w-3" />,
        class: "bg-green-500/10 text-green-500",
        label: "Integrado"
      },
      ERROR: {
        icon: <AlertCircle className="h-3 w-3" />,
        class: "bg-red-500/10 text-red-500",
        label: "Error"
      },
      NONE: {
        icon: <MinusCircle className="h-3 w-3" />,
        class: "bg-gray-500/10 text-gray-500",
        label: "Sin integración"
      }
    };

    const statusInfo = badges[status] || badges.NONE;

    return (
      <div className="flex items-center gap-1.5">
        <Badge variant="outline" className={`${statusInfo.class} text-xs py-0.5 px-2 flex items-center gap-1`}>
          {statusInfo.icon}
          <span className="truncate">
            {origin ? `${statusInfo.label} - ${origin}` : statusInfo.label}
          </span>
        </Badge>
      </div>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (!filters.startDate && !filters.endDate && !isToday(new Date(order.date))) {
      return false;
    }
    
    if (filters.status.length > 0 && !filters.status.includes(order.status)) {
      return false;
    }
    
    if (filters.startDate && filters.endDate) {
      const orderDate = new Date(order.date);
      return orderDate >= filters.startDate && orderDate <= filters.endDate;
    }
    
    return true;
  });

  const handleStatusChange = async (orderId, newStatus, currentOrder) => {
    if (newStatus === StatusOrder.CANCELADO) {
      setPendingOrderId(orderId);
      setIsModalOpen(true);
      return;
    }

    try {
      await onStatusChange(orderId, newStatus);
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) {
      toast.error('Por favor, ingresa un motivo de cancelación');
      return;
    }

    try {
      await onStatusChange(pendingOrderId, StatusOrder.CANCELADO, cancelReason);
      setIsModalOpen(false);
      setCancelReason('');
      setPendingOrderId(null);
    } catch (error) {
      toast.error("Error al cancelar la orden");
    }
  };

  const handleSelectOrder = (e, orderId) => {
    e.stopPropagation();
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (e) => {
    e.stopPropagation();
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(order => order.id)));
    }
  };

  const handleArchiveSelected = async () => {
    if (selectedOrders.size > 0) {
      try {
        const orderIdsArray = Array.from(selectedOrders);
        await onArchiveOrder(orderIdsArray);
        setSelectedOrders(new Set());
      } catch (error) {
        toast.error('Error al archivar las órdenes');
      }
    }
  };

  const handleArchiveOrder = async (orderId) => {
    try {
      await onArchiveOrder([orderId]);
    } catch (error) {
      toast.error('Error al archivar la orden');
    }
  };

  return (
    <>
      <div className={`glass-container overflow-hidden ${
        isFullscreen ? 'h-[calc(100vh-120px)]' : ''
      }`}>
        {selectedOrders.size > 0 && (
          <div className="p-4 flex justify-between items-center border-b border-cartaai-white/10 bg-cartaai-white/5">
            <div className="flex items-center gap-4">
              <span className="text-sm text-cartaai-white font-medium">
                {selectedOrders.size} {selectedOrders.size === 1 ? 'orden seleccionada' : 'órdenes seleccionadas'}
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleArchiveSelected}
                className="text-xs flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                Archivar {selectedOrders.size === 1 ? 'orden' : 'órdenes'}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedOrders(new Set())}
              className="text-xs"
            >
              Cancelar selección
            </Button>
          </div>
        )}
        <div className={`overflow-x-auto ${isFullscreen ? 'h-[calc(100vh-180px)]' : ''}`}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cartaai-white/10">
                <th className="p-2">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.size === filteredOrders.length}
                      onChange={handleSelectAll}
                      className="rounded-sm h-4 w-4 cursor-pointer bg-white/10 border-white/20 checked:bg-cartaai-white checked:border-cartaai-white"
                    />
                  </div>
                </th>
                <th className="text-left p-2 text-cartaai-white/60 text-xs font-medium">Estado</th>
                <th className="text-left p-2 text-cartaai-white/60 text-xs font-medium"># Orden</th>
                <th className="text-left p-2 text-cartaai-white/60 text-xs font-medium">Fecha</th>
                <th className="text-left p-2 text-cartaai-white/60 text-xs font-medium">Cliente</th>
                <th className="text-left p-2 text-cartaai-white/60 text-xs font-medium">Teléfono</th>
                <th className="text-left p-2 text-cartaai-white/60 text-xs font-medium">Total</th>
                <th className="text-left p-2 text-cartaai-white/60 text-xs font-medium">Tipo</th>
                <th className="text-left p-2 text-cartaai-white/60 text-xs font-medium">Método</th>
                <th className="text-left p-2 text-cartaai-white/60 text-xs font-medium">Integración</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id}
                  onClick={() => onViewOrder(order)}
                  className={`border-b border-cartaai-white/5 hover:bg-cartaai-white/5 transition-colors cursor-pointer text-xs
                    ${selectedOrders.has(order.id) ? 'bg-cartaai-white/10' : ''}`}
                >
                  <td className="p-2">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={(e) => handleSelectOrder(e, order.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-sm h-4 w-4 cursor-pointer bg-white/10 border-white/20 checked:bg-cartaai-white checked:border-cartaai-white"
                      />
                    </div>
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className={`${getStatusColor(order.status)} px-2 py-0.5 rounded-full text-xs font-medium h-auto`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {order.status}
                            <ChevronDown className="ml-1 h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="start" 
                          className={`text-xs ${isFullscreen ? 'z-[99999]' : ''}`}
                        >
                          {Object.values(StatusOrder).map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.id, status, order);
                              }}
                              className={`${order.status === status ? 'bg-accent' : ''} text-xs py-1`}
                            >
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                  <td className="p-2 text-cartaai-white">{order.refId || '-'}</td>
                  <td className="p-2 text-cartaai-white">
                    {new Date(order.date).toLocaleString()}
                  </td>
                  <td className="p-2 text-cartaai-white">{order.customer}</td>
                  <td className="p-2 text-cartaai-white">{order.phone}</td>
                  <td className="p-2 text-cartaai-white">S/ {order.total.toFixed(2)}</td>
                  <td className="p-2">
                    <Badge variant="outline" className={`${getOrderTypeBadge(order.orderType).class} text-xs py-0.5 px-2`}>
                      {getOrderTypeBadge(order.orderType).label}
                    </Badge>
                  </td>
                  <td className="p-2">
                    <Badge variant="outline" className={`${getMethodBadge(order.method).class} text-xs py-0.5 px-2`}>
                      {getMethodBadge(order.method).label}
                    </Badge>
                  </td>
                  <td className="p-2">
                    {getIntegrationStatusBadge(order.integrationStatus, order.origin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={isFullscreen ? 'z-[99999]' : ''}>
          <DialogHeader>
            <DialogTitle>Cancelar Orden</DialogTitle>
            <DialogDescription>
              Por favor, ingresa el motivo de la cancelación
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Motivo de cancelación..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsModalOpen(false);
              setCancelReason('');
              setPendingOrderId(null);
            }}>
              Cancelar
            </Button>
            <Button onClick={handleCancelConfirm}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersList;
