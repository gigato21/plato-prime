import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { ShoppingBag, Clock, Truck, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import PaymentInfo from '../PaymentInfo';
import { toast } from 'sonner';

const ServiceToggle = ({ id, label, description, icon: Icon, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-cartaai-white/5 hover:bg-cartaai-white/10 transition-all duration-200">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg ${checked ? 'bg-cartaai-red/20' : 'bg-cartaai-white/10'}`}>
          <Icon className={`w-5 h-5 ${checked ? 'text-cartaai-red' : 'text-cartaai-white/70'}`} />
        </div>
        <div>
          <Label htmlFor={id} className="text-cartaai-white font-medium">
            {label}
          </Label>
          <p className="text-sm text-cartaai-white/70">{description}</p>
        </div>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={() => onChange(id)}
        className="data-[state=checked]:bg-cartaai-red"
      />
    </div>
  );
};

const ServiceOptions = ({ restaurantData, paymentData, onCheckboxChange, setPaymentData }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleToggleChange = (id) => {
    if (id === 'localPagoTransferenciaMenuOnline') {
      if (!restaurantData[id]) { // Si se está activando
        if (paymentData.cuentasBancarias.length === 0) {
          setShowPaymentModal(true);
          return; // No activar el toggle hasta configurar cuentas
        }
      }
    }
    onCheckboxChange(id);
  };

  const services = [
    {
      id: 'estaAbiertoParaDelivery',
      label: 'Delivery',
      description: 'Habilitar servicio de entrega a domicilio',
      icon: Truck,
      checked: Boolean(restaurantData.estaAbiertoParaDelivery)
    },
    {
      id: 'estaAbiertoParaRecojo',
      label: 'Recojo en tienda',
      description: 'Permitir que los clientes recojan sus pedidos',
      icon: ShoppingBag,
      checked: Boolean(restaurantData.estaAbiertoParaRecojo)
    },
    {
      id: 'estaAbiertoParaSalon',
      label: 'Atención en salón',
      description: 'Habilitar atención en el local',
      icon: ShoppingBag,
      checked: restaurantData.estaAbiertoParaSalon
    },
    {
      id: 'estaAbiertoParaProgramarPedidos',
      label: 'Pedidos programados',
      description: 'Habilitar programación anticipada de pedidos',
      icon: Clock,
      checked: Boolean(restaurantData.estaAbiertoParaProgramarPedidos)
    },
    {
      id: 'localPagoTransferenciaMenuOnline',
      label: 'Pago por transferencia',
      description: 'Aceptar pagos por transferencia en el menú online',
      icon: CreditCard,
      checked: Boolean(restaurantData.localPagoTransferenciaMenuOnline)
    },
    {
      id: 'localAceptaTarjetaPorDelivery',
      label: 'Pago con tarjeta en delivery',
      description: 'Aceptar pagos con tarjeta para pedidos delivery',
      icon: CreditCard,
      checked: restaurantData.localAceptaTarjetaPorDelivery
    },
    {
      id: 'localAceptaEfectivoPorDelivery',
      label: 'Pago en efectivo en delivery',
      description: 'Aceptar pagos en efectivo para pedidos delivery',
      icon: CreditCard,
      checked: restaurantData.localAceptaEfectivoPorDelivery
    },
    {
      id: 'localPermiteBoleta',
      label: 'Emitir Boleta',
      description: 'Permitir la emisión de boletas',
      icon: CreditCard,
      checked: restaurantData.localPermiteBoleta
    },
    {
      id: 'localPermiteFactura',
      label: 'Emitir Factura',
      description: 'Permitir la emisión de facturas',
      icon: CreditCard,
      checked: restaurantData.localPermiteFactura
    }
  ];

  return (
    <>
      <Card className="bg-cartaai-black/50 border-cartaai-white/10">
        <div className="p-6 space-y-6">
          <div className="border-b border-cartaai-white/10 pb-4">
            <h2 className="text-2xl font-semibold text-cartaai-white">
              Configuración de Servicios
            </h2>
            <p className="text-sm text-cartaai-white/70 mt-1">
              Gestiona los servicios disponibles para tus clientes
            </p>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <ServiceToggle
                key={service.id}
                {...service}
                onChange={handleToggleChange}
              />
            ))}
          </div>
        </div>
      </Card>

      <Dialog open={showPaymentModal} onOpenChange={(open) => {
        if (!open) {
          if (paymentData.cuentasBancarias.length === 0) {
            toast.error('Debes agregar al menos una cuenta bancaria');
            return;
          } else {
            // Si hay cuentas, activamos el toggle y mostramos mensaje de éxito
            onCheckboxChange('localPagoTransferenciaMenuOnline');
            toast.success('Pago por transferencia activado. No olvides guardar los cambios.');
            
            // Scroll suave al botón de guardar
            setTimeout(() => {
              const saveButton = document.querySelector('.save-button');
              if (saveButton) {
                saveButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 100);
          }
        }
        setShowPaymentModal(open);
      }}>
        <DialogContent className="bg-cartaai-black/90 border-cartaai-white/10">
          <DialogHeader>
            <DialogTitle className="text-cartaai-white">Configurar Cuentas Bancarias</DialogTitle>
            <DialogDescription className="text-cartaai-white/70">
              Debes agregar al menos una cuenta bancaria para habilitar el pago por transferencia
            </DialogDescription>
          </DialogHeader>
          <PaymentInfo
            paymentData={paymentData}
            setPaymentData={setPaymentData}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceOptions;