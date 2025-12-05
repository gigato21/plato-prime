import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ThemeSelector = ({ selectedTheme, setSelectedTheme }) => {
  const handleThemeChange = (value) => {
    setSelectedTheme(value);
  };

  return (
    <div className="space-y-6 bg-cartaai-black/50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-cartaai-white border-b border-cartaai-white/10 pb-2">Seleccionador de temas</h2>
      
      <div className="space-y-4">
        <Label htmlFor="theme-select" className="text-cartaai-white">Select your menu template</Label>
        <Select value={selectedTheme} onValueChange={handleThemeChange}>
          <SelectTrigger id="theme-select" className="bg-cartaai-white/10 text-cartaai-white">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent className="bg-cartaai-black text-cartaai-white">
            <SelectItem value="Luxe template">Luxe template</SelectItem>
            <SelectItem value="Modern template">Modern template</SelectItem>
            <SelectItem value="Classic template">Classic template</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ThemeSelector;