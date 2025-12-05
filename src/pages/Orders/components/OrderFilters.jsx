
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, CalendarRange } from 'lucide-react';
import { format, startOfToday, addDays } from "date-fns";
import { es } from "date-fns/locale";
import MultiSelectFilter from '@/components/token-monitor/MultiSelectFilter';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const OrderFilters = ({ filters, onFiltersChange, isFullscreen }) => {
  const statusOptions = [
    { value: 'Aceptado', label: 'Aceptado' },
    { value: 'En cocina', label: 'En cocina' },
    { value: 'En camino', label: 'En camino' },
    { value: 'Entregado', label: 'Entregado' },
  ];

  const today = startOfToday();
  const defaultFilters = {
    startDate: today,
    endDate: today,
    status: []
  };

  const mergedFilters = { ...defaultFilters, ...filters };
  const [isRangeMode, setIsRangeMode] = useState(false);

  const handleDateSelect = (selected) => {
    if (isRangeMode) {
      // Range mode - use the date range selection
      onFiltersChange({
        ...mergedFilters,
        startDate: selected?.from,
        endDate: selected?.to,
      });
    } else {
      // Single day mode - use the same date for visual display but set endDate to next day internally
      // This captures all events of the selected day
      onFiltersChange({
        ...mergedFilters,
        startDate: selected,
        endDate: selected ? addDays(selected, 1) : null,
      });
    }
  };

  const getFormattedDateText = () => {
    if (!mergedFilters.startDate) {
      return "Seleccionar fechas";
    }

    if (isRangeMode) {
      return mergedFilters.endDate 
        ? `${format(mergedFilters.startDate, "P", { locale: es })} - ${format(mergedFilters.endDate, "P", { locale: es })}`
        : format(mergedFilters.startDate, "P", { locale: es });
    } else {
      // For single day mode, only show the start date regardless of the internal end date
      return format(mergedFilters.startDate, "P", { locale: es });
    }
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {isRangeMode ? (
              <CalendarRange className="h-4 w-4" />
            ) : (
              <CalendarIcon className="h-4 w-4" />
            )}
            {getFormattedDateText()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`w-auto p-0 ${isFullscreen ? 'z-[99999]' : ''}`}>
          <div className="p-3 border-b flex items-center justify-end space-x-2">
            <Label htmlFor="range-mode" className="text-xs">Rango de fechas</Label>
            <Switch 
              id="range-mode" 
              checked={isRangeMode} 
              onCheckedChange={setIsRangeMode}
              className="data-[state=checked]:bg-cartaai-red"
            />
          </div>
          
          <Calendar
            initialFocus
            mode={isRangeMode ? "range" : "single"}
            selected={isRangeMode 
              ? { from: mergedFilters.startDate, to: mergedFilters.endDate }
              : mergedFilters.startDate
            }
            onSelect={handleDateSelect}
            locale={es}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      <div className={`w-[250px] ${isFullscreen ? 'z-[99999]' : ''}`}>
        <MultiSelectFilter
          selected={mergedFilters.status}
          options={statusOptions}
          onSelect={(value) => {
            const newStatus = mergedFilters.status.includes(value)
              ? mergedFilters.status.filter((s) => s !== value)
              : [...mergedFilters.status, value];
            onFiltersChange({ ...mergedFilters, status: newStatus });
          }}
          placeholder="Filtrar por estado"
          isFullscreen={isFullscreen}
        />
      </div>

      <Button
        onClick={() => onFiltersChange({ startDate: null, endDate: null, status: [] })}
        variant="ghost"
        className="glass-button bg-[#121212]/50 hover:bg-[#121212]/70 border-white/10 text-red-400 hover:text-red-300"
      >
        Limpiar filtros
      </Button>
    </div>
  );
};

export default OrderFilters;
