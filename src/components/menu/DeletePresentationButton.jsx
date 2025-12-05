import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

const DeletePresentationButton = ({ onDelete }) => {
  return (
    <Button
      onClick={onDelete}
      variant="ghost"
      size="icon"
      className="h-8 w-8 p-0 text-cartaai-red hover:text-cartaai-red/80 hover:bg-cartaai-red/10"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};

export default DeletePresentationButton;