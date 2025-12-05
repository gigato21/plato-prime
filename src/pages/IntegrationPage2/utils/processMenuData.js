export const processMenuData = (data) => {
  // Extraer categorías directamente
  const categories = data.data.categorias;

  // Extraer productos directamente
  const products = data.data.menu;

  // Procesar agrupadores únicos
  const uniqueGroupers = new Map();

  products.forEach(product => {
    if (product.lista_agrupadores && Array.isArray(product.lista_agrupadores)) {
      product.lista_agrupadores.forEach(grouper => {
        // Usamos el modificador_id como clave única
        if (!uniqueGroupers.has(grouper.modificador_id)) {
          uniqueGroupers.set(grouper.modificador_id, grouper);
        }
      });
    }
  });

  // Convertir Map a Array
  const groupers = Array.from(uniqueGroupers.values());

  return {
    categories,
    products,
    groupers
  };
}; 