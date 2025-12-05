import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HomeIcon, MessageSquare, Store, Users, MapPin, Share2, LayoutList, Image, ClipboardList, Shield, Bot } from 'lucide-react';
import { navItems, superadminNavItems } from '@/nav-items';

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = useSelector(state => state.auth.role);
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);

  const currentNavItems = userRole === 'superadmin' ? superadminNavItems(localId, subDomain) : navItems(localId);

  const isActive = (path) => {
    return location.pathname === path ? "bg-cartaai-red/10 border-cartaai-red" : "";
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {currentNavItems.slice(0, 5).map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full ${isActive(item.path)}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MobileNav;