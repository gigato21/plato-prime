const FoodModal = ({ product, isOpen, onClose, addToCart }) => {
    if (!isOpen || !product) return null;

    const placeholderImage = "https://new.foodservicerewards.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781";

    const isValidImageUrl = (url) => {
      try {
        return url && (url.startsWith('http://') || url.startsWith('https://'));
      } catch {
        return false;
      }
    };

    const imageUrl = isValidImageUrl(product.imageUrl) ? product.imageUrl : placeholderImage;

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50" 
            onClick={onClose}
        >
            <div 
                className="glass-container w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto p-6 rounded-xl" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <button 
                        onClick={onClose} 
                        className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-cartaai-red text-white hover:bg-cartaai-red/80 transition-colors"
                    >
                        ×
                    </button>
                </div>
                
                <img 
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-full h-64 object-cover rounded-lg mb-4" 
                />
                
                <h2 className="text-xl font-bold mb-2 text-cartaai-white">{product.name}</h2>
                {product.description && (
                    <p className="text-cartaai-white/80 mb-4">{product.description}</p>
                )}
                
                <p className="text-cartaai-white font-semibold mb-4">
                    Precio: S/ {product.price?.toFixed(2)}
                </p>

                <button 
                    onClick={() => {
                        addToCart(product);
                        onClose();
                    }}
                    className="w-full bg-cartaai-red hover:bg-cartaai-red/80 text-white py-3 px-4 rounded-xl transition-colors duration-300"
                >
                    Añadir al carrito
                </button>
            </div>
        </div>
    );
};

export default FoodModal;