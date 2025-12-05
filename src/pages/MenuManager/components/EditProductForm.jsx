import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const EditProductForm = ({
  formData,
  handleInputChange,
  handleSwitchChange,
  categories,
  rId
}) => {
  // Find the selected category
  const selectedCategory = categories?.find(cat => cat.rId === formData.categoryId);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del Producto</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="glass-input text-cartaai-white"
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="glass-input text-cartaai-white"
        />
      </div>
      <div>
        <Label htmlFor="basePrice">Precio Base</Label>
        <Input
          id="basePrice"
          name="basePrice"
          type="number"
          value={formData.basePrice}
          onChange={handleInputChange}
          className="glass-input text-cartaai-white"
        />
      </div>
      <div>
        <Label htmlFor="category">Categoría</Label>
        <Select 
          value={formData.categoryId || ''} 
          onValueChange={(value) => handleInputChange({ target: { name: 'categoryId', value }})}
        >
          <SelectTrigger className="w-full glass-input">
            <SelectValue placeholder="Seleccionar categoría">
              {selectedCategory?.name || "Seleccionar categoría"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.rId}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isCombo"
          checked={formData.isCombo}
          onCheckedChange={() => handleSwitchChange('isCombo')}
        />
        <Label htmlFor="isCombo">Es combo</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isOutOfStock"
          checked={formData.isOutOfStock}
          onCheckedChange={() => handleSwitchChange('isOutOfStock')}
        />
        <Label htmlFor="isOutOfStock">Agotado</Label>
      </div>
      {rId && (
        <div className="flex items-center gap-3 p-3">
          <Label htmlFor="rId" className="text-lg font-medium text-gray-200">ID Remoto</Label>
          <span className="px-3 py-1.5 rounded-md bg-gray-700/50 text-gray-100 font-mono">{rId}</span>
        </div>
      )}
      {formData.remoteName && (
        <div>
          <Label htmlFor="remoteName">Nombre Remoto</Label>
          <Input
            id="remoteName"
            name="remoteName"
            value={formData.remoteName}
            readOnly
            className="glass-input text-cartaai-white"
          />
        </div>
      )}
    </div>
  );
};

export default EditProductForm;