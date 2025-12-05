import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getApiUrls } from '@/config/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, Tag, Edit2, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CreateComboForm from './CreateComboForm';
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ConfirmDeleteModal = ({ combo, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-container rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <h2 className="text-xl font-bold text-cartaai-white text-center">¿Eliminar Combo?</h2>
          <p className="text-cartaai-white/80 text-center">
            ¿Estás seguro que deseas eliminar el combo "{combo.name}"? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="text-cartaai-white"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CombosList = ({ refreshTrigger = 0 }) => {
  const API_URL = getApiUrls();
  const { toast } = useToast();
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCombo, setEditingCombo] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comboToDelete, setComboToDelete] = useState(null);
  const token = useSelector(state => state.auth.accessToken);

  const fetchCombos = async () => {
    try {
      const response = await fetch(`${API_URL.SERVICIOS_GENERALES_URL}/api/v1/combos/local/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.type === "1") {
        setCombos(data.data);
      }
    } catch (error) {
      console.error('Error al obtener los combos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los combos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, [subDomain, refreshTrigger]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditSuccess = () => {
    setEditingCombo(null);
    fetchCombos();
  };

  const handleEditClick = (combo) => {
    console.log('Editando combo:', combo);
    setEditingCombo({
      ...combo,
      _id: combo.rId // Asegurarnos de que el ID esté disponible para la actualización
    });
  };

  const handleDeleteClick = (combo) => {
    console.log(combo, 'COMBO');
    setComboToDelete(combo);
  };

  const handleDeleteConfirm = async () => {
    if (!comboToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL.SERVICIOS_GENERALES_URL}/api/v1/combos/${comboToDelete.rId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.type === "1") {
        toast({
          title: "Combo eliminado",
          description: "El combo se eliminó exitosamente",
          variant: "success",
        });
        await fetchCombos();
      } else {
        toast({
          title: "Error",
          description: data.message || "Error al eliminar el combo",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error al eliminar el combo:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el combo",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setComboToDelete(null);
    }
  };

  const formatPrice = (price) => {
    return `S/ ${Number(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cartaai-white" />
      </div>
    );
  }

  if (combos.length === 0) {
    return (
      <div className="text-center text-cartaai-white py-8">
        No hay combos disponibles
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combos.map((combo) => (
          <Card key={combo.rId} className="glass-container">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-cartaai-white">{combo.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-cartaai-white hover:text-cartaai-white/80"
                    onClick={() => handleEditClick(combo)}
                    disabled={isDeleting}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-400"
                    onClick={() => handleDeleteClick(combo)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Badge variant={combo.active ? "success" : "destructive"}>
                    {combo.active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="text-cartaai-white">
                  {combo.buyQuantity}x{combo.getQuantity}
                </Badge>
                <Badge variant="outline" className="text-cartaai-white">
                  {formatPrice(combo.price)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-cartaai-white mb-2">Productos:</h4>
                <div className="space-y-2">
                  {combo.products.map((product, index) => (
                    <div 
                      key={`${combo.rId}-${product.product}`} 
                      className="flex justify-between items-center p-2 rounded glass-container"
                    >
                      <div className="flex-1">
                        <p className="text-cartaai-white">
                          {product.productDetails.name}
                          <span className="text-sm text-gray-400 ml-2">
                            x{product.quantity}
                          </span>
                        </p>
                        <div className="flex gap-2 mt-1">
                          {product.isFree && (
                            <Badge variant="success" className="text-xs">Gratis</Badge>
                          )}
                          {!product.isOptional && (
                            <Badge variant="secondary" className="text-xs">Obligatorio</Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">
                        {formatPrice(product.productDetails.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-400">
                <div>
                  <p>Estrategia: {combo.priceStrategy}</p>
                  <p>Mezcla: {combo.allowMix ? "Permitida" : "No permitida"}</p>
                </div>
                <div className="text-right">
                  <p>Válido hasta:</p>
                  <p>{format(new Date(combo.validUntil), "dd/MM/yyyy", { locale: es })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingCombo && (
        <CreateComboForm
          open={true}
          onClose={() => setEditingCombo(null)}
          onSuccess={handleEditSuccess}
          editMode={true}
          comboData={editingCombo}
        />
      )}

      {comboToDelete && (
        <ConfirmDeleteModal
          combo={comboToDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setComboToDelete(null)}
        />
      )}
    </>
  );
};

export default CombosList; 