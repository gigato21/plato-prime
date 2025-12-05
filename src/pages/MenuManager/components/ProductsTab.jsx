import { useState } from 'react';
import { Button } from "@/components/ui/button";
import ProductFormModal from './ProductFormModal';
import ProductsTable from './ProductsTable';
import EditProductModal from './EditProductModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getApiUrls } from '@/config/api';
import { useSelector } from 'react-redux';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelectFilter from '../../../components/token-monitor/MultiSelectFilter';

const ProductsTab = ({ categories }) => {
  const API_URLS = getApiUrls();
  const [isProductFormModalOpen, setIsProductFormModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const accessToken = useSelector(state => state.auth.accessToken);
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', subDomain, localId],
    queryFn: async () => {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      if (!response.ok) {
        throw new Error('Error al cargar los productos');
      }
      return response.json();
    }
  });

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleProductUpdated = async () => {
    await queryClient.invalidateQueries(['products']);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    toast({
      title: "Éxito",
      description: "Producto actualizado correctamente",
    });
  };

  const handleProductAdded = async () => {
    await queryClient.invalidateQueries(['products']);
    setIsProductFormModalOpen(false);
    toast({
      title: "Éxito",
      description: "Producto creado correctamente",
    });
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(c => c !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  if (error) {
    toast({
      title: "Error",
      description: "No se pudieron cargar los productos",
      variant: "destructive",
    });
  }

  const categoryOptions = categories.map(cat => ({
    value: cat.rId,
    label: cat.name
  }));

  const filteredProducts = products.filter(product => {
    const nameFilter = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusFilter = filter === 'all' ? true : 
                        filter === 'active' ? product.status === 1 : 
                        product.status === 0;
    const categoryFilter = selectedCategories.length === 0 ? true :
                          selectedCategories.includes(product.categoryId);

    return nameFilter && statusFilter && categoryFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center flex-1">
          <Input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3"
          />
          <div className="w-64">
            <MultiSelectFilter
              selected={selectedCategories}
              options={categoryOptions}
              onSelect={handleCategorySelect}
              placeholder="Filtrar por categorías"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px] bg-background/50 text-foreground border-border">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => setIsProductFormModalOpen(true)}
          className="bg-cartaai-red hover:bg-cartaai-red/80"
        >
          Agregar Producto
        </Button>
      </div>

      <ProductsTable 
        products={filteredProducts} 
        onEditProduct={handleEditProduct}
        isLoading={isLoading}
        categories={categories}
      />

      <ProductFormModal
        isOpen={isProductFormModalOpen}
        onClose={() => setIsProductFormModalOpen(false)}
        categories={categories}
        onProductAdded={handleProductAdded}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          product={selectedProduct}
          onProductUpdated={handleProductUpdated}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ProductsTab;
