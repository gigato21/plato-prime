import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Search, CalendarIcon } from 'lucide-react';
import { getApiUrls } from '@/config/api';
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PRICE_STRATEGIES = {
  fixed: "Precio Fijo",
  sum: "Suma de Productos",
  most_expensive: "Producto más Caro",
  top_two_expensive: "Dos más Caros"
};

const CreateComboForm = ({
  open,
  onClose,
  onSuccess,
  editMode = false,
  comboData = null
}) => {
  const API_URL = getApiUrls();
  const { toast } = useToast();
  const subDomain = useSelector(state => state.auth.subDomain);
  const token = useSelector(state => state.auth.accessToken);
  const localId = useSelector(state => state.auth.localId);
  const searchRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  
  // Estados básicos
  const [comboName, setComboName] = useState('');
  const [priceStrategy, setPriceStrategy] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [finalPrice, setFinalPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [allowMix, setAllowMix] = useState(true);

  // Estados específicos para buy_x_get_y
  const [firstQuantity, setFirstQuantity] = useState('');
  const [secondQuantity, setSecondQuantity] = useState('');

  const [validUntil, setValidUntil] = useState(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));

  // Cargar productos del backend
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await fetch(`${API_URL.SERVICIOS_GENERALES_URL}/api/v1/presentaciones/get-all-like-product/${subDomain}/${localId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener productos');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProducts(false);
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open, subDomain, token]);

  // Cargar datos del combo en modo edición
  useEffect(() => {
    if (editMode && comboData) {
      setComboName(comboData.name);
      setPriceStrategy(comboData.priceStrategy);
      setFinalPrice(comboData.price.toString());
      setFirstQuantity(comboData.buyQuantity?.toString() || '');
      setSecondQuantity(comboData.getQuantity?.toString() || '');
      setValidUntil(new Date(comboData.validUntil));
      setAllowMix(comboData.allowMix);
      
      // Mapear productos con la nueva estructura
      const productsWithDetails = comboData.products.map(p => ({
        producto: p.product,
        cantidad: p.quantity,
        price: p.productDetails?.price || 0,
        name: p.productDetails?.name || '',
        isOptional: p.isOptional,
        isFree: p.isFree
      }));
      setSelectedProducts(productsWithDetails);
    }
  }, [editMode, comboData]);

  // Filtrar productos basados en el término de búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim() || !products) return [];
    
    const searchLower = searchTerm.toLowerCase();
    return products.filter(product => {
      if (!product) return false;
      
      const nameMatch = product.name ? product.name.toLowerCase().includes(searchLower) : false;
      const categoryMatch = product.category ? product.category.toLowerCase().includes(searchLower) : false;
      
      return nameMatch || categoryMatch;
    });
  }, [searchTerm, products]);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProductSelect = (product) => {
    // Validar cantidad máxima de productos si allowMix está desactivado
    if (!allowMix && selectedProducts.length >= parseInt(firstQuantity)) {
      toast({
        title: "Límite alcanzado",
        description: `Solo puedes agregar ${firstQuantity} productos cuando la mezcla no está permitida`,
        variant: "destructive",
      });
      return;
    }

    const newProduct = {
      producto: product.id,
      cantidad: 1,
      price: product.basePrice,
      name: product.name,
      isOptional: true // Por defecto los nuevos productos son opcionales
    };

    setSelectedProducts(prev => [...prev, newProduct]);
    setSearchTerm('');
    setShowProductDropdown(false);
    calculatePrice([...selectedProducts, newProduct]);
  };

  const toggleProductOptional = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      isOptional: !updatedProducts[index].isOptional
    };
    setSelectedProducts(updatedProducts);
  };

  const updateProductQuantity = (index, newQuantity) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      cantidad: parseInt(newQuantity) || 1
    };
    setSelectedProducts(updatedProducts);
    calculatePrice(updatedProducts);
  };

  const removeProduct = (index) => {
    // No permitir eliminar productos no opcionales
    if (!selectedProducts[index].isOptional) {
      toast({
        title: "Acción no permitida",
        description: "No puedes eliminar un producto marcado como no opcional",
        variant: "destructive",
      });
      return;
    }

    const newSelectedProducts = [...selectedProducts];
    newSelectedProducts.splice(index, 1);
    setSelectedProducts(newSelectedProducts);
    calculatePrice(newSelectedProducts);
  };

  const calculatePrice = (products = selectedProducts) => {
    if (!priceStrategy || products.length === 0) return;

    let calculatedPrice = 0;
    const prices = products.map(p => p.price * p.cantidad);

    switch (priceStrategy) {
      case 'sum':
        calculatedPrice = prices.reduce((a, b) => a + b, 0);
        break;
      case 'most_expensive':
        calculatedPrice = Math.max(...prices);
        break;
      case 'top_two_expensive':
        calculatedPrice = prices
          .sort((a, b) => b - a)
          .slice(0, 2)
          .reduce((a, b) => a + b, 0);
        break;
      case 'fixed':
        // No recalcular si es precio fijo
        return;
      default:
        return;
    }

    // Aplicar descuentos según las cantidades
    if (firstQuantity && secondQuantity) {
      const total = parseInt(firstQuantity) + parseInt(secondQuantity);
      calculatedPrice = (calculatedPrice / total) * parseInt(firstQuantity);
    }

    setFinalPrice(calculatedPrice.toFixed(2));
  };

  useEffect(() => {
    calculatePrice();
  }, [priceStrategy, firstQuantity, secondQuantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const comboPayload = {
      name: comboName,
      price: priceStrategy === 'fixed' ? parseFloat(finalPrice) : null,
      buyQuantity: parseInt(firstQuantity) || 0,
      getQuantity: parseInt(secondQuantity) || 0,
      subDomain,
      localId,
      products: selectedProducts.map(p => ({
        product: p.producto,
        quantity: parseInt(p.cantidad),
        isOptional: p.isOptional,
        isFree: false
      })),
      priceStrategy,
      allowMix,
      validUntil: validUntil.toISOString(),
      active: comboData?.active ?? true
    };

    // Marcar los productos gratuitos
    const totalProducts = parseInt(firstQuantity) + parseInt(secondQuantity);
    comboPayload.products.forEach((p, index) => {
      if (index >= comboPayload.products.length - parseInt(secondQuantity)) {
        p.isFree = true;
      }
    });

    try {
      console.log('Enviando payload:', comboPayload);
      console.log('Modo edición:', editMode);
      console.log('ID del combo:', comboData?.rId);

      const url = editMode 
        ? `${API_URL.SERVICIOS_GENERALES_URL}/api/v1/combos/${comboData.rId}`
        : `${API_URL.SERVICIOS_GENERALES_URL}/api/v1/combos`;

      console.log('URL de la petición:', url);

      const response = await fetch(url, {
        method: editMode ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comboPayload)
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (data.type === "1") {
        toast({
          title: editMode ? "Combo actualizado" : "Combo creado",
          description: editMode ? "El combo se actualizó exitosamente" : "El combo se creó exitosamente",
          variant: "success",
        });
        onSuccess?.();
        onClose?.();
      } else {
        toast({
          title: "Error",
          description: data.message || (editMode ? "Error al actualizar el combo" : "Error al crear el combo"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(editMode ? 'Error al actualizar el combo:' : 'Error al crear el combo:', error);
      toast({
        title: "Error",
        description: editMode ? "Error al actualizar el combo" : "Error al crear el combo",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-container rounded-lg p-6 w-full max-w-2xl relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cartaai-white hover:text-cartaai-white/80 z-10"
        >
          <X className="h-6 w-6" />
        </button>
    <div className="space-y-6">
          <h1 className="text-3xl font-bold text-cartaai-white bg-cartaai-dark py-2 -mt-2 -mx-2">
            {editMode ? 'Editar Combo' : 'Crear Nuevo Combo'}
          </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="comboName" className="text-cartaai-white">Nombre del Combo</Label>
          <Input
            id="comboName"
            value={comboName}
            onChange={(e) => setComboName(e.target.value)}
            className="glass-input text-cartaai-white"
            required
          />
        </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="firstQuantity" className="text-cartaai-white">Cantidad a Comprar (X)</Label>
                <Input
                  id="firstQuantity"
                  type="number"
                  min="1"
                  value={firstQuantity}
                  onChange={(e) => setFirstQuantity(e.target.value)}
                  className="glass-input text-cartaai-white"
                  required
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="secondQuantity" className="text-cartaai-white">Cantidad a Llevar (Y)</Label>
                <Input
                  id="secondQuantity"
                  type="number"
                  min="1"
                  value={secondQuantity}
                  onChange={(e) => setSecondQuantity(e.target.value)}
                  className="glass-input text-cartaai-white"
                  required
                />
              </div>
            </div>

        <div>
              <Label htmlFor="priceStrategy" className="text-cartaai-white">Estrategia de Precio</Label>
              <Select onValueChange={setPriceStrategy} required>
            <SelectTrigger className="glass-input text-cartaai-white">
                  <SelectValue placeholder="Selecciona la estrategia de precio" />
            </SelectTrigger>
                <SelectContent className="glass-container">
                  {Object.entries(PRICE_STRATEGIES).map(([value, label]) => (
                    <SelectItem 
                      key={value} 
                      value={value}
                      className="text-cartaai-white hover:bg-gray-700 cursor-pointer focus:bg-gray-700 focus:text-cartaai-white"
                    >
                      {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

            <div className="flex gap-4 items-center mb-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="allowMix"
                  checked={allowMix}
                  onCheckedChange={setAllowMix}
                />
                <Label htmlFor="allowMix" className="text-cartaai-white">
                  Permitir mezcla de productos
                </Label>
              </div>
              <div className="text-sm text-gray-400">
                {allowMix 
                  ? "Los clientes podrán elegir entre más opciones de productos" 
                  : `Los clientes solo podrán elegir entre ${firstQuantity || '0'} productos`}
              </div>
            </div>

            <div ref={searchRef} className="relative">
              <Label htmlFor="productSearch" className="text-cartaai-white">Buscar Productos</Label>
              <div className="relative">
                <Input
                  id="productSearch"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  className="glass-input text-cartaai-white pl-10"
                  placeholder="Buscar por nombre o categoría..."
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              {showProductDropdown && searchTerm && (
                <div className="absolute z-50 w-full mt-1 glass-container rounded-md shadow-lg max-h-60 overflow-auto">
                  {isLoadingProducts ? (
                    <div className="p-2 text-gray-400">Cargando productos...</div>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-2 hover:bg-gray-700 cursor-pointer text-cartaai-white flex justify-between items-center"
                        onClick={() => handleProductSelect(product)}
                      >
                        <div>
                          <div>{product.name}</div>
                          <div className="text-sm text-gray-400">{product.category}</div>
                        </div>
                        <div>S/ {product.basePrice?.toFixed(2) || '0.00'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-400">No se encontraron productos</div>
                  )}
                </div>
              )}
            </div>

        <div className="space-y-2">
          <Label className="text-cartaai-white">Productos Seleccionados</Label>
          {selectedProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4 glass-container p-2 rounded">
                  <span className="text-cartaai-white flex-grow">
                    {product.name} - S/ {product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={product.isOptional}
                      onCheckedChange={() => toggleProductOptional(index)}
                    />
                    <span className="text-sm text-gray-400">
                      {product.isOptional ? "Opcional" : "Obligatorio"}
                    </span>
                  </div>
                  <Input
                    type="number"
                    min="1"
                    value={product.cantidad}
                    onChange={(e) => updateProductQuantity(index, e.target.value)}
                    className="glass-input text-cartaai-white w-20"
                  />
                  <Button 
                    type="button" 
                    onClick={() => removeProduct(index)} 
                    variant="destructive" 
                    size="sm"
                    disabled={!product.isOptional}
                  >
                Eliminar
              </Button>
            </div>
          ))}
        </div>

        <div>
              <Label htmlFor="finalPrice" className="text-cartaai-white">
                {priceStrategy === 'fixed' ? 'Precio Fijo del Combo' : 'El precio se calculará según los productos seleccionados'}
              </Label>
          {priceStrategy === 'fixed' ? (
          <Input
              id="finalPrice"
            type="number"
            step="0.01"
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
            className="glass-input text-cartaai-white"
            required
          />
          ) : (
            <div className="text-sm text-gray-400 mt-1">
              El precio final se calculará automáticamente según los productos que el cliente seleccione.
            </div>
          )}
        </div>

            <div>
              <Label className="text-cartaai-white">Válido Hasta</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal glass-input text-cartaai-white"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(validUntil, "PPP", { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass-container" align="start">
                  <Calendar
                    mode="single"
                    selected={validUntil}
                    onSelect={(date) => setValidUntil(date || validUntil)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

        <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                onClick={onClose} 
                variant="outline" 
                className="text-cartaai-white"
                disabled={isSubmitting}
              >
            Cancelar
          </Button>
              <Button 
                type="submit" 
                className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : (editMode ? 'Actualizar Combo' : 'Guardar Combo')}
          </Button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default CreateComboForm;