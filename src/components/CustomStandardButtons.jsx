import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Check, X } from 'lucide-react';

export const EditButton = ({ onClick }) => (
  <Button onClick={onClick} variant="ghost" size="icon" className="h-8 w-8 p-0">
    <Pencil className="h-4 w-4" />
  </Button>
);

export const DeleteButton = ({ onClick }) => (
  <Button onClick={onClick} variant="ghost" size="icon" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
    <Trash className="h-4 w-4" />
  </Button>
);

export const ToggleStatusButton = ({ isActive, onClick }) => (
  <Button 
    onClick={onClick} 
    variant="ghost" 
    size="icon" 
    className={`h-8 w-8 p-0 ${isActive ? 'text-green-500 hover:text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
  >
    {isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
  </Button>
);

export const AutoChangeButton = ({ isActive, onClick }) => (
  <Button
    onClick={onClick}
    className={`px-4 py-2 rounded ${
      isActive
        ? 'bg-green-500 hover:bg-green-600 text-white'
        : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
    }`}
  >
    {isActive ? 'Auto ON' : 'Auto OFF'}
  </Button>
);