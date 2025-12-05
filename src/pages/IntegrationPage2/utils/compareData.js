export const compareData = (restpeData, cartaAIData) => {
  // Paso 1: Comparar Categorías
  const categoriesComparison = restpeData.categories.map(category => ({
    restpe: category,
    cartaAI: cartaAIData.categories.find(c => c.rId === category.categoria_id) || null
  }));

  // Paso 2: Comparar Agrupadores/Modificadores
  const modifiersComparison = restpeData.groupers.map(grouper => ({
    restpe: grouper,
    cartaAI: cartaAIData.modifiers.find(m => m.rId === grouper.modificador_id) || null
  }));

  // Paso 3: Comparar Productos
  const productsComparison = restpeData.products.map(product => ({
    restpe: product,
    cartaAI: cartaAIData.products.find(p => p.rId === product.productogeneral_id) || null
  }));

  return {
    categories: categoriesComparison,
    modifiers: modifiersComparison,
    products: productsComparison
  };
}; 