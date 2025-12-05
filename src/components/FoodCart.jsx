import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const FoodCart = ({ cartItems, onRemoveFromCart, onOpenOrderSummary }) => {
  return (
    <div className="food-cart-container mb-5 glass-container rounded-lg p-4">
      <h2 className="text-lg font-bold flex items-center text-gray-700 dark:text-gray-200">
        <ShoppingCartIcon className="h-6 w-6 mr-2 text-gray-500 dark:text-gray-400" />
        Carrito
      </h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No hay productos en el carrito.</p>
      ) : (
        <ul className="space-y-2 my-4">
          {cartItems.map((item, index) => (
            <li key={index} className="flex justify-between items-center text-gray-700 dark:text-gray-300">
              <span>{item.title}</span>
              <div className="flex items-center gap-3">
                <span>${item.price.toFixed(2)}</span>
                <button 
                  onClick={() => onRemoveFromCart(item)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button 
        onClick={onOpenOrderSummary} 
        className="w-full mt-4 bg-cartaai-red text-white p-2 rounded-lg hover:bg-cartaai-red/80 transition-colors"
      >
        Ver Resumen del Pedido
      </button>
    </div>
  );
};

export default FoodCart;