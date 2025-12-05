import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';

const UserDropdown = ({ onOpenProfileModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="fixed right-0 mt-2 w-48 rounded-lg shadow-lg glass-container ring-1 ring-gray-400/30 dark:ring-gray-600/30 backdrop-blur-md z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <button
          onClick={onOpenProfileModal}
          className="block w-full text-left px-4 py-2 text-sm text-cartaai-white hover:bg-white/10 transition-colors duration-200 first:rounded-t-lg flex items-center"
          role="menuitem"
        >
          <User className="mr-2 h-4 w-4 text-cartaai-red" />
          Mi perfil
        </button>
        <button
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
          className="block w-full text-left px-4 py-2 text-sm text-cartaai-white hover:bg-white/10 transition-colors duration-200 last:rounded-b-lg flex items-center"
          role="menuitem"
        >
          <LogOut className="mr-2 h-4 w-4 text-cartaai-red" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;