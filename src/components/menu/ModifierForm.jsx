import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const ModifierForm = ({ onSubmit, initialData = {}, options = [], isLoading }) => {
  
  // if (!initialData?.options) {
  //   console.warn('initialData.options is undefined');
  //   initialData.options = [];
  // }

  const optionMatched = options.filter(option => {
    if (!option?.rId) {
      console.warn('Option without rId:', option);
      return false;
    }
    return initialData?.options?.includes(option.rId)
  });
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      name: initialData?.name || '',
      isMultiple: initialData?.isMultiple || false,
      minQuantity: initialData?.minQuantity || 0,
      maxQuantity: initialData?.maxQuantity || 1,
      options: optionMatched.map(opt => opt._id) || []
    }
  });

  const isMultiple = watch('isMultiple');

  const handleOptionChange = (checked, optionId) => {
    const currentOptions = watch('options') || [];
    let newOptions;
    
    if (checked) {
      newOptions = [...currentOptions, optionId];
    } else {
      newOptions = currentOptions.filter(id => id !== optionId);
    }
    
    setValue('options', newOptions);
  };

  const onSubmitForm = (data) => {

    const formattedData = {
      ...data,
      minQuantity: Number(data.minQuantity),
      maxQuantity: Number(data.maxQuantity),
      options: (Array.isArray(data.options) ? data.options : []).map(optionId => {

        const option = options.find(opt => opt._id === optionId);
        if (!option) {
          console.warn(`Option with ID ${optionId} not found`);
          return null;
        }
        return {
          optionId: option.rId,
          name: option.name,
          price: option.price,
          stock: option.stock || -1
        };
      }).filter(Boolean) // Remove any null values
    };
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Modificador</Label>
        <Input
          id="name"
          {...register('name', { required: 'El nombre es requerido' })}
          className="glass-input text-gray-700 dark:text-gray-300"
        />
        {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isMultiple"
          checked={watch('isMultiple')}
          onCheckedChange={(checked) => setValue('isMultiple', checked)}
        />
        <Label htmlFor="isMultiple">Permitir selección múltiple</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minQuantity">Cantidad Mínima</Label>
          <Input
            id="minQuantity"
            type="number"
            {...register('minQuantity', { min: 0 })}
            className="glass-input text-gray-700 dark:text-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="maxQuantity">Cantidad Máxima</Label>
          <Input
            id="maxQuantity"
            type="number"
            {...register('maxQuantity', { min: isMultiple ? 1 : 0 })}
            className="glass-input text-gray-700 dark:text-gray-300"
          />
        </div>
      </div>

      <div>
        <Label>Opciones Disponibles</Label>
        <ScrollArea className="h-[200px] w-full border rounded-md p-4">
          {options.map((option) => {
            const currentOptions = watch('options') || [];
            const isChecked = currentOptions.includes(option._id);
            
            return (
              <div key={option._id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={option._id}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleOptionChange(checked, option._id)}
                />
                <Label htmlFor={option._id} className="cursor-pointer">
                  {option.name} - S/ {option.price.toFixed(2)}
                </Label>
              </div>
            );
          })}
        </ScrollArea>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-cartaai-red hover:bg-cartaai-red/80 text-gray-700 dark:text-gray-300"
        disabled={isLoading}
      >
        {isLoading ? 'Guardando...' : 'Guardar Modificador'}
      </Button>
    </form>
  );
};

export default ModifierForm;