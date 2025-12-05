import React from 'react';
import { Switch } from "@/components/ui/switch";

const StatusToggle = ({ isActive, onToggle }) => {
  return (
    <Switch
      checked={isActive}
      onCheckedChange={onToggle}
      className={`${isActive ? 'bg-green-500' : 'bg-red-500'}`}
    />
  );
};

export default StatusToggle;