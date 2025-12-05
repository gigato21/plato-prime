import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
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
import TokenMonitor from './pages/TokenMonitor';
import CreateBusiness from './pages/CreateBusiness';
import BusinessVerificationRoute from './components/BusinessVerificationRoute';
import MenuGenerator from './pages/MenuGenerator';
import Gallery from './pages/Gallery';
import IntegrationSetup from './pages/IntegrationSetup';
import SetupOptionsModal from './components/setup/SetupOptionsModal';
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

const PageWrapper = ({ children }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {children}
    </div>
  );
};

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
  const { showSetupOptions, handleSetupChoice } = useAuth();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userRole = useSelector(state => state.auth.role);
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);
  const needsBusinessSetup = !localId || !subDomain;

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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<SignupPage />} />
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