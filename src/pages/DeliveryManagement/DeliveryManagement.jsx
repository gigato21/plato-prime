import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelector } from 'react-redux';
import DeliveryCompaniesSection from './components/DeliveryCompaniesSection';
import DriversSection from './components/DriversSection';
import { fetchCompanies, fetchDrivers } from './services/deliveryServices';

const DeliveryManagement = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const [companies, setCompanies] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Obtenemos el subDomain y localId del usuario actual desde Redux
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);

  useEffect(() => {
    const loadData = async () => {
      if (!subDomain || !localId) return;
      
      setIsLoading(true);
      try {
        // Cargar empresas y conductores del restaurante actual
        const companiesResponse = await fetchCompanies(subDomain, localId);
        setCompanies(companiesResponse.data || []);
        
        const driversResponse = await fetchDrivers(subDomain, localId);
        setDrivers(driversResponse.data || []);
      } catch (err) {
        setError("Error al cargar los datos. Por favor, intenta nuevamente.");
        console.error("Error fetching delivery data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [subDomain, localId]);

  if (!subDomain || !localId) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-cartaai-white/70">No hay restaurante seleccionado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-cartaai-white">Gestión de Delivery</h1>
      
      <Tabs defaultValue="companies" value={activeTab} onValueChange={setActiveTab} className="glass-container p-6 rounded-lg">
        <TabsList className="bg-cartaai-black/50">
          <TabsTrigger value="companies">Empresas de Delivery</TabsTrigger>
          <TabsTrigger value="drivers">Conductores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="companies" className="mt-6">
          <DeliveryCompaniesSection 
            companies={companies} 
            setCompanies={setCompanies} 
            isLoading={isLoading} 
            error={error}
            subDomain={subDomain}
            localId={localId}
          />
        </TabsContent>
        
        <TabsContent value="drivers" className="mt-6">
          <DriversSection 
            drivers={drivers} 
            setDrivers={setDrivers} 
            companies={companies}
            isLoading={isLoading} 
            error={error}
            subDomain={subDomain}
            localId={localId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliveryManagement; 