import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import EditProductModal from './EditProductModal';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useSelector } from 'react-redux';
import { getApiUrls } from '@/config/api';
import { useQueryClient } from '@tanstack/react-query';
import { Switch } from "@/components/ui/switch";
import SelectLocalsModal from './SelectLocalsModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ConvertToModifierModal from '../../../components/menu/ConvertToModifierModal';

const ProductsTable = ({ products = [], isLoading, categories }) => {
  const API_URLS = getApiUrls();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { toast } = useToast();
  const accessToken = useSelector(state => state.auth.accessToken);
  const queryClient = useQueryClient();
  const [loadingProductId, setLoadingProductId] = useState(null);
  const [isSelectLocalsModalOpen, setIsSelectLocalsModalOpen] = useState(false);
  const [isSelectLocalsModalOpenToDelete, setIsSelectLocalsModalOpenToDelete] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [localsToChange, setLocalsToChange] = useState([]);
  const localId = useSelector(state => state.auth.localId);
  const subDomain = useSelector(state => state.auth.subDomain);
  const [showConvertModal, setShowConvertModal] = useState(false);

  const handleEditClick = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e, product) => {
    e.stopPropagation();
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteClickWithMultiLocal = (e, product) => {
    e.stopPropagation();
    setProductToDelete(product);  
    setIsSelectLocalsModalOpenToDelete(true);
  };

  const handleProductUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
    queryClient.invalidateQueries(['products']);
    toast({
      title: "Éxito",
      description: "Producto actualizado correctamente",
    });
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/${productToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      toast({
        title: "Éxito",
        description: "El producto ha sido eliminado exitosamente",
      });

      queryClient.invalidateQueries(['products']);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleStatusToggle = async (product) => {
    setLoadingProductId(product._id);
    const newStatus = product.status === 0 ? 1 : 0;

    try {
      if (localId === "-1") {
        setPendingStatusUpdate({
          productId: product.rId,
          newStatus: newStatus
        });
        setIsSelectLocalsModalOpen(true);
        return;
      }

      await updateProductStatus(product._id, newStatus);

    } catch (error) {
      console.error('Error updating product status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del producto",
        variant: "destructive",
      });
    } finally {
      setLoadingProductId(null);
    }
  };

  const updateProductStatus = async (productId, newStatus) => {
    const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/${productId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        data: JSON.stringify({ status: newStatus }) 
      })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado del producto');
    }

    await queryClient.invalidateQueries(['products']);

    toast({
      title: "Éxito",
      description: "Estado del producto actualizado correctamente",
    });
  };

  const handleLocalsSelectedToDelete = async (selectedLocals) => {
    setLocalsToChange(selectedLocals)
    setIsDeleteDialogOpen(true);
  }

  const handleDeleteConfirmWithMultiLocal = async () => {
    try {

      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/delete-multiple-local/${productToDelete.rId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subDomain: subDomain,
          localsIds: localsToChange,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      toast({
        title: "Éxito",
        description: "El producto ha sido eliminado exitosamente",
      });

      queryClient.invalidateQueries(['products']);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  }


  const handleLocalsSelected = async (selectedLocals) => {
    if (!pendingStatusUpdate) return;
    
    try {
      setLoadingProductId(pendingStatusUpdate.productId);
      
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu2/update-multiple-local/productos/${pendingStatusUpdate.productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          localIds: selectedLocals,
          changes: {
            status: pendingStatusUpdate.newStatus
          },
          subDomain: subDomain
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del producto en múltiples locales');
      }

      await queryClient.invalidateQueries(['products']);

      toast({
        title: "Éxito",
        description: "Estado del producto actualizado correctamente en los locales seleccionados",
      });
    } catch (error) {
      console.error('Error updating product status in multiple locals:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del producto en los locales seleccionados",
        variant: "destructive",
      });
    } finally {
      setLoadingProductId(null);
      setIsSelectLocalsModalOpen(false);
      setPendingStatusUpdate(null);
    }
  };

  const handleConvertClick = (product) => {
    setSelectedProduct(product);
    setShowConvertModal(true);
  };

  if (isLoading) {
    return <div className="text-center text-cartaai-white py-4">Cargando productos...</div>;
  }

  if (!products.length) {
    return <div className="text-center text-cartaai-white py-4">No hay productos disponibles</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-cartaai-white">Nombre</TableHead>
            <TableHead className="text-cartaai-white">Categoría</TableHead>
            <TableHead className="text-cartaai-white">Precio Base</TableHead>
            <TableHead className="text-cartaai-white">Estado</TableHead>
            <TableHead className="text-cartaai-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const category = categories.find(cat => cat.rId === product.categoryId || cat.id === product.categoryId);
            const categoryName = category ? category.name : 'Sin categoría';

            return (
              <TableRow 
                key={product._id}
                className="cursor-pointer transition-colors hover:bg-cartaai-white/10"
              >
                <TableCell className="text-cartaai-white">{product.name}</TableCell>
                <TableCell className="text-cartaai-white">{categoryName}</TableCell>
                <TableCell className="text-cartaai-white">S/ {product.basePrice?.toFixed(2)}</TableCell>
                <TableCell>
                  {loadingProductId === product._id ? (
                    <div className="animate-spin h-4 w-4 border-2 border-cartaai-red border-t-transparent rounded-full" />
                  ) : (
                    <Switch
                      checked={product.status === 1}
                      onCheckedChange={() => handleStatusToggle(product)}
                      className="data-[state=checked]:bg-cartaai-red"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEditClick(e, product)}
                      className="text-cartaai-white hover:text-cartaai-red"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleConvertClick(product)}
                      className="text-cartaai-white hover:text-cartaai-red"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => localId !== "-1" ? handleDeleteClick(e, product):handleDeleteClickWithMultiLocal(e, product) }
                      className="text-cartaai-white hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onProductUpdated={handleProductUpdated}
          categories={categories}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={localId !== "-1" ? handleDeleteConfirm : handleDeleteConfirmWithMultiLocal} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <SelectLocalsModal
              isOpen={isSelectLocalsModalOpenToDelete}
              onClose={() => {
                setIsSelectLocalsModalOpenToDelete(false);
              }}
              onConfirm={handleLocalsSelectedToDelete}
              title="Seleccionar locales para crear el producto."
            />
      <SelectLocalsModal
        isOpen={isSelectLocalsModalOpen}
        onClose={() => {
          setIsSelectLocalsModalOpen(false);
          setPendingStatusUpdate(null);
          setLoadingProductId(null);
        }}
        onConfirm={handleLocalsSelected}
        title="Seleccionar locales para actualizar el estado del producto"
      />
      {selectedProduct && (
        <ConvertToModifierModal
          isOpen={showConvertModal}
          onClose={() => {
            setShowConvertModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default ProductsTable;