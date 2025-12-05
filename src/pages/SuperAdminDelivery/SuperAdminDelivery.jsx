import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import CompaniesList from './components/CompaniesList';
import CreateCompanyForm from './components/CreateCompanyForm';
import DriversList from './components/DriversList';
import CreateDriverForm from './components/CreateDriverForm';

const SuperAdminDelivery = () => {
  const [activeTab, setActiveTab] = useState("companies");
  const [companiesTab, setCompaniesTab] = useState("list");
  const [driversTab, setDriversTab] = useState("list");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Gestión de Delivery SuperAdmin</h1>
        
        {activeTab === "companies" && companiesTab === "list" && (
          <Button 
            onClick={() => setCompaniesTab("create")} 
            className="glass-button bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border-[#3B82F6]/20 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Nueva Empresa
          </Button>
        )}

        {activeTab === "drivers" && driversTab === "list" && (
          <Button 
            onClick={() => setDriversTab("create")} 
            className="glass-button bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border-[#3B82F6]/20 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Nuevo Conductor
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="companies" value={activeTab} onValueChange={setActiveTab} className="glass-container p-6 rounded-lg">
        <TabsList className="bg-[#121212]/50">
          <TabsTrigger value="companies">Empresas de Delivery</TabsTrigger>
          <TabsTrigger value="drivers">Conductores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="companies" className="mt-6 space-y-6">
          {/* Tabs secundarios para Empresas */}
          <Tabs defaultValue="list" value={companiesTab} onValueChange={setCompaniesTab}>
            <TabsList className="bg-[#121212]/50">
              <TabsTrigger value="list">Listado de Empresas</TabsTrigger>
              <TabsTrigger value="create">Crear Empresa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-4">
              <CompaniesList />
            </TabsContent>
            
            <TabsContent value="create" className="mt-4">
              <CreateCompanyForm 
                onSuccess={() => setCompaniesTab("list")} 
                isExpanded={true} 
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="drivers" className="mt-6">
          <Tabs defaultValue="list" value={driversTab} onValueChange={setDriversTab}>
            <TabsList className="bg-[#121212]/50">
              <TabsTrigger value="list">Listado de Conductores</TabsTrigger>
              <TabsTrigger value="create">Crear Conductor</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-4">
              <DriversList />
            </TabsContent>
            
            <TabsContent value="create" className="mt-4">
              <CreateDriverForm 
                onSuccess={() => setDriversTab("list")} 
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperAdminDelivery; 