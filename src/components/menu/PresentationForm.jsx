import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from '@/components/ImageUploader';
import { DiscountType, PromotionType } from '@/types/presentation';

const PresentationForm = ({ presentation, onChange }) => {
  const handleChange = (field, value) => {
    let updatedValue = value;
    
    // Calcular amountWithDiscount cuando cambia el tipo de descuento o el valor
    if (field === 'discountValue' || field === 'discountType') {
      const price = Number(presentation.price) || 0;
      const discountValue = field === 'discountValue' ? Number(value) : Number(presentation.discountValue) || 0;
      const discountType = field === 'discountType' ? value : presentation.discountType;
      
      let amountWithDiscount = price;
      if (discountType === DiscountType.PERCENTAGE) {
        amountWithDiscount = price - (price * (discountValue / 100));
      } else if (discountType === DiscountType.FIXED) {
        amountWithDiscount = price - discountValue;
      }
      
      // Actualizar tanto el campo cambiado como amountWithDiscount
      onChange({
        ...presentation,
        [field]: value,
        amountWithDiscount: Math.max(0, amountWithDiscount)
      });
      return;
    }

    onChange({ ...presentation, [field]: updatedValue });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-cartaai-white">Nombre de la Presentación</Label>
        <Input
          id="name"
          value={presentation.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="glass-input text-gray-700 dark:text-gray-300"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-cartaai-white">Descripción</Label>
        <Textarea
          id="description"
          value={presentation.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="glass-input text-gray-700 dark:text-gray-300"
        />
      </div>

      <div>
        <Label htmlFor="price" className="text-cartaai-white">Precio</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={presentation.price}
          onChange={(e) => handleChange('price', e.target.value)}
          className="glass-input text-gray-700 dark:text-gray-300"
          required
        />
      </div>

      <div>
        <Label htmlFor="discountType" className="text-cartaai-white">Tipo de Descuento</Label>
        <Select 
          value={presentation.discountType?.toString()} 
          onValueChange={(value) => handleChange('discountType', Number(value))}
        >
          <SelectTrigger className="glass-input text-gray-700 dark:text-gray-300">
            <SelectValue placeholder="Seleccione tipo de descuento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DiscountType.PERCENTAGE.toString()}>Porcentaje</SelectItem>
            <SelectItem value={DiscountType.FIXED.toString()}>Fijo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="discountValue" className="text-cartaai-white">Valor del Descuento</Label>
        <Input
          id="discountValue"
          type="number"
          step="0.01"
          value={presentation.discountValue}
          onChange={(e) => handleChange('discountValue', e.target.value)}
          className="glass-input text-gray-700 dark:text-gray-300"
        />
      </div>

      <div>
        <Label htmlFor="amountWithDiscount" className="text-cartaai-white">Precio con Descuento</Label>
        <Input
          id="amountWithDiscount"
          type="number"
          value={presentation.amountWithDiscount}
          className="glass-input text-gray-700 dark:text-gray-300 bg-gray-100"
          disabled
        />
      </div>

      <div>
        <Label htmlFor="isPromotion" className="text-cartaai-white">Estado de Promoción</Label>
        <Select 
          value={presentation.isPromotion?.toString()} 
          onValueChange={(value) => handleChange('isPromotion', Number(value))}
        >
          <SelectTrigger className="glass-input text-gray-700 dark:text-gray-300">
            <SelectValue placeholder="Seleccione estado de promoción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PromotionType.ACTIVE.toString()}>Activa</SelectItem>
            <SelectItem value={PromotionType.INACTIVE.toString()}>Inactiva</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="stock" className="text-cartaai-white">Stock</Label>
        <Input
          id="stock"
          type="number"
          value={presentation.stock}
          onChange={(e) => handleChange('stock', e.target.value)}
          className="glass-input text-gray-700 dark:text-gray-300"
          required
        />
      </div>

      <div>
        <Label className="text-gray-700 dark:text-gray-300">Imagen de la Presentación</Label>
        <ImageUploader
          imageUrl={presentation.imageUrl}
          onImageUpload={(file) => {
            const tempUrl = URL.createObjectURL(file);
            handleChange('imageUrl', tempUrl);
            handleChange('imageFile', file);
          }}
          width={400}
          height={300}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isAvailableForDelivery"
          checked={presentation.isAvailableForDelivery}
          onCheckedChange={(checked) => handleChange('isAvailableForDelivery', checked)}
        />
        <Label htmlFor="isAvailableForDelivery" className="text-gray-700 dark:text-gray-300">
          Disponible para delivery
        </Label>
      </div>
    </div>
  );
};

export default PresentationForm;