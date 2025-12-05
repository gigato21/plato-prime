import React from 'react';
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Steps = ({ steps, currentStep, className }) => {
  return (
    <div className={cn("flex justify-between", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div className="flex-1 h-[2px] bg-cartaai-white/10" />
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2",
                  isCompleted ? "bg-cartaai-red border-cartaai-red" : 
                  isCurrent ? "border-cartaai-red" : "border-cartaai-white/10",
                  "text-sm font-medium"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-white" />
                ) : (
                  <span className={cn(
                    "text-cartaai-white",
                    isCurrent && "text-cartaai-red"
                  )}>
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 h-[2px] bg-cartaai-white/10" />
            </div>
            <div className="mt-2 text-center">
              <div className={cn(
                "text-sm font-medium",
                isCurrent ? "text-cartaai-red" : "text-cartaai-white"
              )}>
                {step.title}
              </div>
              <div className="text-xs text-cartaai-white/70">
                {step.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};