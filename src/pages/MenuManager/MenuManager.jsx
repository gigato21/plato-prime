import { useState } from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, FileSpreadsheet, Upload } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import AddCategoryModal from '@/pages/MenuManager/components/AddCategoryModal';
import EditCategoryModal from '@/pages/MenuManager/components/EditCategoryModal';
import PageHeader from '@/pages/MenuManager/components/PageHeader';
import CreateComboForm from '@/pages/MenuManager/components/CreateComboForm';
import ModifiersContent from '@/pages/MenuManager/components/ModifiersContent';
import OptionsTab from '@/pages/MenuManager/components/OptionsTab';
import ProductsTab from '@/pages/MenuManager/components/ProductsTab';
import CombosTab from '@/pages/MenuManager/components/CombosTab';
import CategoriesContent from '@/pages/MenuManager/components/CategoriesContent';
import MenuTabs from '@/pages/MenuManager/components/MenuTabs';
import { useProductsAndCategories } from '@/hooks/useProductsAndCategories';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from '@tanstack/react-query';

const MenuManager = () => {
  const API_URLS = getApiUrls();
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isCreateComboModalOpen, setIsCreateComboModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('categories');
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const { categories, fetchCategories } = useProductsAndCategories();
  const accessToken = useSelector(state => state.auth.accessToken);
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [isExcelUploading, setIsExcelUploading] = useState(false);
  const [excelUploadProgress, setExcelUploadProgress] = useState(0);

  const handleSync = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setSyncProgress(0);
    
    const startTime = Date.now();
    const totalDuration = 30000; // 30 segundos
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalDuration) * 100, 99);
      setSyncProgress(progress);
    }, 100);

    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/migrate-info-from-erp/migrate-restaurant-pe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          domain: "0",
          local: localId,
          quipupos: "0",
          subDomain: subDomain,
          justMenu: true
        })
      });

      if (!response.ok) throw new Error('Error en la sincronización');

      clearInterval(progressInterval);
      setSyncProgress(100);
      
      toast({
        title: "Éxito",
        description: "Sincronización completada correctamente",
      });
      
      await fetchCategories();
    } catch (error) {
      console.error('Error durante la sincronización:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la sincronización",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsSyncing(false);
      setTimeout(() => setSyncProgress(0), 2000);
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/categorias/create/${subDomain}/${localId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          rId: `CAT_${Date.now()}`,
          source: "0",
          name: categoryData.name,
          order: categoryData.order || "1"
        })
      });
      
      if (!response.ok) throw new Error("Error al crear la categoría");
      await fetchCategories(); 
      toast({
        title: "Éxito",
        description: "Categoría creada correctamente",
      });
      setIsAddCategoryModalOpen(false);
    } catch (error) {
      console.error('Error al crear categoría:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (id, newData) => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/categorias/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(newData)
      });

      if (!response.ok) throw new Error("Error al actualizar la categoría");
      await fetchCategories();
      toast({
        title: "Éxito",
        description: "Categoría actualizada correctamente",
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/categorias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error("Error al eliminar la categoría");
      await fetchCategories();
      toast({
        title: "Éxito",
        description: "Categoría eliminada correctamente",
      });
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/download-menu-pdf/${subDomain}/${localId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) throw new Error('Error al descargar el PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${subDomain}-local-${localId}-menu.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Éxito",
        description: "PDF descargado correctamente",
      });
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el PDF",
        variant: "destructive",
      });
    }
  };

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsExcelUploading(true);
    setExcelUploadProgress(0);

    // Iniciar el progreso simulado (estimamos 30 segundos para Excel)
    const startTime = Date.now();
    const estimatedDuration = 30000; // 30 segundos
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / estimatedDuration) * 100, 99);
      setExcelUploadProgress(progress);
    }, 100);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu-excel/upload/${subDomain}/${localId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData
      });

      const result = await response.json();

      if (result.type !== "1") {
        throw new Error(result.message || 'Error al cargar el archivo Excel');
      }

      clearInterval(progressInterval);
      setExcelUploadProgress(100);

      toast({
        title: "Éxito",
        description: "Menú cargado correctamente desde Excel",
      });

      await fetchCategories();
      await queryClient.invalidateQueries(['products']);
      await queryClient.invalidateQueries(['modifiers']);
      await queryClient.invalidateQueries(['options']);

    } catch (error) {
      console.error('Error uploading excel:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar el archivo Excel",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsExcelUploading(false);
      setTimeout(() => setExcelUploadProgress(0), 2000);
      event.target.value = '';
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImageUploading(true);
    setImageUploadProgress(0);

    // Iniciar el progreso simulado
    const startTime = Date.now();
    const estimatedDuration = 60000; // 60 segundos
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / estimatedDuration) * 100, 99);
      setImageUploadProgress(progress);
    }, 100);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu-parser/upload/${subDomain}/${localId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData
      });

      const result = await response.json();

      if (result.type !== "1") {
        throw new Error(result.message || 'Error al cargar la imagen del menú');
      }

      clearInterval(progressInterval);
      setImageUploadProgress(100);

      toast({
        title: "Éxito",
        description: "Menú cargado correctamente desde imagen",
      });

      // Recargar los datos después de la carga exitosa
      await fetchCategories();
      await queryClient.invalidateQueries(['products']);
      await queryClient.invalidateQueries(['modifiers']);
      await queryClient.invalidateQueries(['options']);

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar la imagen del menú",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setIsImageUploading(false);
      setTimeout(() => setImageUploadProgress(0), 2000);
      event.target.value = '';
    }
  };

  const handleCreateCombo = () => {
    setIsCreateComboModalOpen(true);
  };

  const handleCloseComboModal = () => {
    setIsCreateComboModalOpen(false);
  };

  const renderTabContent = () => {
    const variants = {
      enter: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="exit"
          animate="enter"
          exit="exit"
          variants={variants}
          transition={{ duration: 0.2 }}
        >
          <div className="glass-container">
            <CardContent className="p-6">
              {activeTab === 'categories' && (
                <CategoriesContent
                  categories={categories}
                  onAddCategory={() => setIsAddCategoryModalOpen(true)}
                  onEditCategory={openEditModal}
                  onDeleteCategory={handleDeleteCategory}
                  fetchCategories={fetchCategories}
                />
              )}
              {activeTab === 'products' && <ProductsTab categories={categories} />}
              {activeTab === 'combos' && <CombosTab onCreateCombo={handleCreateCombo} />}
              {activeTab === 'modifiers' && <ModifiersContent />}
              {activeTab === 'options' && <OptionsTab />}
            </CardContent>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader title="Gestor de Menú" />
        <div className="flex items-center gap-2">
          {/* <Button 
            onClick={() => navigate('/menu-generator')}
            className="bg-cartaai-red hover:bg-cartaai-red/80"
          >
            <Printer className="mr-2 h-4 w-4" />
            Menú Imprimible
          </Button> */}
          
          {/* Nuevos botones para carga de archivos */}
          <div className="relative">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleExcelUpload}
              className="hidden"
              id="excel-upload"
              disabled={isExcelUploading || isSyncing}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => document.getElementById('excel-upload').click()}
                className="bg-cartaai-red hover:bg-cartaai-red/80"
                disabled={isExcelUploading || isSyncing}
              >
                {isExcelUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                )}
                {isExcelUploading ? 'Procesando...' : 'Cargar Excel'}
              </Button>
              {excelUploadProgress > 0 && (
                <Progress value={excelUploadProgress} className="h-2 w-full" />
              )}
            </div>
          </div>

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={isImageUploading || isSyncing}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => document.getElementById('image-upload').click()}
                className="bg-cartaai-red hover:bg-cartaai-red/80"
                disabled={isImageUploading || isSyncing}
              >
                {isImageUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isImageUploading ? 'Procesando...' : 'Cargar Imagen'}
              </Button>
              {imageUploadProgress > 0 && (
                <Progress value={imageUploadProgress} className="h-2 w-full" />
              )}
            </div>
          </div>

          <Button 
            onClick={handleDownloadPDF}
            className="bg-cartaai-red hover:bg-cartaai-red/80"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar PDF
          </Button>
          
          <div className="flex flex-col gap-2 w-48">
            <Button 
              onClick={handleSync} 
              disabled={isSyncing}
              className="bg-cartaai-red hover:bg-cartaai-red/80"
            >
              {isSyncing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sincronizar
            </Button>
            {syncProgress > 0 && (
              <Progress value={syncProgress} className="h-2" />
            )}
          </div>
        </div>
      </div>
      
      <MenuTabs activeTab={activeTab} onTabChange={setActiveTab}>
        {renderTabContent()}
      </MenuTabs>

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        onEditCategory={handleUpdateCategory}
        category={selectedCategory}
      />

      <CreateComboForm
        open={isCreateComboModalOpen}
        onClose={handleCloseComboModal}
      />
    </div>
  );
};

export default MenuManager;
