import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OrderSettings = ({ restaurantData, setRestaurantData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Aseguramos que solo se ingresen números
    if (/^\d*$/.test(value)) {
      setRestaurantData(prev => ({ 
        ...prev, 
        [name === 'minOrder' ? 'localMontoMinimo' : 'localTiempoMinimoDelivery']: value 
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setRestaurantData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 bg-cartaai-black/50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-cartaai-white border-b border-cartaai-white/10 pb-2">Configuración de Pedidos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="minOrder" className="text-cartaai-white">Pedido mínimo (S/.)</Label>
          <Input
            id="minOrder"
            name="minOrder"
            type="text"
            value={restaurantData.localMontoMinimo || ""}
            onChange={handleInputChange}
            className="bg-transparent text-cartaai-white mt-1 border-cartaai-white/10"
            placeholder="20"
          />
          <p className="text-sm text-cartaai-white/70 mt-1">Monto mínimo requerido para realizar un pedido</p>
        </div>
        
        <div>
          <Label htmlFor="prepTime" className="text-cartaai-white">Tiempo mínimo de delivery (minutos)</Label>
          <Input
            id="prepTime"
            name="prepTime"
            type="text"
            value={restaurantData.localTiempoMinimoDelivery || ""}
            onChange={handleInputChange}
            className="bg-transparent text-cartaai-white mt-1 border-cartaai-white/10"
            placeholder="30"
          />
          <p className="text-sm text-cartaai-white/70 mt-1">Tiempo estimado de entrega para pedidos delivery</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSettings;