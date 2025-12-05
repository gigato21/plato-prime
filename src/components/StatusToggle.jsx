
import React from 'react';
import { Switch } from "@/components/ui/switch";

const StatusToggle = ({ isActive, onToggle }) => {
  return (
    <Switch
      checked={isActive}
      onCheckedChange={onToggle}
      className={`${
        isActive 
          ? 'bg-green-500 hover:bg-green-600' 
          : 'bg-red-500 hover:bg-red-600'
      } transition-colors duration-200`}
      aria-label="Toggle estado del local"
    />
  );
};

export default StatusToggle;
