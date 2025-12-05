export const transformPresentationsToProducts = (menuData) => {
  const allPresentations = [];
  const categories = new Set();

  menuData.forEach(({ category, products }) => {
    categories.add(category.name);
    
    products.forEach(product => {
      product.presentations.forEach(presentation => {
        allPresentations.push({
          title: presentation.name,
          description: presentation.description || "",
          price: presentation.price,
          image: presentation.imageUrl,
          category: category.name,
          modifiers: product.modifiers || [],
          isOutOfStock: !presentation.stock || presentation.stock <= 0,
        });
      });
    });
  });

  return {
    presentations: allPresentations,
    categories: Array.from(categories)
  };
};