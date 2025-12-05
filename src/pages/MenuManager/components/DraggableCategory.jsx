import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { toast } from "sonner";

const DraggableCategory = ({ 
  category, 
  index,
  onEditCategory, 
  onDeleteCategory, 
  onStatusToggle,
  onDragStart,
  onDragOver,
  onDrop 
}) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', index.toString());
    onDragStart(index);
  };

  const handleEditClick = () => {
    const newName = prompt("Ingrese el nuevo nombre de la categoría", category.name);
    if (newName && newName !== category.name) {
      onEditCategory(category, { name: newName });
    }
  };

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(index);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`glass-container p-4 rounded-lg transition-all duration-300 dark:hover:bg-white/20 hover:bg-gray-500/20 group border-2 cursor-grab
        ${category.status === 1 ? 'border-green-500/80 dark:border-green-500/30' : 'border-red-500/80 dark:border-red-500/30'}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-cartaai-white">
          {category.name}
        </span>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleEditClick}
            className="text-cartaai-white hover:text-cartaai-red hover:bg-white/10"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDeleteCategory(category.id)}
            className="text-red-500 hover:text-red-700 hover:bg-white/10"
          >
            <Trash className="w-4 h-4" />
          </Button>
          <Switch
            checked={category.status === 1}
            onCheckedChange={() => onStatusToggle(category)}
            className="text-cartaai-white"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DraggableCategory;