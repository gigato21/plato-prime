import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ThemeSwitcher = ({ currentTheme, onThemeChange, onRandomizeGrid }) => {
  return (
    <div className="flex items-center gap-4">
      <Select value={currentTheme} onValueChange={onThemeChange}>
        <SelectTrigger className="w-[180px] bg-white/10 text-white border-white/20">
          <SelectValue placeholder="Selecciona un tema" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sushi">Sushi</SelectItem>
          <SelectItem value="pizzeria">Pizzeria</SelectItem>
          <SelectItem value="steakhouse">Steakhouse</SelectItem>
          <SelectItem value="seafood">Seafood</SelectItem>
          <SelectItem value="mexican">Mexican</SelectItem>
          <SelectItem value="vegan">Vegan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSwitcher;