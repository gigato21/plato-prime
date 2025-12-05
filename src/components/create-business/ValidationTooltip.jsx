import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";

const ValidationTooltip = ({ children, field, errors }) => {
  const error = errors?.[field];

  return error ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center">
          {children}
          <AlertCircle className="h-4 w-4 ml-1 text-red-500" />
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-red-500 text-white">
        <p>{error.message}</p>
      </TooltipContent>
    </Tooltip>
  ) : children;
};

export default ValidationTooltip;