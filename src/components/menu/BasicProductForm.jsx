import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from '@/components/ImageUploader';
import ModifiersSection from '../../pages/MenuManager/components/ModifiersSection';

const BasicProductForm = ({ formData, setFormData, categories = [], hideBasePrice = false }) => {
  const selectedCategory = categories?.find(cat => cat.id === formData.categoryId);

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      categoryId: value
    }));
  };

  const handleImageChange = (file) => {
    setFormData(prev => ({
      ...prev,
      imageFile: file,
      imageUrl: URL.createObjectURL(file)
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <Label htmlFor="name">Nombre del Producto</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="glass-input"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="glass-input"
        />
      </div>

      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select
          value={formData.categoryId || ''}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category" className="glass-input">
            <SelectValue placeholder="Seleccionar categoría">
              {selectedCategory?.name || "Seleccionar categoría"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!hideBasePrice && (
        <div>
          <Label htmlFor="basePrice">Precio Base</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            className="glass-input"
            required
          />
        </div>
      )}

      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isCombo"
            checked={formData.isCombo}
            onCheckedChange={(checked) => setFormData({ ...formData, isCombo: checked })}
          />
          <Label htmlFor="isCombo">Es combo</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isOutOfStock"
            checked={formData.isOutOfStock}
            onCheckedChange={(checked) => setFormData({ ...formData, isOutOfStock: checked })}
          />
          <Label htmlFor="isOutOfStock">Agotado</Label>
        </div>
      </div>

      <ModifiersSection
        selectedModifiers={formData.modifiers || []}
        onChange={(modifiers) => setFormData({ ...formData, modifiers })}
      />

      <div>
        <Label>Imagen del Producto</Label>
        <ImageUploader
          imageUrl={formData.imageUrl}
          onImageUpload={(file) => setFormData({ 
            ...formData, 
            imageFile: file,
            imageUrl: URL.createObjectURL(file) 
          })}
          width={400}
          height={300}
        />
      </div>
    </div>
  );
};

export default BasicProductForm; 