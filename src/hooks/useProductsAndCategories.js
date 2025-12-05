import { useState, useEffect, useCallback } from 'react';
import { getModifiers } from './useModifiers';
import { useSelector } from 'react-redux';
import { getApiUrls } from '../config/api';
import { useToast } from "@/components/ui/use-toast";


export const useProductsAndCategories = () => {
  const API_URLS = getApiUrls();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allModifiers, setAllModifiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const localId = useSelector((state) => state.auth.localId);
  const subDomain = useSelector((state) => state.auth.subDomain);
  const { toast } = useToast();

  const loadDefaultCategories = useCallback(() => {
    const defaultCategories = [
      { id: 1, name: "Sánguches Clásicos", active: true, modifiers: [] },
      { id: 2, name: "Sánguches Especiales", active: true, modifiers: [] },
      { id: 3, name: "Complementos", active: true, modifiers: [] },
      { id: 4, name: "Bebidas", active: true, modifiers: [] },
      { id: 5, name: "Postres", active: true, modifiers: [] },
    ];
    setCategories(defaultCategories);
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/categorias/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }

      const data = await response.json();
      const transformedCategories = data.map(category => ({
        id: category._id,
        rId: category.rId,
        name: category.name,
        status: category.status,
        modifiers: [],
        order: category.order
      }));

      setCategories(transformedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías",
        variant: "destructive",
      });
      loadDefaultCategories();
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, toast, loadDefaultCategories, subDomain, localId]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/productos/get-all/${subDomain}/${localId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      });
    }
  }, [accessToken, toast, subDomain, localId]);

  const fetchModifiers = useCallback(async () => {
    const fetchedModifiers = await getModifiers();
    setAllModifiers(fetchedModifiers);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchModifiers();
  }, [fetchCategories, fetchProducts, fetchModifiers]);

  const updateCategories = useCallback((newCategories) => {
    setCategories(newCategories);
  }, []);

  const updateProducts = useCallback((newProducts) => {
    setProducts(newProducts);
  }, []);

  const handleModifierToggle = useCallback((categoryId, modifierId) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        const updatedModifiers = category.modifiers.includes(modifierId)
          ? category.modifiers.filter(id => id !== modifierId)
          : [...category.modifiers, modifierId];
        return { ...category, modifiers: updatedModifiers };
      }
      return category;
    });

    updateCategories(updatedCategories);
  }, [categories, updateCategories]);

  return {
    categories,
    products,
    allModifiers,
    isLoading,
    updateCategories,
    updateProducts,
    handleModifierToggle,
    fetchCategories
  };
};
