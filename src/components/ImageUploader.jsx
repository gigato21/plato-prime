import { useRef, useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ImageIcon } from 'lucide-react';

const ImageUploader = ({ imageUrl, onImageUpload, width, height, imageType }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(imageUrl);

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const placeholderText = imageType === 'logo' ? 'Cargar el logo' : 'Cargar portada';

  return (
    <div className="mt-2">
      <div
        className="border-2 border-dashed border-cartaai-white/30 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
        onClick={() => fileInputRef.current.click()}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Vista previa"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-cartaai-white text-center p-4">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-700 mb-2" />
            <p className="font-semibold text-gray-700">{placeholderText}</p>
            <p className="text-sm text-gray-700">{width} x {height} píxeles</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="mt-2 bg-gray-700 dark:bg-gray-300 text-cartaai-black hover:bg-gray-500 hover:dark:bg-gray-400"
      >
        {previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
      </Button>
    </div>
  );
};

export default ImageUploader;