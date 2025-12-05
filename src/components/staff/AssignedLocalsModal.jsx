import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import AssignedLocals from './AssignedLocals';

const AssignedLocalsModal = ({ 
  isOpen, 
  onClose, 
  assignedLocals, 
  onDelete, 
  onUpdate, 
  locals, 
  isLoading 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">
            Locales Asignados ({assignedLocals.length})
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <AssignedLocals 
            assignedLocals={assignedLocals}
            onDelete={onDelete}
            onUpdate={onUpdate}
            locals={locals}
            isLoading={isLoading}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AssignedLocalsModal;