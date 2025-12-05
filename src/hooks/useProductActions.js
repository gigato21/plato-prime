import { useCallback } from 'react';

export const useProductActions = (products, setProducts) => {
  const updateLocalStorage = useCallback((updatedProducts) => {
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  }, []);

  const handleProductActions = {
    edit: useCallback((product) => {
      // Navigation logic should be handled in the component
    }, []),

    selectCategory: useCallback((product) => {
      // This action is now handled by the modal component
    }, []),

    toggleStatus: useCallback((productId) => {
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, active: !p.active } : p
      );
      setProducts(updatedProducts);
      updateLocalStorage(updatedProducts);
    }, [products, setProducts, updateLocalStorage]),

    toggleModifier: useCallback((productId, modifierId) => {
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          const modifiers = product.modifiers || [];
          const updatedModifiers = modifiers.includes(modifierId)
            ? modifiers.filter(id => id !== modifierId)
            : [...modifiers, modifierId];
          return { ...product, modifiers: updatedModifiers };
        }
        return product;
      });
      setProducts(updatedProducts);
      updateLocalStorage(updatedProducts);
    }, [products, setProducts, updateLocalStorage]),

    categorySelected: useCallback((productId, categoryName) => {
      const updatedProducts = products.map(p => 
        p.id === productId ? { ...p, category: categoryName } : p
      );
      setProducts(updatedProducts);
      updateLocalStorage(updatedProducts);
    }, [products, setProducts, updateLocalStorage]),

    togglePresentation: useCallback((productId, presentationId) => {
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          const updatedPresentations = product.presentations.map(presentation =>
            presentation.id === presentationId ? { ...presentation, active: !presentation.active } : presentation
          );
          return { ...product, presentations: updatedPresentations };
        }
        return product;
      });
      setProducts(updatedProducts);
      updateLocalStorage(updatedProducts);
    }, [products, setProducts, updateLocalStorage]),

    addPresentation: useCallback((productId, newPresentation) => {
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          const updatedPresentations = [...product.presentations, newPresentation];
          return { ...product, presentations: updatedPresentations };
        }
        return product;
      });
      setProducts(updatedProducts);
      updateLocalStorage(updatedProducts);
    }, [products, setProducts, updateLocalStorage]),
  };

  return { handleProductActions };
};