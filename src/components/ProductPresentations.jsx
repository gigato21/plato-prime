import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DeletePresentationButton from './menu/DeletePresentationButton';
import { DiscountType, PromotionType } from '@/types/presentation';


const ProductPresentations = ({ presentations = [], onPresentationChange, onAddPresentation, onDeletePresentation, onSavePresentations }) => {


  const handleInputChange = (index, field, value) => {
    const updatedPresentations = [...presentations];
    updatedPresentations[index] = {
      ...updatedPresentations[index],
      [field]: value
    };
    onPresentationChange(updatedPresentations);
  };

  const handleSavePresentation = (presentation) => {
    onSavePresentations(presentation);
  };

  const presentationsArray = Array.isArray(presentations) ? presentations : [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-cartaai-white">Presentaciones</h2>
      {presentationsArray.map((presentation, index) => (
        <div key={presentation.id || index} className="space-y-4 p-4 border border-cartaai-white/10 rounded-lg">
          <div className="flex justify-between items-center">
            <Label htmlFor={`name-${index}`} className="text-cartaai-white">Nombre</Label>
            <DeletePresentationButton onDelete={() => onDeletePresentation(index)} />
          </div>
          <Input
            id={`name-${index}`}
            value={presentation.name || ''}
            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            className="glass-container text-gray-500"
          />
          <div>
            <Label htmlFor={`price-${index}`} className="text-cartaai-white">Precio</Label>
            <Input
              id={`price-${index}`}
              type="number"
              value={presentation.price || ''}
              onChange={(e) => handleInputChange(index, 'price', e.target.value)}
              className="glass-container text-gray-500"
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor={`description-${index}`} className="text-cartaai-white">Descripción</Label>
            <Input
              id={`description-${index}`}
              value={presentation.description || ''}
              onChange={(e) => handleInputChange(index, 'description', e.target.value)}
              className="glass-container text-gray-500"
            />
          </div>
          <div>
            <Label htmlFor={`servingSize-${index}`} className="text-cartaai-white">Para cuantas personas</Label>
            <Input
              id={`servingSize-${index}`}
              type="number"
              value={presentation.servingSize || ''}
              onChange={(e) => handleInputChange(index, 'servingSize', e.target.value)}
              className="glass-container text-gray-500"
              step="1"
              min="0"
            />
          </div>

          {/* New fields */}
          <div>
            <Label htmlFor={`discountType-${index}`} className="text-cartaai-white">Tipo de Descuento</Label>
            <Select 
              value={presentation.discountType?.toString()} 
              onValueChange={(value) => handleInputChange(index, 'discountType', Number(value))}
            >
              <SelectTrigger className="glass-container text-gray-500">
                <SelectValue placeholder="Seleccione tipo de descuento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DiscountType.PERCENTAGE.toString()}>Porcentaje</SelectItem>
                <SelectItem value={DiscountType.FIXED.toString()}>Fijo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor={`discountValue-${index}`} className="text-cartaai-white">Valor del Descuento</Label>
            <Input
              id={`discountValue-${index}`}
              type="number"
              value={presentation.discountValue || ''}
              onChange={(e) => handleInputChange(index, 'discountValue', e.target.value)}
              className="glass-container text-gray-500"
              step="0.01"
              min="0"
            />
          </div>

          <div>
            <Label htmlFor={`amountWithDiscount-${index}`} className="text-cartaai-white">Precio con Descuento</Label>
            <Input
              id={`amountWithDiscount-${index}`}
              type="number"
              value={presentation.amountWithDiscount}
              className="glass-container text-gray-500 bg-gray-100"
              disabled
            />
          </div>

          <div>
            <Label htmlFor={`isPromotion-${index}`} className="text-cartaai-white">Estado de Promoción</Label>
            <Select 
              value={presentation.isPromotion?.toString()} 
              onValueChange={(value) => handleInputChange(index, 'isPromotion', Number(value))}
            >
              <SelectTrigger className="glass-container text-gray-500">
                <SelectValue placeholder="Seleccione estado de promoción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PromotionType.ACTIVE.toString()}>Activa</SelectItem>
                <SelectItem value={PromotionType.INACTIVE.toString()}>Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {presentation.rId && (
            <div className="flex items-center gap-3 p-3">
              <Label htmlFor={`rId-${index}`} className="text-lg font-medium text-gray-200">ID Remoto</Label>
              <span className="px-3 py-1.5 rounded-md bg-gray-700/50 text-gray-100 font-mono">{presentation.rId}</span>
            </div>
          )}
          {presentation.remoteName && (
            <div className="flex items-center gap-3 p-3">
              <Label htmlFor={`remoteName-${index}`} className="text-lg font-medium text-gray-200">Nombre Remoto</Label>
              <span className="px-3 py-1.5 rounded-md bg-gray-700/50 text-gray-100 font-mono">{presentation.remoteName}</span>
            </div>
          )}

          <Button
            type="button"
            onClick={() => handleSavePresentation(presentation)}
            className="mt-4 bg-cartaai-red hover:bg-cartaai-red/80 text-white"
          >
            Guardar Cambios
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={onAddPresentation}
        className="mt-4 bg-cartaai-red hover:bg-cartaai-red/80 text-white"
      >
        + Agregar Presentación
      </Button>
    </div>
  );
};

export default ProductPresentations;