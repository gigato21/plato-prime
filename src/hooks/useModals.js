import { useState } from 'react';
import SelectCategoryModal from '../components/menu/SelectCategoryModal';
import ProductModifiersModal from '../components/menu/ProductModifiersModal';
import ProductPresentationsModal from '../components/menu/ProductPresentationsModal';

export const useModals = () => {
  const [isSelectCategoryModalOpen, setIsSelectCategoryModalOpen] = useState(false);
  const [isModifiersModalOpen, setIsModifiersModalOpen] = useState(false);
  const [isPresentationsModalOpen, setIsPresentationsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  return {
    isSelectCategoryModalOpen,
    setIsSelectCategoryModalOpen,
    isModifiersModalOpen,
    setIsModifiersModalOpen,
    isPresentationsModalOpen,
    setIsPresentationsModalOpen,
    selectedProduct,
    setSelectedProduct,
    SelectCategoryModal,
    ProductModifiersModal,
    ProductPresentationsModal,
  };
};