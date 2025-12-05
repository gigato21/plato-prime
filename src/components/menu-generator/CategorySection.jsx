const CategorySection = ({ 
  category, 
  items, 
  theme, 
  fontFamily, 
  size, 
  backgroundColor, 
  opacity = 100,
  hasGlass = false,
  onSectionClick 
}) => {
  const sizeStyles = {
    small: {
      fontSize: '0.875rem',
      headerFontSize: '1.5rem',
      padding: '1rem',
    },
    medium: {
      fontSize: '1rem',
      headerFontSize: '2rem',
      padding: '1.5rem',
    },
    large: {
      fontSize: '1.125rem',
      headerFontSize: '2.5rem',
      padding: '2rem',
    },
  };

  const fontFamilyStyle = {
    fontFamily: `${fontFamily}, sans-serif`
  };

  const getBackgroundWithOpacity = () => {
    if (!backgroundColor) return 'transparent';
    
    // If it's a hex color, convert to rgba
    if (backgroundColor.startsWith('#')) {
      const r = parseInt(backgroundColor.slice(1, 3), 16);
      const g = parseInt(backgroundColor.slice(3, 5), 16);
      const b = parseInt(backgroundColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    }
    
    // If it's already rgba/rgb, handle accordingly
    if (backgroundColor.startsWith('rgba')) {
      return backgroundColor.replace(/[\d.]+\)$/g, `${opacity / 100})`);
    }
    if (backgroundColor.startsWith('rgb')) {
      return backgroundColor.replace('rgb', 'rgba').replace(')', `, ${opacity / 100})`);
    }
    
    return backgroundColor;
  };

  const glassStyle = hasGlass ? {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  } : {};

  return (
    <section
      onClick={() => onSectionClick(category)}
      className="category-section cursor-pointer transition-colors duration-200"
      style={{
        padding: sizeStyles[size].padding,
        borderRadius: '8px',
        marginBottom: '20px',
        minHeight: '150px',
        backgroundColor: getBackgroundWithOpacity(),
        ...glassStyle,
        ...fontFamilyStyle
      }}
    >
      <h2
        className="font-bold mb-6 pb-2"
        style={{
          color: theme.titleColor,
          borderBottom: `2px solid ${theme.titleColor}`,
          fontSize: sizeStyles[size].headerFontSize,
          ...fontFamilyStyle
        }}
      >
        {category}
      </h2>
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="menu-item flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-baseline gap-4">
                <h3
                  className="font-semibold"
                  style={{ 
                    color: theme.textColor, 
                    fontSize: sizeStyles[size].fontSize,
                    ...fontFamilyStyle
                  }}
                >
                  {item.name}
                  {item.popular && (
                    <span
                      className="ml-2 text-sm"
                      style={{ color: theme.popularColor }}
                    >
                      <span className="star">★</span> Popular
                    </span>
                  )}
                </h3>
                <div 
                  className="border-b border-dotted flex-1 mx-2" 
                  style={{ borderColor: `${theme.textColor}30` }}
                />
                <span
                  className="font-bold"
                  style={{ 
                    color: theme.priceColor,
                    fontSize: sizeStyles[size].fontSize,
                    ...fontFamilyStyle
                  }}
                >
                  ${item.price.toFixed(2)}
                </span>
              </div>
              <p 
                style={{ 
                  color: `${theme.textColor}B3`,
                  fontSize: sizeStyles[size].fontSize,
                  ...fontFamilyStyle
                }}
                className="mt-1"
              >
                {item.description}
              </p>
              {item.allergens && item.allergens.length > 0 && (
                <p 
                  style={{ 
                    color: `${theme.textColor}80`,
                    fontSize: `${parseFloat(sizeStyles[size].fontSize) * 0.875}rem`,
                    ...fontFamilyStyle
                  }}
                  className="text-xs mt-1"
                >
                  Allergens: {item.allergens.join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;