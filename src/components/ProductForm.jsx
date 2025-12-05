import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductPresentations from './ProductPresentations';
import ProductModifiers from './ProductModifiers';

const ProductForm = ({ 
  product, 
  categories, 
  modifiers,
  onInputChange, 
  onCategoryChange, 
  onPresentationChange, 
  onAddPresentation,
  onModifierToggle,
  onModifierItemToggle,
  onCategorySelect
}) => {
  const [availableModifiers, setAvailableModifiers] = useState([]);

  useEffect(() => {
    if (product.category) {
      const selectedCategory = categories.find(cat => cat.name === product.category);
      if (selectedCategory) {
        const categoryModifiers = modifiers.filter(mod => selectedCategory.modifiers.includes(mod.id));
        setAvailableModifiers(categoryModifiers);
      }
    }
  }, [product.category, categories, modifiers]);

  const handleDeletePresentation = (index) => {
    const newPresentations = [...product.presentations];
    newPresentations.splice(index, 1);
    onInputChange({ target: { name: 'presentations', value: newPresentations } });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-cartaai-white">Nombre del Producto</Label>
        <Input
          id="name"
          name="name"
          value={product.name}
          onChange={onInputChange}
          className="glass-container text-gray-500"
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-cartaai-white">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={product.description}
          onChange={onInputChange}
          className="glass-container text-gray-500"
        />
      </div>
      <div>
        <Label htmlFor="category" className="text-cartaai-white">Categoría</Label>
        <Select onValueChange={onCategoryChange} value={product.category}>
          <SelectTrigger className="bg-cartaai-white/10 text-gray-500">
            <SelectValue placeholder="Selecciona una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ProductPresentations
        presentations={product.presentations}
        onPresentationChange={onPresentationChange}
        onAddPresentation={onAddPresentation}
        onDeletePresentation={handleDeletePresentation}
      />
      <ProductModifiers
        productModifiers={product.modifiers}
        allModifiers={availableModifiers}
        onModifierToggle={onModifierToggle}
        onModifierItemToggle={onModifierItemToggle}
        categories={categories.map(c => c.name)}
        onCategorySelect={onCategorySelect}
      />
    </div>
  );
};

export default ProductForm;