import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import TimeInput from '../TimeInput';
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export const DaySchedule = ({ day, times, onToggleDay, onTimeChange, disabled, onAnticipationChange }) => {
  const handleToggle = () => {
    onToggleDay(day);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-4 mb-2 hover:bg-cartaai-white/5 p-2 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`day-${day}`}
          checked={times.enabled}
          onCheckedChange={handleToggle}
          className="h-5 w-5 rounded border-2 border-cartaai-white/30 
                   data-[state=checked]:bg-cartaai-red data-[state=checked]:border-cartaai-red
                   focus:ring-cartaai-red focus:ring-offset-0
                   transition-all duration-200 ease-in-out
                   hover:border-cartaai-red/70"
        />
        <Label
          htmlFor={`day-${day}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
                   peer-disabled:opacity-70 text-cartaai-white w-24 cursor-pointer
                   select-none"
        >
          {day}
        </Label>
      </div>
      <motion.div 
        animate={{ 
          opacity: times.enabled ? 1 : 0.5,
          scale: times.enabled ? 1 : 0.98
        }}
        className="flex items-center space-x-2"
      >
        <TimeInput
          value={times.start}
          onChange={(value) => onTimeChange(day, 'start', value)}
          disabled={disabled || !times.enabled}
        />
        <span className="text-cartaai-white">-</span>
        <TimeInput
          value={times.end}
          onChange={(value) => onTimeChange(day, 'end', value)}
          disabled={disabled || !times.enabled}
        />
        <Input
          type="number"
          placeholder="Horas de anticipación"
          value={times.anticipation || ''}
          onChange={(e) => onAnticipationChange(day, e.target.value)}
          className="w-32 bg-transparent border-cartaai-white/10 text-cartaai-white 
                   transition-all focus:ring-cartaai-red/50"
          disabled={disabled || !times.enabled}
        />
      </motion.div>
    </motion.div>
  );
};