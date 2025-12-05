export const processFormData = (data) => {
  // Destructure presentations out and spread the rest
  const { presentations, ...productData } = data;
  
  return {
    ...productData,
    basePrice: Number(data.basePrice) || 0,
    modifiers: data.modifiers.map(modifier => ({
      modifierId: modifier.modifierId,
      customizedOptions: modifier.customizedOptions.map(option => ({
        optionId: option.optionId,
        isAvailable: option.isAvailable,
        price: Number(option.price) || 0
      }))
    }))
  };
};