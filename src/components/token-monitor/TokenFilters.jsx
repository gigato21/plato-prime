import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import MultiSelectFilter from "./MultiSelectFilter";
import { useTokenData } from "@/hooks/useTokenData";
import { cn } from "@/lib/utils";

const TokenFilters = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [date, setDate] = useState({
    from: filters.startDate,
    to: filters.endDate,
  });
  const [selectedSubdomains, setSelectedSubdomains] = useState(
    filters.subdomain ? filters.subdomain.split(',') : []
  );
  const [selectedLocalIds, setSelectedLocalIds] = useState(
    filters.localId ? filters.localId.split(',') : []
  );

  const { availableSubdomains, availableLocalIds } = useTokenData();

  const handleChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleMultiSelect = (field, value) => {
    let updatedValues;
    if (field === 'subdomain') {
      updatedValues = selectedSubdomains.includes(value)
        ? selectedSubdomains.filter(item => item !== value)
        : [...selectedSubdomains, value];
      setSelectedSubdomains(updatedValues);
    } else if (field === 'localId') {
      updatedValues = selectedLocalIds.includes(value)
        ? selectedLocalIds.filter(item => item !== value)
        : [...selectedLocalIds, value];
      setSelectedLocalIds(updatedValues);
    }
    
    handleChange(field, updatedValues.join(','));
  };

  const handleDateRangeChange = (range) => {
    setDate(range);
    setLocalFilters({
      ...localFilters,
      startDate: range?.from || null,
      endDate: range?.to || null,
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      subdomain: "",
      localId: "",
      startDate: null,
      endDate: null,
      status: "all",
      conversationState: "all"
    };
    setDate({ from: null, to: null });
    setSelectedSubdomains([]);
    setSelectedLocalIds([]);
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
        <MultiSelectFilter
          selected={selectedSubdomains}
          options={availableSubdomains}
          onSelect={(value) => handleMultiSelect('subdomain', value)}
          placeholder="Seleccionar subdominios"
        />

        <MultiSelectFilter
          selected={selectedLocalIds}
          options={availableLocalIds}
          onSelect={(value) => handleMultiSelect('localId', value)}
          placeholder="Seleccionar Local IDs"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-background bg-cartaai-black border-cartaai-white/10",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "PPP")} - {format(date.to, "PPP")}
                  </>
                ) : (
                  format(date.from, "PPP")
                )
              ) : (
                <span>Seleccionar rango de fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Select
          value={localFilters.conversationState}
          onValueChange={(value) => handleChange("conversationState", value)}
        >
          <SelectTrigger className="bg-background bg-cartaai-black border-cartaai-white/10 text-foreground dark:text-foreground">
            <SelectValue placeholder="Estado de Conversación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="0">Completado</SelectItem>
            <SelectItem value="1">En Progreso</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2">
        <Button 
          onClick={handleClearFilters}
          variant="outline"
          className="border-input dark:border-input/20 text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent/10"
        >
          <X className="mr-2 h-4 w-4" />
          Limpiar Filtros
        </Button>
        <Button 
          onClick={handleApplyFilters}
          className="bg-cartaai-red hover:bg-cartaai-red/80"
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};

export default TokenFilters;