import RestaurantStatusBar from '../RestaurantStatusBar';
import PresentationSection from '../PresentationSection';
import CategoryBar from '../CategoryBar';
import { useEffect, useState } from 'react';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import MenuHeader from './MenuHeader';

const MenuLayout = ({ 
  from, 
  navigate, 
  menuData, 
  selectedCategory, 
  onSelectCategory, 
  onSearch,
  children 
}) => {
  const API_URLS = getApiUrls();
  const [restaurantData, setRestaurantData] = useState(null);
  const localId = useSelector((state) => state.auth.localId);
  const subDomain = useSelector((state) => state.auth.subDomain);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/business/?subDomain=${subDomain}&localId=${localId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        const business = data.data;
        
        setRestaurantData({
          backgroundImage: business.localImagen || 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/89338e24-9904-45e7-9c36-fcb94fe8c9e9/dii7fcv-de4231c1-f0e7-4e2e-8b6b-ac7085a14892.jpg/v1/fill/w_1182,h_676,q_70,strp/necesito_una_imagen_placeholder_en_tono_de_grises__by_meetssie_dii7fcv-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzMyIiwicGF0aCI6IlwvZlwvODkzMzhlMjQtOTkwNC00NWU3LTljMzYtZmNiOTRmZThjOWU5XC9kaWk3ZmN2LWRlNDIzMWMxLWYwZTctNGUyZS04YjZiLWFjNzA4NWExNDg5Mi5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.d3v4Mabhcjx21CDi8dNPHs-khQi6fD-etyJLPk13oSo',
          logoImage: business.localLogo || 'https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png',
          title: business.localNombreComercial,
          description: business.localDescripcion,
          link: "https://www.google.com/"
        });
      } catch (error) {
        console.error('Error fetching business info:', error);
      }
    };

    fetchBusinessInfo();
  }, [subDomain, localId]);

  const timeInfo = {
    shifts: [
      { id: 1, name: 'Turno 1', times: [
        { day: 'Lunes', start: '09:00', end: '22:00', enabled: true },
      ]},
    ],
    timezone: 'America/Lima',
  };

  return (
    <div className="digital-menu-container">
      <div className="digital-menu-content">
        <MenuHeader onGoBack={() => navigate(from)} />
        
        {restaurantData && (
          <RestaurantStatusBar 
            shifts={timeInfo.shifts}
            timezone={timeInfo.timezone}
          />
        )}
        
        {restaurantData && (
          <PresentationSection 
            backgroundImage={restaurantData.backgroundImage} 
            logoImage={restaurantData.logoImage}
            title={restaurantData.title} 
            description={restaurantData.description}
            link={restaurantData.link}
          />
        )}
        
        <CategoryBar
          categorias={menuData?.categories} 
          onSelectCategory={onSelectCategory} 
          onSearch={onSearch} 
          selectedCategory={selectedCategory}
        />
        
        {children}
      </div>
    </div>
  );
};

export default MenuLayout;