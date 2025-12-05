import React from 'react';
import { Card } from "@/components/ui/card";
import GridLayout from './GridLayout';

const MenuPreview = ({ 
  menuRef, 
  opacity, 
  currentTheme, 
  categories, 
  categorizedItems, 
  columns, 
  size, 
  spacing,
  font,
  overlayColor,
  overlayOpacity
}) => {
  return (
    <Card 
      ref={menuRef} 
      className="max-w-[1290px] mx-auto p-8 relative overflow-hidden"
      style={{ 
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        backgroundImage: currentTheme.backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div 
        className="absolute inset-0" 
        style={{
          backgroundColor: overlayColor,
          opacity: overlayOpacity / 100,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      
      <div className="relative z-10">
        <header className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4 pt-12"
            style={{ color: currentTheme.titleColor }}
          >
            {currentTheme === 'sushi' ? 'SUSHI & MORE' : 
             currentTheme === 'pizzeria' ? 'AUTHENTIC PIZZERIA' : 
             currentTheme === 'seafood' ? 'OCEAN DELIGHTS' :
             currentTheme === 'mexican' ? 'SABORES MEXICANOS' :
             currentTheme === 'vegan' ? 'GREEN EARTH KITCHEN' :
             'PREMIUM STEAKHOUSE'}
          </h1>
        </header>

        <GridLayout
          categories={categories}
          categorizedItems={categorizedItems}
          columns={columns}
          theme={currentTheme}
          font={font}
          size={size}
          spacing={spacing}
        />
      </div>
    </Card>
  );
};

export default MenuPreview;