import React, { useState } from 'react';
import { EditButton, DeleteButton } from './CustomStandardButtons';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import DeleteCouponModal from './DeleteCouponModal';
import DeactivateCouponModal from './DeactivateCouponModal';
import EditCouponModal from './EditCouponModal';
import Pagination from './Pagination';

const CouponList = ({ 
  coupons, 
  searchTerm,
  onDeleteCoupon, 
  onDeactivateCoupon, 
  onActivateCoupon, 
  onDeleteMultipleCoupons,
  onDeactivateMultipleCoupons,
  onEditCoupon,
  selectedCoupons,
  setSelectedCoupons
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [couponToDeactivate, setCouponToDeactivate] = useState(null);
  const [couponToEdit, setCouponToEdit] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCoupons = coupons.filter(coupon => 
    coupon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoupons = filteredCoupons.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (couponToDelete) {
      onDeleteCoupon(couponToDelete.id);
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
    }
  };

  const handleDeactivateClick = (coupon) => {
    setCouponToDeactivate(coupon);
    setIsDeactivateModalOpen(true);
  };

  const handleConfirmDeactivate = () => {
    if (couponToDeactivate) {
      onDeactivateCoupon(couponToDeactivate.id);
      setIsDeactivateModalOpen(false);
      setCouponToDeactivate(null);
    }
  };

  const handleEditClick = (coupon) => {
    setCouponToEdit(coupon);
    setIsEditModalOpen(true);
  };

  const handleConfirmEdit = (editedCoupon) => {
    onEditCoupon(editedCoupon);
    setIsEditModalOpen(false);
    setCouponToEdit(null);
  };

  const handleSelectCoupon = (couponId) => {
    setSelectedCoupons(prev => 
      prev.includes(couponId)
        ? prev.filter(id => id !== couponId)
        : [...prev, couponId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCoupons(currentCoupons.map(coupon => coupon.id));
    } else {
      setSelectedCoupons([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-cartaai-white/10">
        <Table>
          <TableHeader>
            <TableRow className="bg-cartaai-black/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={currentCoupons.length > 0 && currentCoupons.every(coupon => selectedCoupons.includes(coupon.id))}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-cartaai-white font-bold">NOMBRE</TableHead>
              <TableHead className="text-cartaai-white font-bold">CÓDIGO</TableHead>
              <TableHead className="text-cartaai-white font-bold">LÍMITE</TableHead>
              <TableHead className="text-cartaai-white font-bold">USADO</TableHead>
              <TableHead className="text-cartaai-white font-bold">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCoupons.map((coupon, index) => (
              <TableRow key={coupon.id} className={index % 2 === 0 ? 'bg-cartaai-black/30' : 'bg-cartaai-black/10'}>
                <TableCell>
                  <Checkbox
                    checked={selectedCoupons.includes(coupon.id)}
                    onCheckedChange={() => handleSelectCoupon(coupon.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-cartaai-white">{coupon.name}</TableCell>
                <TableCell className="text-cartaai-white">{coupon.code}</TableCell>
                <TableCell className="text-cartaai-white">{coupon.limit}</TableCell>
                <TableCell className="text-cartaai-white">{coupon.used}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <EditButton onClick={() => handleEditClick(coupon)} />
                    <DeleteButton onClick={() => handleDeleteClick(coupon)} />
                    <Switch
                      checked={coupon.status === 'ACTIVE'}
                      onCheckedChange={() => coupon.status === 'ACTIVE' ? handleDeactivateClick(coupon) : onActivateCoupon(coupon.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="space-x-2">
          {selectedCoupons.length > 0 && (
            <>
              <Button 
                onClick={onDeleteMultipleCoupons}
                className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
              >
                Eliminar seleccionados ({selectedCoupons.length})
              </Button>
              <Button 
                onClick={onDeactivateMultipleCoupons}
                className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
              >
                Desactivar seleccionados ({selectedCoupons.length})
              </Button>
            </>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredCoupons.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      <DeleteCouponModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        couponName={couponToDelete?.name}
      />
      <DeactivateCouponModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleConfirmDeactivate}
        couponName={couponToDeactivate?.name}
      />
      <EditCouponModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEditCoupon={handleConfirmEdit}
        coupon={couponToEdit}
      />
    </div>
  );
};

export default CouponList;
