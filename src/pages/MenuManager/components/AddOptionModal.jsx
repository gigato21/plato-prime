
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import SelectLocalsModal from "./SelectLocalsModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getApiUrls } from "@/config/api";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../components/ui/use-toast";

const AddOptionModal = ({ isOpen, onClose, onAddOption, setIsAddModalOpen  }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
    const API_URLS = getApiUrls();
  const [isSelectLocalsModalOpen, setIsSelectLocalsModalOpen] = useState(false);
  const [constDataToPost, setConstDataToPost] = useState({
    name: "",
    price: null,
    stock: null,
    localsId: []
  });
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector((state) => state.auth.localId);
  const accessToken = useSelector(state => state.auth.accessToken);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  useEffect(() => {
    console.log(constDataToPost);
  }, [constDataToPost]);

  const onSubmit = (data) => {
    onAddOption(localId !== "-1" ?{
      name: data.name,
      price: parseFloat(data.price),
      stock: data.stock ? parseInt(data.stock) : null
    }: {
      name: data.name,
      price: parseFloat(data.price),
      stock: data.stock ? parseInt(data.stock) : null,
      localsId: data.localslId || []
    });
    reset();
  };

  const handleLocalsSelected = async (selectedLocals) => {
    setIsAddModalOpen(false);
    const url = `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/opciones/create-multiple-local/${subDomain}`
    const body = JSON.stringify({
      ...constDataToPost,
      stock: constDataToPost.stock !== "" ? +constDataToPost.stock : null,
      price: +constDataToPost.price,
      localsId: selectedLocals,
      rId: `OPC${Date.now()}`,
      source: "0"
    })
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body
      });
      if (!response.ok) throw new Error('Error al crear la opción');
      queryClient.invalidateQueries(['options', subDomain, localId]);
      toast({
        title: "Éxito",
        description: "Opción creada correctamente",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la opción",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-gray-700 dark:text-gray-200">Agregar nueva opción</DialogTitle>
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
            <Button type="button" onClick={onClose} className="glass-input text-gray-700 dark:text-gray-300 hover:bg-cartaai-white/20">
              Cancelar
            </Button>

              {
                localId === "-1" ?
                <Button onClick={() =>{
                  setIsSelectLocalsModalOpen(true)
                  setConstDataToPost({
                    ...watch()
                  })
                }
                } className="bg-cartaai-red hover:bg-cartaai-red/80 text-gray-700 dark:text-gray-300">
                  Agregar
                </Button>
                : 
                <Button type="submit" className="bg-cartaai-red hover:bg-cartaai-red/80 text-gray-700 dark:text-gray-300">
                  Agregar
                </Button>
              }
            <SelectLocalsModal
        isOpen={isSelectLocalsModalOpen}
        onClose={() => setIsSelectLocalsModalOpen(false)}
        onConfirm={handleLocalsSelected}
        title="Seleccionar locales para actualizar el producto"
      />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOptionModal;