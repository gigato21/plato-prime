import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getApiUrls } from '@/config/api';
import { transformPresentationsToProducts } from '../utils/presentationUtils';
import MenuLayout from '../components/digital-menu/MenuLayout';
import MenuContent from '../components/digital-menu/MenuContent';
import '../styles/digitalMenu.css';

const DigitalMenu = () => {
  const API_URLS = getApiUrls();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: '/restaurant' };
  const [menuData, setMenuData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const localId = useSelector((state) => state.auth.localId);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const addToCart = (product) => {
    setCart(prevCart => [...prevCart, product]);
  };

  const removeFromCart = (productToRemove) => {
    setCart(prevCart => prevCart.filter(item => item !== productToRemove));
  };

  const handleSelectCategory = (categoria) => {
    setSelectedCategory(categoria);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(
          `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/bot-structure?subdomain=${subDomain}&localId=${localId}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        const transformedData = transformPresentationsToProducts(data);
        setMenuData(transformedData);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };
    fetchMenu();
  }, [subDomain, localId, accessToken]);

  const filteredPresentations = menuData?.presentations.filter(presentation => {
    const matchesSearch = presentation.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || presentation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const groupedPresentations = filteredPresentations.reduce((acc, presentation) => {
    if (!acc[presentation.category]) {
      acc[presentation.category] = [];
    }
    acc[presentation.category].push(presentation);
    return acc;
  }, {});

  return (
    <MenuLayout 
      from={from} 
      navigate={navigate}
      menuData={menuData}
      selectedCategory={selectedCategory}
      onSelectCategory={handleSelectCategory}
      onSearch={handleSearch}
    >
      <MenuContent 
        groupedProducts={groupedPresentations}
        openModal={openModal}
        cart={cart}
        onRemoveFromCart={removeFromCart}
        onOpenOrderSummary={() => navigate('/order-summary', { state: { cartItems: cart } })}
        searchTerm={searchTerm}
        isModalOpen={isModalOpen}
        selectedProduct={selectedProduct}
        closeModal={closeModal}
        addToCart={addToCart}
      />
    </MenuLayout>
  );
};

export default DigitalMenu;