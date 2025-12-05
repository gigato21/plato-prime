import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BusinessVerificationRoute = ({ children }) => {
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);
  const currentPath = window.location.pathname;

  // Si el usuario no tiene negocio registrado (sin localId o subDomain)
  if (!localId || !subDomain) {
    // Si ya está en la página de restaurante, mostrarla
    if (currentPath === '/restaurant') {
      return children;
    }
    // Si no, redirigir a la página de restaurante
    return <Navigate to="/restaurant" />;
  }

  // Si tiene negocio registrado, mostrar la página solicitada
  return children;
};

export default BusinessVerificationRoute;