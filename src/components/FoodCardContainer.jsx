import FoodCard from "./FoodCard";


const FoodCardContainer = ({ fastFoodItems, category, onFoodCardClick }) => {
  return (
    <div className="food-card-container p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">{category}</h1>
      <span style={{ display: 'block', height: '1px', backgroundColor: '#EDEDED', margin: '10px 0 20px 0' }}></span>
      <div className={`grid ${fastFoodItems.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-1 md:grid-cols-2'} gap-4`}>
        {fastFoodItems.map((item, index) => (
          <FoodCard 
            key={index} 
            image={item.image} 
            title={item.title} 
            description={item.description} 
            price={item.price}
            onClick={() => onFoodCardClick(item)} 
          />
        ))}
      </div>
    </div>
  );
};

export default FoodCardContainer;
