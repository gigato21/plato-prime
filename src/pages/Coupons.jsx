import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from 'lucide-react';
import AddCouponModal from '../components/AddCouponModal';
import CouponList from '../components/CouponList';
import DeleteMultipleCouponsModal from '../components/DeleteMultipleCouponsModal';
import DeactivateMultipleCouponsModal from '../components/DeactivateMultipleCouponsModal';
import { useToast } from "@/components/ui/use-toast";

const Coupons = () => {
  const [coupons, setCoupons] = useState([
    { id: 1, name: 'Descuento de Verano', code: 'VERANO2023', limit: 100, used: 45, status: 'ACTIVE', type: 'percentage', value: 20, activeFrom: new Date('2023-06-01'), activeTo: new Date('2023-08-31') },
    { id: 2, name: 'Oferta de Bienvenida', code: 'BIENVENIDO10', limit: 50, used: 12, status: 'ACTIVE', type: 'fixed', value: 10, activeFrom: new Date('2023-01-01'), activeTo: new Date('2023-12-31') },
    { id: 3, name: 'Descuento Especial', code: 'ESPECIAL25', limit: 200, used: 98, status: 'ACTIVE', type: 'percentage', value: 25, activeFrom: new Date('2023-05-01'), activeTo: new Date('2023-07-31') },
    { id: 4, name: 'Promo Fin de Semana', code: 'FINDE30', limit: 75, used: 30, status: 'ACTIVE', type: 'percentage', value: 30, activeFrom: new Date('2023-06-01'), activeTo: new Date('2023-12-31') },
    { id: 5, name: 'Descuento Cumpleaños', code: 'CUMPLE50', limit: 1000, used: 523, status: 'ACTIVE', type: 'percentage', value: 50, activeFrom: new Date('2023-01-01'), activeTo: new Date('2023-12-31') },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteMultipleModalOpen, setIsDeleteMultipleModalOpen] = useState(false);
  const [isDeactivateMultipleModalOpen, setIsDeactivateMultipleModalOpen] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const { toast } = useToast();

  const handleAddCoupon = () => {
    setIsAddModalOpen(true);
  };

  const addCoupon = (newCoupon) => {
    setCoupons([...coupons, { ...newCoupon, id: Date.now(), used: 0, status: 'ACTIVE' }]);
    toast({
      title: "Cupón añadido",
      description: "El nuevo cupón ha sido añadido exitosamente.",
    });
  };

  const deleteCoupon = (couponId) => {
    setCoupons(coupons.filter(coupon => coupon.id !== couponId));
  };

  const deactivateCoupon = (couponId) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, status: 'INACTIVE' }
        : coupon
    ));
  };

  const activateCoupon = (couponId) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === couponId 
        ? { ...coupon, status: 'ACTIVE' }
        : coupon
    ));
  };

  const editCoupon = (editedCoupon) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === editedCoupon.id 
        ? { ...editedCoupon }
        : coupon
    ));
    toast({
      title: "Cupón editado",
      description: "El cupón ha sido editado exitosamente.",
    });
  };

  const handleDeleteMultipleCoupons = () => {
    setIsDeleteMultipleModalOpen(true);
  };

  const handleDeactivateMultipleCoupons = () => {
    setIsDeactivateMultipleModalOpen(true);
  };

  const confirmDeleteMultipleCoupons = () => {
    setCoupons(coupons.filter(coupon => !selectedCoupons.includes(coupon.id)));
    setIsDeleteMultipleModalOpen(false);
    setSelectedCoupons([]);
    toast({
      title: "Cupones eliminados",
      description: `Se han eliminado ${selectedCoupons.length} cupones.`,
    });
  };

  const confirmDeactivateMultipleCoupons = () => {
    setCoupons(coupons.map(coupon => 
      selectedCoupons.includes(coupon.id)
        ? { ...coupon, status: 'INACTIVE' }
        : coupon
    ));
    setIsDeactivateMultipleModalOpen(false);
    setSelectedCoupons([]);
    toast({
      title: "Cupones desactivados",
      description: `Se han desactivado ${selectedCoupons.length} cupones.`,
    });
  };

  return (
    <div className="container mx-auto p-1 space-y-6">
      <div className="glass-container p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-cartaai-white/10 pb-4">
          <h1 className="text-3xl font-bold text-cartaai-white">Gestión de cupones</h1>
          <Button 
            onClick={handleAddCoupon}
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="mr-2 h-5 w-5" /> Añadir cupón
          </Button>
        </div>

        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-input text-cartaai-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cartaai-white/50 h-4 w-4" />
        </div>

        <div className="bg-cartaai-black/30 rounded-lg backdrop-blur-sm">
          <CouponList 
            coupons={coupons} 
            searchTerm={searchTerm}
            onDeleteCoupon={deleteCoupon}
            onDeactivateCoupon={deactivateCoupon}
            onActivateCoupon={activateCoupon}
            onDeleteMultipleCoupons={handleDeleteMultipleCoupons}
            onDeactivateMultipleCoupons={handleDeactivateMultipleCoupons}
            onEditCoupon={editCoupon}
            selectedCoupons={selectedCoupons}
            setSelectedCoupons={setSelectedCoupons}
          />
        </div>
      </div>

      <AddCouponModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCoupon={addCoupon}
      />

      <DeleteMultipleCouponsModal
        isOpen={isDeleteMultipleModalOpen}
        onClose={() => setIsDeleteMultipleModalOpen(false)}
        onConfirm={confirmDeleteMultipleCoupons}
        couponCount={selectedCoupons.length}
      />

      <DeactivateMultipleCouponsModal
        isOpen={isDeactivateMultipleModalOpen}
        onClose={() => setIsDeactivateMultipleModalOpen(false)}
        onConfirm={confirmDeactivateMultipleCoupons}
        couponCount={selectedCoupons.length}
      />
    </div>
  );
};

export default Coupons;