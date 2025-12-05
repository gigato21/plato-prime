import { useMemo, useState } from 'react';
import CategorySection from './CategorySection';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GridLayout = ({ 
  categories, 
  categorizedItems, 
  columns, 
  theme, 
  font,
  size,
  spacing 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sectionColors, setSectionColors] = useState({});
  const [sectionOpacities, setSectionOpacities] = useState({});
  const [sectionGlass, setSectionGlass] = useState({});
  const [sectionFonts, setSectionFonts] = useState({});
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const fonts = {
    'japanese': 'Playfair Display',
    'italian': 'Dancing Script',
    'western': 'Oswald',
    'nautical': 'Roboto Slab',
    'fiesta': 'Dancing Script',
    'nature': 'Merriweather'
  };

  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${spacing * 0.25}rem`,
  }), [columns, spacing]);

  const handleSectionClick = (category) => {
    setSelectedCategory(category);
    setIsColorPickerOpen(true);
  };

  const handleColorChange = (color) => {
    if (selectedCategory) {
      setSectionColors(prev => ({
        ...prev,
        [selectedCategory]: color
      }));
    }
  };

  const handleOpacityChange = (value) => {
    if (selectedCategory) {
      setSectionOpacities(prev => ({
        ...prev,
        [selectedCategory]: value
      }));
    }
  };

  const handleGlassChange = (checked) => {
    if (selectedCategory) {
      setSectionGlass(prev => ({
        ...prev,
        [selectedCategory]: checked
      }));
    }
  };

  const handleFontChange = (value) => {
    if (selectedCategory) {
      setSectionFonts(prev => ({
        ...prev,
        [selectedCategory]: value
      }));
    }
  };

  const getBackgroundColor = (category) => {
    if (sectionColors[category]) {
      return sectionColors[category];
    }
    return theme.sectionColors?.[category] || theme.containerBg;
  };

  const getOpacity = (category) => {
    return sectionOpacities[category] !== undefined ? sectionOpacities[category] : 100;
  };

  const hasGlass = (category) => {
    return sectionGlass[category] || false;
  };

  const getFont = (category) => {
    return sectionFonts[category] || font;
  };

  return (
    <>
      <div style={gridStyle}>
        {categories.map((category) => (
          <div key={category}>
            <CategorySection
              category={category}
              items={categorizedItems[category]}
              theme={theme}
              fontFamily={fonts[getFont(category)]}
              size={size}
              backgroundColor={getBackgroundColor(category)}
              opacity={getOpacity(category)}
              hasGlass={hasGlass(category)}
              onSectionClick={handleSectionClick}
            />
          </div>
        ))}
      </div>

      <Dialog open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Personalizar sección - {selectedCategory}</DialogTitle>
            <DialogDescription>
              Ajusta el color, la opacidad, la fuente y el efecto glass del fondo de esta sección
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="backgroundColor" className="text-right">
                Color
              </Label>
              <Input
                id="backgroundColor"
                type="color"
                className="col-span-3 h-10"
                value={sectionColors[selectedCategory] || getBackgroundColor(selectedCategory)}
                onChange={(e) => handleColorChange(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Opacidad
              </Label>
              <div className="col-span-3">
                <Slider
                  value={[getOpacity(selectedCategory)]}
                  onValueChange={([value]) => handleOpacityChange(value)}
                  min={0}
                  max={100}
                  step={1}
                  className="my-4"
                />
                <span className="text-sm text-muted-foreground">
                  {getOpacity(selectedCategory)}%
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Fuente
              </Label>
              <div className="col-span-3">
                <Select 
                  value={getFont(selectedCategory)} 
                  onValueChange={handleFontChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una fuente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="japanese">Japonés</SelectItem>
                    <SelectItem value="italian">Italiano</SelectItem>
                    <SelectItem value="western">Western</SelectItem>
                    <SelectItem value="nautical">Náutico</SelectItem>
                    <SelectItem value="fiesta">Fiesta</SelectItem>
                    <SelectItem value="nature">Naturaleza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Efecto Glass
              </Label>
              <div className="col-span-3">
                <Switch
                  checked={hasGlass(selectedCategory)}
                  onCheckedChange={handleGlassChange}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GridLayout;