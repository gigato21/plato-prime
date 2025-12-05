import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CategoryPositionSelector = ({ currentPosition, totalCategories, onPositionChange }) => {
  return (
    <Select onValueChange={onPositionChange} defaultValue={currentPosition}>
      <SelectTrigger className="w-[60px] bg-cartaai-black text-cartaai-white border-cartaai-white/10">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-cartaai-black border-cartaai-white/10">
        {Array.from({ length: totalCategories }, (_, i) => i + 1).map((position) => (
          <SelectItem 
            key={position} 
            value={position.toString()} 
            className="text-cartaai-white hover:bg-cartaai-white/10 transition-colors"
          >
            {position}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategoryPositionSelector;