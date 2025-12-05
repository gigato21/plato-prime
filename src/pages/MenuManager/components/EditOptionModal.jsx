import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

const EditOptionModal = ({ isOpen, onClose, option, onEditOption }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (option) {
      reset({
        name: option.name,
        price: option.price,
        stock: option.stock || ''
      });
    }
  }, [option, reset]);

  const onSubmit = (data) => {
    if (option) {
      onEditOption(option._id, {
        name: data.name,
        price: parseFloat(data.price),
        stock: data.stock ? parseInt(data.stock) : null,
        rId: option.rId
      });
    }
  };

  if (!option) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-gray-700 dark:text-gray-200">Editar opción</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">Nombre</Label>
            <Input
              id="name"
              className="glass-input text-gray-700 dark:text-gray-300"
              {...register("name", { required: "El nombre es requerido" })}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="price" className="text-gray-700 dark:text-gray-200">Precio</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              className="glass-input text-gray-700 dark:text-gray-300"
              {...register("price", { 
                required: "El precio es requerido",
                min: { value: 0, message: "El precio debe ser mayor a 0" }
              })}
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <Label htmlFor="stock" className="text-gray-700 dark:text-gray-200">Stock (opcional)</Label>
            <Input
              id="stock"
              type="number"
              className="glass-input text-gray-700 dark:text-gray-300"
              {...register("stock", {
                min: { value: 0, message: "El stock no puede ser negativo" }
              })}
            />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" onClick={onClose} className="bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20">
              Cancelar
            </Button>
            <Button type="submit" className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOptionModal;