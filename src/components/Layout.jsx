import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { TooltipProvider } from "@/components/ui/tooltip";
import { FileText, User, Building2, ChevronDown, Store, Monitor, Truck } from 'lucide-react';
import UserDropdown from './UserDropdown';
import ProfileModal from './ProfileModal';
import { Toaster } from "@/components/ui/toaster";
import ThemeToggle from './ThemeToggle';
import ScrollButtons from './navigation/ScrollButtons';
import NavItems from './navigation/NavItems';
import MobileNav from './navigation/MobileNav';
import { NotificationsProvider } from './notifications/NotificationsProvider';
import NotificationsButton from './notifications/NotificationsButton';
import NotificationsModal from './notifications/NotificationsModal';
import BusinessSelectorModal from './BusinessSelectorModal';
import { navItems, superadminNavItems } from '@/nav-items';
import { login } from '@/redux/slices/authSlice';
import { useBusinesses } from '@/hooks/useBusinesses';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getApiUrls } from '@/config/api';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.role);
  const businessName = useSelector(state => state.auth.businessName);
  const localId = useSelector(state => state.auth.localId);
  const accessToken = useSelector(state => state.auth.accessToken);
  const userData = useSelector(state => state.auth.userData);
  const subDomain = useSelector(state => state.auth.subDomain);
  const { SERVICIOS_GENERALES_URL } = getApiUrls();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const [showBusinessSelector, setShowBusinessSelector] = useState(false);
  const userMenuRef = useRef(null);
  const navRef = useRef(null);
  const [businesses, setBusinesses] = useState([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(false);

  const { fetchUserBusinesses, isLoading } = useBusinesses(accessToken);

  const fetchBusinesses = async () => {
    if(userRole === 'superadmin') return;
    setIsLoadingBusinesses(true);
    try {
      const response = await fetch(`${SERVICIOS_GENERALES_URL}/api/v1/user-business/get-by-user-id/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      const data = await response.json();
      const businessData = {businesses: data};
      setBusinesses(businessData);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setIsLoadingBusinesses(false);
    }
  };

  const fetchSuperAdminBusinesses = async () => {
    if (userRole !== 'superadmin') return;
    
    setIsLoadingBusinesses(true);
    try {
      const response = await fetch(`${SERVICIOS_GENERALES_URL}/api/v1/business/superadmin/businesses`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      setBusinesses(data.data);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setIsLoadingBusinesses(false);
    }
  };

  useEffect(() => {
    if (userRole === 'superadmin') {
      fetchSuperAdminBusinesses();
    } else {
      fetchBusinesses();
    }
  }, [userRole]);

  const handleSwitchBusiness = (subDomain, localId, name) => {
    dispatch(login({
      ...userData,
      accessToken,
      role: userRole,
      businessName: name,
      localId: localId,
      subDomain: subDomain,
      isAuthenticated: true,
    }));
  };

  const handleBusinessSelect = (business) => {

    dispatch(login({ 
      ...business,
      _id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      accessToken,
      role: userRole,
      businessName: business.name,
      localId: business.localId,
      subDomain: business.subDomain,
      isAuthenticated: true,
    }));
    setShowBusinessSelector(false);
  };


  const handleOpenBusinessSelector = () => {
    if (userData?.id) {
      fetchUserBusinesses(userData.id);
    }
    setShowBusinessSelector(true);
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-cartaai-red/10 border-cartaai-red" : "";
  };

  const regularNavItems = navItems(localId);

  const currentNavItems = userRole === 'superadmin' ? superadminNavItems(localId, subDomain) : regularNavItems;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (navRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
        setShowScrollLeft(scrollLeft > 0);
        setShowScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener('scroll', checkScroll);
      checkScroll();

      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(navElement);

      return () => {
        navElement.removeEventListener('scroll', checkScroll);
        resizeObserver.disconnect();
      };
    }
  }, []);

  const handleScroll = (direction) => {
    if (navRef.current) {
      const scrollAmount = direction === 'right' ? 100 : -100;
      navRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleOpenProfileModal = () => {
    setIsProfileModalOpen(true);
    setIsUserMenuOpen(false);
  };

  if (location.pathname === '/digital-menu' || location.pathname === '/order-summary') {
    return <>{children}</>;
  }

  return (
    <NotificationsProvider>
      <div className="flex flex-col md:flex-row h-screen text-foreground transition-colors duration-300">
        <aside className="md:w-16 h-16 md:h-screen glass-container border-t md:border-t-0 md:border-r border-border/20 hidden md:flex md:flex-col fixed bottom-0 md:relative w-[85%] mx-auto md:w-auto left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 z-50 rounded-full md:rounded-none px-4 md:px-0 backdrop-blur-md">
          <div className="hidden md:block p-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
              <rect width="32" height="32" rx="4" fill="var(--cartaai-red)"/>
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" transform="rotate(5 16 16)">AI</text>
              <circle cx="28" cy="4" r="2" fill="black"/>
              <circle cx="28" cy="4" r="1" fill="var(--cartaai-red)"/>
              <path d="M28 4H4" stroke="black" strokeWidth="2"/>
            </svg>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <nav ref={navRef} className="flex md:block h-full justify-center overflow-x-auto md:overflow-y-auto scrollbar-hide">
              <TooltipProvider>
                <NavItems navItems={currentNavItems} isActive={isActive} />
              </TooltipProvider>
            </nav>
            <ScrollButtons 
              showLeft={showScrollLeft} 
              showRight={showScrollRight} 
              onScroll={handleScroll}
              className="absolute inset-y-0 left-0 md:hidden"
            />
            <ScrollButtons 
              showLeft={showScrollLeft} 
              showRight={showScrollRight} 
              onScroll={handleScroll}
              className="absolute inset-y-0 right-0 md:hidden"
            />
          </div>
        </aside>
        
        <div className="flex-1 flex flex-col h-screen pb-16 md:pb-0">
          <header className="glass-container border-b border-border/20 backdrop-blur-md rounded-none relative z-[99]">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                {userRole === 'superadmin' ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-accent/50 px-3 py-1.5 rounded-md transition-colors duration-200">
                      <Store className="w-4 h-4 text-cartaai-red" />
                      <div className="flex flex-col items-start">
                        <h2 className="text-foreground font-semibold">
                          {businessName || 'Seleccionar Restaurante'}
                        </h2>
                          {localId && <span className="text-sm text-foreground/60">Local #{localId}</span>}
                      </div>
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent className="w-56 z-[9999] max-h-[80vh] overflow-y-auto">
                      <DropdownMenuItem onClick={() => navigate('/token-monitor')}>
                        <Monitor className="w-4 h-4 mr-2" />
                        Token Monitor
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => navigate('/super-delivery')}>
                        <Truck className="w-4 h-4 mr-2" />
                        Delivery Global
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      {businesses.map((business) => (
                        <DropdownMenuSub key={business.subDomain}>
                          <DropdownMenuSubTrigger>
                            <Store className="w-4 h-4 mr-2" />
                            {business.locals[0]?.name || business.subDomain}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="max-h-[60vh] overflow-y-auto">
                            {business.locals.map((local) => (
                              <DropdownMenuItem 
                                key={local.localId}
                                onClick={() => handleSwitchBusiness(business.subDomain, local.localId, local.name)}
                              >
                                <Store className="w-4 h-4 mr-2" />
                                {local.name}
                                <span className="ml-auto text-xs text-muted-foreground">
                                  #{local.localId}
                                </span>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  businessName && localId && (
                    <button
                      onClick={handleOpenBusinessSelector}
                      className="flex items-center gap-2 hover:bg-accent/50 px-3 py-1.5 rounded-md transition-colors duration-200"
                    >
                      <Building2 className="w-4 h-4 text-cartaai-red" />
                      <div className="flex flex-col items-start">
                        <h2 className="text-foreground font-semibold">{businessName}</h2>
                        <span className="text-sm text-foreground/60">Local #{localId}</span>
                      </div>
                    </button>
                  )
                )}
                <div className="flex items-center gap-3 ml-auto">
                  <NotificationsButton />
                  <ThemeToggle />
                  
                  {userRole !== 'superadmin' && (
                    <button 
                      onClick={() => window.open(`https://${subDomain}.cartaai.pe`, '_blank')}
                      className="text-foreground text-sm font-semibold px-4 py-2 rounded-md bg-accent/50 hover:bg-accent/80 transition-all duration-300 flex items-center backdrop-blur-sm hover:shadow-md"
                    >
                      <FileText className="mr-2 h-4 w-4" /> 
                      <span className="hidden sm:inline">Carta Digital</span>
                    </button>
                  )}
                  
                  <div ref={userMenuRef} className="relative">
                    <button 
                      className="text-foreground text-sm font-semibold px-4 py-2 rounded-md bg-accent/50 hover:bg-accent/80 transition-all duration-300 flex items-center backdrop-blur-sm hover:shadow-md"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                      <User className="mr-2 h-4 w-4" /> 
                      <span className="hidden sm:inline">Mi Perfil</span>
                    </button>
                    {isUserMenuOpen && <UserDropdown onOpenProfileModal={handleOpenProfileModal} />}
                  </div>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>

        <MobileNav />
        <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        <NotificationsModal />
        <BusinessSelectorModal
          isOpen={showBusinessSelector}
          onClose={() => setShowBusinessSelector(false)}
          businesses={businesses}
          onSelect={handleBusinessSelect}
          isLoading={isLoading}
        />
        <Toaster />
      </div>
    </NotificationsProvider>
  );
};

export default Layout;