export const filterProductsBySearch = (groupedProducts, searchTerm) => {
  if (!searchTerm) return groupedProducts;

  const normalizedSearchTerm = searchTerm.toLowerCase();
  
  const filteredGroups = Object.entries(groupedProducts).reduce((acc, [category, products]) => {
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(normalizedSearchTerm)
    );
    
    // Solo incluimos la categoría si tiene productos que coinciden con la búsqueda
    if (filteredProducts.length > 0) {
      acc[category] = filteredProducts;
    }
    
    return acc;
  }, {});

  return filteredGroups;
};