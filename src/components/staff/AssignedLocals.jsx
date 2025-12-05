import React from 'react';
import { Trash2, Edit2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import CustomSelect from '@/components/ui/CustomSelect';
import { motion } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";

const AssignedLocals = ({ 
  assignedLocals, 
  onDelete, 
  onUpdate,
  locals,
  isLoading 
}) => {
  const [editingLocal, setEditingLocal] = React.useState(null);
  const [selectedNewLocal, setSelectedNewLocal] = React.useState(null);

  const handleUpdate = async () => {
    if (!selectedNewLocal || !editingLocal) return;
    
    await onUpdate(editingLocal._id, {
      name: selectedNewLocal.localDescripcion,
      localId: selectedNewLocal.localId,
      subDomain: selectedNewLocal.subdominio
    });
    
    setEditingLocal(null);
    setSelectedNewLocal(null);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-cartaai-white flex items-center gap-2 sticky top-0 py-2">
        <Building2 className="w-4 h-4" />
        Locales Asignados
      </h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {assignedLocals.map(local => (
            <motion.div 
              key={local._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-cartaai-white/5 border border-cartaai-white/10"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-cartaai-white truncate">{local.name}</p>
                <p className="text-xs text-cartaai-white/70 truncate">ID: {local.localId}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors duration-300"
                  onClick={() => setEditingLocal(local)}
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-cartaai-black border-cartaai-white/10">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-cartaai-white">¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription className="text-cartaai-white/70">
                        Esta acción eliminará el local asignado al usuario. Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(local._id)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={!!editingLocal} onOpenChange={() => setEditingLocal(null)}>
        <DialogContent className="bg-cartaai-black border-cartaai-white/10">
          <DialogHeader>
            <DialogTitle className="text-cartaai-white">Actualizar Local</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <CustomSelect 
              options={locals.map(local => ({ 
                value: local.localId, 
                label: local.localDescripcion 
              }))} 
              onChange={(e) => setSelectedNewLocal(
                locals.find(local => local.localId === e.target.value)
              )} 
              value={selectedNewLocal?.localId || ''} 
            />
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setEditingLocal(null)} 
              variant="outline"
              className="bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={isLoading || !selectedNewLocal}
              className="bg-cartaai-red hover:bg-cartaai-red/80 text-white"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignedLocals;