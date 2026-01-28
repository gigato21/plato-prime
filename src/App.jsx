import { useEffect, forwardRef } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import { login as reduxLogin, logout as reduxLogout } from '@/redux/slices/authSlice';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
// import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders/Orders';
import WhatsApp from './pages/WhatsApp/WhatsApp';
import Restaurant from './pages/Restaurant';
import MenuManager from './pages/MenuManager/MenuManager';
// import Coupons from './pages/Coupons';
import Staff from './pages/Staff';
import DeliveryZones from './pages/DeliveryZones';
// import Share from './pages/Share';
import DigitalMenu from './pages/DigitalMenu';
import SignupPage from './pages/SignupPage';
import AuthPage from './pages/AuthPage';
import TokenMonitor from './pages/TokenMonitor';
import CreateBusiness from './pages/CreateBusiness';
import BusinessVerificationRoute from './components/BusinessVerificationRoute';
import MenuGenerator from './pages/MenuGenerator';
import Gallery from './pages/Gallery';
import IntegrationSetup from './pages/IntegrationSetup';
import SetupOptionsModal from './components/setup/SetupOptionsModal';
import RoleManagement from './pages/RoleManagement';
import { useAuth } from './hooks/useAuth';
import BusinessSetupChoice from './pages/BusinessSetupChoice';
import Dashboard from './pages/Dashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard/SuperAdminDashboard';
import BotConfig from './pages/BotConfig/BotConfig';
import DeliveryManagement from './pages/DeliveryManagement/DeliveryManagement';
import SuperAdminDelivery from './pages/SuperAdminDelivery/SuperAdminDelivery';
import SuperAdminOrders from './pages/SuperAdminOrders/SuperAdminOrders';
import IntegrationPage from './pages/IntegrationPage/IntegrationPage';
import IntegrationPage2 from './pages/IntegrationPage2/IntegrationPage2';
const queryClient = new QueryClient();

const PageWrapper = forwardRef(function PageWrapper({ children }, ref) {
  return (
    <div ref={ref} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {children}
    </div>
  );
});

const PrivateRoute = ({ children, allowedRoles = ['admin', 'worker'] }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.role);
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole === 'superadmin' && (!subDomain || !localId)) {
    return <Navigate to="/token-monitor" />;
  }

  if (!allowedRoles.includes(userRole) && userRole !== 'superadmin') {
    return <Navigate to="/" />;
  }

  return children;
};

const SuperAdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.role);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole !== 'superadmin') {
    return <Navigate to="/" />;
  }

  return children;
};

const AppContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSetupOptions, handleSetupChoice, navigationPath, setNavigationPath } = useAuth();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.role);
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);
  const needsBusinessSetup = !localId || !subDomain;

  // Sync backend auth session -> Redux auth state (prevents /login redirect loops)
  useEffect(() => {
    const applySession = async (session) => {
      if (!session?.user) {
        dispatch(reduxLogout());
        return;
      }

      // Fetch role from user_roles; if missing, default to 'worker' to keep existing UI usable.
      let role = 'worker';
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
        if (!error && data?.role) {
          role = data.role === 'admin' ? 'admin' : 'worker';
        }
      } catch {
        // keep default role
      }

      dispatch(
        reduxLogin({
          isAuthenticated: true,
          accessToken: session.access_token,
          _id: session.user.id,
          name:
            session.user.user_metadata?.name ||
            session.user.user_metadata?.full_name ||
            session.user.email ||
            'Usuario',
          email: session.user.email,
          phone: null,
          role,
          // Preserve any existing business context in Redux; app will still enforce setup if missing.
          subDomain,
          localId,
        })
      );
    };

    // Listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Avoid doing async work directly in the callback
      setTimeout(() => {
        applySession(session);
      }, 0);
    });

    // THEN hydrate
    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
    });

    return () => subscription.unsubscribe();
    // We intentionally don't depend on subDomain/localId to avoid re-subscribing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Handle navigation from useAuth hook
  useEffect(() => {
    if (navigationPath) {
      navigate(navigationPath);
      setNavigationPath(null);
    }
  }, [navigationPath, navigate, setNavigationPath]);

  return (
    <>
      {showSetupOptions && (
        <SetupOptionsModal onSelect={handleSetupChoice} />
      )}
      
      {isAuthenticated ? (
        <div>
          <Routes>
            <Route path="/menu-generator" element={<MenuGenerator />} />
            <Route
              path="*"
              element={
                <Layout>
                  <PageWrapper>
                    <Routes>
                      {/* Rutas de configuración inicial */}
                      <Route path="/setup-choice" element={<BusinessSetupChoice />} />
                      <Route path="/create-business" element={<CreateBusiness />} />
                      <Route path="/integration-setup" element={<IntegrationSetup />} />
                      
                      {userRole === 'superadmin' && !subDomain ? (
                        <>
                          <Route path="/token-monitor" element={<TokenMonitor />} />
                          <Route path="/super-delivery" element={<SuperAdminDelivery />} />
                          <Route path="/super-dashboard" element={<SuperAdminDashboard />} />
                          <Route path="/super-orders" element={<SuperAdminOrders />} />
                          <Route path="*" element={<Navigate to="/token-monitor" />} />
                        </>
                      ) : needsBusinessSetup ? (
                        // Si no hay negocio configurado, redirigir a setup-choice
                        <Route path="*" element={<Navigate to="/setup-choice" />} />
                      ) : (
                        // Rutas normales cuando hay negocio configurado
                        <>
                          <Route path="/" element={
                            <PrivateRoute>
                              <BusinessVerificationRoute>
                                <Dashboard />
                              </BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          
                          {/* Rutas accesibles para admin y superadmin */}
                          <Route path="/orders" element={
                            <PrivateRoute allowedRoles={['admin', 'worker', 'superadmin']}>
                              <BusinessVerificationRoute><Orders /></BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          <Route path="/delivery-management" element={
                            <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                              <BusinessVerificationRoute><DeliveryManagement /></BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          <Route path="/bot-config" element={
                            <PrivateRoute allowedRoles={['admin', 'worker', 'superadmin']}>
                              <BusinessVerificationRoute><BotConfig /></BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          <Route path="/integration" element={
                            <PrivateRoute allowedRoles={['admin', 'worker', 'superadmin']}>
                              <BusinessVerificationRoute><IntegrationPage2 /></BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          <Route path="/whatsapp" element={
                            <PrivateRoute allowedRoles={['admin', 'worker', 'superadmin']}>
                              <BusinessVerificationRoute><WhatsApp /></BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          <Route path="/menu-manager" element={
                            <PrivateRoute allowedRoles={['admin', 'worker', 'superadmin']}>
                              <BusinessVerificationRoute><MenuManager /></BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          <Route path="/delivery-zones" element={
                            <PrivateRoute allowedRoles={['admin', 'worker', 'superadmin']}>
                              <BusinessVerificationRoute><DeliveryZones /></BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          <Route path="/restaurant" element={
                            <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                              <Restaurant />
                            </PrivateRoute>
                          } />
                          <Route path="/staff" element={
                            <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                              <BusinessVerificationRoute><Staff /></BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          <Route path="/gallery" element={
                            <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                              <BusinessVerificationRoute><Gallery /></BusinessVerificationRoute>
                            </PrivateRoute>
                          } />
                          
                          {/* Ruta de gestión de roles (protegida por el componente mismo) */}
                          <Route path="/role-management" element={<RoleManagement />} />
                          
                          {/* Rutas especiales para superadmin */}
                          {userRole === 'superadmin' && (
                            <>
                              <Route path="/token-monitor" element={<TokenMonitor />} />
                              <Route path="/super-delivery" element={<SuperAdminDelivery />} />
                              <Route path="/super-dashboard" element={<SuperAdminDashboard />} />
                            </>
                          )}
                          
                          <Route path="*" element={<Navigate to="/orders" />} />
                        </>
                      )}
                      <Route path="/digital-menu" element={<DigitalMenu />} />
                    </Routes>
                  </PageWrapper>
                </Layout>
              }
            />
          </Routes>
        </div>
      ) : (
        <PageWrapper>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/registro" element={<SignupPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </PageWrapper>
      )}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;