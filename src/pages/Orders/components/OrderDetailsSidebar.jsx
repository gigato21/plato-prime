import React from 'react';
import { X, Phone, Clock, MessageCircle, FileText, CreditCard, ShoppingBag, DollarSign, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { statusStyles, statusLabels, orderTypeLabels, methodLabels } from '@/pages/Orders/constants/mockData';

const OrderDetailsSidebar = ({ order, isOpen, onClose }) => {
  if (!order) return null;
console.log(order, 'orderSidebar')
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[99999] backdrop-blur-sm
          ${isOpen ? 'animate-fade-in' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        style={{height: '100vh', marginTop: '0'}}
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 w-[500px] glass-container border-l border-white/20 shadow-2xl z-[99999] 
          ${isOpen ? 'animate-slide-in-right' : 'translate-x-full'}`}
        style={{height: '100vh', marginTop: '0'}}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="shrink-0 px-5 py-4 border-b border-white/10 backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium text-cartaai-white animate-fade-in">
                Orden #{order.refId || order.id}
              </h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="hover:bg-white/10 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Badge className={`${statusStyles[order.status]} text-xs animate-fade-in`}>
              {statusLabels[order.status]}
            </Badge>
          </div>

          {/* Content */}
          <div className="grow overflow-y-auto">
            <div className="divide-y divide-white/10">
              {/* Customer Info */}
              <div className="px-5 py-4 animate-slide-up-fade [animation-delay:100ms]">
                <h3 className="text-sm font-medium text-cartaai-white mb-3">
                  Información del Cliente
                </h3>
                <div className="glass-container p-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <p className="text-sm text-cartaai-white/90 mb-2">{order.customer}</p>
                  <div className="flex items-center gap-2 text-xs text-cartaai-white/70">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{order.phone}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="px-5 py-4 animate-slide-up-fade [animation-delay:200ms]">
                <h3 className="text-sm font-medium text-cartaai-white mb-3">
                  Detalles del Pedido
                </h3>
                <div className="glass-container p-3 rounded-lg space-y-3 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-cartaai-white/70">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{format(order.date, "dd/MM/yyyy HH:mm", { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cartaai-white/70">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>{order.total}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-cartaai-white/70">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{orderTypeLabels[order.orderType]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-cartaai-white/70">
                      <CreditCard className="h-3.5 w-3.5" />
                      <span>{order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-cartaai-white/70">
                    {order.method === 'ia_wsp' ? (
                      <MessageCircle className="h-3.5 w-3.5" />
                    ) : (
                      <FileText className="h-3.5 w-3.5" />
                    )}
                    <span>{methodLabels[order.method]}</span>
                  </div>

                  {/* Local ID */}
                  <div className="flex items-center gap-2 text-xs text-cartaai-white/70">
                    <span>ID del Local: {order.localId}</span>
                  </div>

                  {/* Integration Status */}
                  <div className="flex items-center gap-2 text-xs text-cartaai-white/70">
                    <span>Estado de Integración: {order.integrationStatus}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="px-5 py-4 animate-slide-up-fade [animation-delay:300ms]">
                <h3 className="text-sm font-medium text-cartaai-white mb-3">
                  Productos
                </h3>
                <div className="flex flex-col gap-2">
                  {order.items.map((item, index) => (
                    <div 
                      key={index}
                      className="flex flex-col border border-white/10 p-3 rounded-lg glass-container"
                      style={{ animationDelay: `${400 + (index * 100)}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-3.5 w-3.5 text-cartaai-white/70" />
                          <div className="flex flex-col">
                            <span className="text-sm text-cartaai-white/90">
                              {item.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-cartaai-white/70">
                          <span className="text-xs">
                            x{item.quantity}
                          </span>
                          <span className="text-sm">
                            S/ {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Modificadores */}
                      {item.modificatorSelectionList && item.modificatorSelectionList.length > 0 && (
                        <div className="ml-5 mt-2">
                          <p className="text-xs text-cartaai-white/70 mb-1">Modificadores:</p>
                          {item.modificatorSelectionList.map((mod, modIndex) => (
                            <div key={modIndex} className="flex justify-between items-center text-xs pl-2 py-1 text-cartaai-white/60 border-l border-white/10">
                              <div>
                                <span>{mod.groupName || 'Grupo no encontrado'}: </span>
                                <span className="italic">{mod.optionName || 'Opción no encontrada'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>x{mod.quantity}</span>
                                <span>S/ {mod.price.toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Nota */}
                      {item.note && (
                        <div className="ml-5 mt-2 text-xs text-cartaai-white/50 border-l border-white/10 pl-2 py-1">
                          <span className="font-medium">Nota:</span> {item.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsSidebar; 