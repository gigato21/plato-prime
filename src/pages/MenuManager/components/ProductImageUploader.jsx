import { Label } from "@/components/ui/label";
import ImageUploader from '../../../components/ImageUploader';

const ProductImageUploader = ({ imageUrl, onImageUpload }) => {
  return (
    <div className="space-y-4">
      <div className="glass-container p-4">
        <Label className="block text-sm font-medium text-cartaai-white mb-2">
          Imagen del producto
        </Label>
        <ImageUploader
          imageUrl={imageUrl}
          onImageUpload={onImageUpload}
          width={500}
          height={500}
        />
        <p className="text-sm text-cartaai-white/70 mt-2">
          Tamaño ideal de la imagen: 500x500 píxeles
        </p>
      </div>
    </div>
  );
};

export default ProductImageUploader;