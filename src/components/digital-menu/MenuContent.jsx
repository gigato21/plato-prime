import { useState, useEffect } from 'react';
import { ShoppingCart, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import FoodCardContainer from '../FoodCardContainer';
import FoodCart from '../FoodCart';
import HorarioAtencion from '../OpeningHours';
import FoodModal from '../FoodModal';
import { filterProductsBySearch } from '../../utils/menuUtils';

const MenuContent = ({ 
  groupedProducts, 
  openModal, 
  cart, 
  onRemoveFromCart, 
  onOpenOrderSummary, 
  restaurantData, 
  diaActual, 
  horarios,
  searchTerm = ''
}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePresentationClick = (presentation) => {
    setSelectedPresentation(presentation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPresentation(null);
  };

  const handleAddToCart = (presentation) => {
    if (cart && onRemoveFromCart) {
      cart.push(presentation);
      handleCloseModal();
    }
  };

  const filteredGroupedProducts = filterProductsBySearch(groupedProducts, searchTerm);

  return (
    <div className="flex flex-col md:flex-row bg-transparent relative" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className='products-container md:w-9/12 w-full pb-20 md:pb-0'>
        {Object.entries(filteredGroupedProducts).map(([categoria, items]) => (
          <div key={categoria} className="mb-4">
            <FoodCardContainer
              onFoodCardClick={handlePresentationClick} 
              fastFoodItems={items} 
              category={categoria} 
            />
          </div>
        ))}
      </div>

      {/* Mobile Buttons */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:hidden">
        <div className="relative">
          <button
            onClick={() => {
              setIsCartOpen(!isCartOpen);
              setIsScheduleOpen(false);
            }}
            className="p-4 rounded-full glass-container backdrop-blur-md hover:bg-white/20 dark:hover:bg-black/20 text-gray-700 dark:text-gray-200 shadow-lg transition-all duration-300"
          >
            <ShoppingCart className="h-6 w-6" />
          </button>
          {cart.length > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 bg-cartaai-red hover:bg-cartaai-red"
              variant="secondary"
            >
              {cart.length}
            </Badge>
          )}
        </div>
        <button
          onClick={() => {
            setIsScheduleOpen(!isScheduleOpen);
            setIsCartOpen(false);
          }}
          className="p-4 rounded-full glass-container backdrop-blur-md hover:bg-white/20 dark:hover:bg-black/20 text-gray-700 dark:text-gray-200 shadow-lg transition-all duration-300"
        >
          <Clock className="h-6 w-6" />
        </button>
      </div>

      {/* Cart and Opening Hours Container */}
      <div 
        className={`md:w-3/12 w-full fixed md:relative bottom-0 left-0 md:left-auto right-0 z-40 transition-transform duration-300 ease-in-out ${
          isCartOpen || isScheduleOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'
        }`}
        style={{marginTop: '40px'}}
      >
        <div className="max-h-[80vh] overflow-y-auto p-4 md:p-0 space-y-4">
          {(isCartOpen || isDesktop) && (
            <FoodCart 
              cartItems={cart} 
              onRemoveFromCart={onRemoveFromCart} 
              onOpenOrderSummary={onOpenOrderSummary} 
            />
          )}
          {(isScheduleOpen || isDesktop) && (
            <HorarioAtencion diaActual={diaActual} horarios={horarios} />
          )}
        </div>
      </div>

      <FoodModal
        product={selectedPresentation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        addToCart={handleAddToCart}
      />
    </div>
  );
};

export default MenuContent;