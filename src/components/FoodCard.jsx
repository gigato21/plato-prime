const FoodCard = ({ image, title, description, price, onClick }) => {
  const maxDescriptionLength = "Pizza con salsa de tomate, mozzarella".length;
  const placeholderImage = "https://new.foodservicerewards.com/cdn/shop/t/262/assets/fsr-placeholder.png?v=45093109498714503231652397781";

  const truncatedDescription = description?.length > maxDescriptionLength 
    ? description.slice(0, maxDescriptionLength) + '...' 
    : description || '';

  const isValidImageUrl = (url) => {
    try {
      return url && (url.startsWith('http://') || url.startsWith('https://'));
    } catch {
      return false;
    }
  };

  const imageUrl = isValidImageUrl(image) ? image : placeholderImage;

  return (
    <div onClick={onClick}
      className="food-card flex items-center p-4 glass-container transition-shadow duration-300 hover:shadow-xl cursor-pointer group max-w-[600px] min-w-[200px] border border-white/10"
    >
      <div className="content flex-1">
        <h6 className="text-sm font-bold group-hover:text-cartaai-red text-cartaai-white">{title}</h6>
        {truncatedDescription && (
          <p className="text-sm text-cartaai-white/70 mb-4 text-xs font-normal">
            {truncatedDescription}
          </p>
        )}
        <span className="text-cartaai-white">S/{price}</span>
      </div>
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-24 h-24 object-cover ml-2 rounded-lg"
      />
    </div>
  );
};

export default FoodCard;