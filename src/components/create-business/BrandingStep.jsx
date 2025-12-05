import React from 'react';
import { Label } from "@/components/ui/label";
import ImageUploader from '../ImageUploader';

const BrandingStep = ({ data, updateData }) => {
  const handleImageUpload = (type, file) => {
    updateData({ ...data, [type]: file });
  };

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-cartaai-white text-lg mb-4 block">Logo del Negocio</Label>
        <ImageUploader
          imageUrl={data.logo}
          onImageUpload={(file) => handleImageUpload('logo', file)}
          width={200}
          height={200}
          imageType="logo"
        />
        <p className="text-sm text-cartaai-white/70 mt-2">
          Recomendado: Imagen cuadrada de 200x200 píxeles
        </p>
      </div>

      <div>
        <Label className="text-cartaai-white text-lg mb-4 block">Imagen de Portada</Label>
        <ImageUploader
          imageUrl={data.coverImage}
          onImageUpload={(file) => handleImageUpload('coverImage', file)}
          width={600}
          height={300}
          imageType="cover"
        />
        <p className="text-sm text-cartaai-white/70 mt-2">
          Recomendado: Imagen de 600x300 píxeles
        </p>
      </div>
    </div>
  );
};

export default BrandingStep;