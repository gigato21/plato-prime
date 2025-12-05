import React, { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductModifiers = ({ productModifiers, allModifiers, onModifierToggle, onModifierItemToggle, categories, onCategorySelect }) => {
  const [expandedModifiers, setExpandedModifiers] = useState({});

  const toggleExpand = (modifierId) => {
    setExpandedModifiers(prev => ({
      ...prev,
      [modifierId]: !prev[modifierId]
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-cartaai-white">Modificadores</h3>
      {allModifiers.map((modifier) => (
        <div key={modifier.id} className="border border-cartaai-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor={`modifier-${modifier.id}`} className="text-cartaai-white">
              {modifier.name}
            </Label>
            <div className="flex items-center space-x-2">
              <Select
                onValueChange={(value) => onCategorySelect(modifier.id, value)}
                value={productModifiers.find(m => m.id === modifier.id)?.categories?.join(',')}
                multiple
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar categorías" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Switch
                id={`modifier-${modifier.id}`}
                checked={productModifiers.some(m => m.id === modifier.id)}
                onCheckedChange={() => onModifierToggle(modifier.id)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(modifier.id)}
                className="text-cartaai-white"
              >
                {expandedModifiers[modifier.id] ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>
          </div>
          {expandedModifiers[modifier.id] && (
            <div className="ml-4 space-y-2">
              {modifier.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <Label htmlFor={`item-${item.id}`} className="text-cartaai-white">
                    {item.name}
                  </Label>
                  <Switch
                    id={`item-${item.id}`}
                    checked={productModifiers.some(m => m.id === modifier.id && m.items.includes(item.id))}
                    onCheckedChange={() => onModifierItemToggle(modifier.id, item.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductModifiers;