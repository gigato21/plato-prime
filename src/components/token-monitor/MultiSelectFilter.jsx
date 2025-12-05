import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const MultiSelectFilter = ({ 
  selected, 
  options, 
  onSelect, 
  placeholder,
  isFullscreen 
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal bg-background bg-cartaai-black border-cartaai-white/10"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((value) => (
                <Badge key={value} variant="secondary">
                  {options.find(opt => opt.value === value)?.label || value}
                </Badge>
              ))}
            </div>
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-full p-0 ${isFullscreen ? 'z-[99999]' : ''}`} align="start">
        <ScrollArea className="h-[200px] p-2">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-center space-x-2 p-2 cursor-pointer hover:bg-accent rounded",
                selected.includes(option.value) && "bg-accent"
              )}
              onClick={() => onSelect(option.value)}
            >
              <span>{option.label}</span>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectFilter;