import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

const DatePickerModal = ({ selectedDate, onDateChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full min-w-[120px] max-w-[200px] justify-start text-left font-normal bg-cartaai-black border-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/5 hover:text-cartaai-red"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, 'PPP') : <span>Seleccionar fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-cartaai-black border-cartaai-white/10">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateChange}
          initialFocus
          className="text-cartaai-white"
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerModal;