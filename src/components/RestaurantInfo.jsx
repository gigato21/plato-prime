import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus } from 'lucide-react';
import WhatsappInfo from './WhatsappInfo';
import CountryCodeSelect from './CountryCodeSelect';
import { Card, CardContent } from "@/components/ui/card";

const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <Label htmlFor={name} className="text-sm font-medium text-cartaai-white/90">{label}</Label>
    <Input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1.5 bg-transparent border border-cartaai-white/10 text-cartaai-white h-10 rounded-lg
                transition-all duration-200 placeholder:text-gray-500
                focus:border-cartaai-white/30 focus:ring-0
                hover:border-cartaai-white/20"
      placeholder={placeholder}
    />
  </div>
);

const ImageUploadField = ({ label, imageType, imageSrc, onUpload }) => (
  <Card className="p-4 bg-cartaai-black/30 border-cartaai-white/10">
    <CardContent className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div>
          <Label className="text-sm font-medium text-cartaai-white/90 block">{label}</Label>
          <p className="text-sm text-cartaai-white/60">
            Tamaño recomendado: {imageType === 'restaurantImage' ? '590 x 400' : '2000 x 1000'} píxeles (JPEG)
          </p>
        </div>
        <Button
          onClick={() => document.getElementById(imageType).click()}
          className="bg-cartaai-white/10 text-cartaai-white hover:bg-cartaai-white/20 transition-all duration-200 w-full"
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Seleccionar imagen
        </Button>
      </div>
      
      <div className="relative group cursor-pointer mx-auto" onClick={() => document.getElementById(imageType).click()}>
        <img 
          src={imageSrc || (imageType === 'restaurantImage' ? "/carta-ai-logo.png" : "/restaurant-cover.jpg")} 
          alt={imageType === 'restaurantImage' ? "Logo del restaurante" : "Imagen de portada del restaurante"}
          className={`object-cover rounded-lg border border-cartaai-white/10 ${
            imageType === 'restaurantImage' 
              ? 'w-[150px] h-[150px]'  
              : 'w-[300px] h-[150px]'  
          }`}
        />

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
          <p className="text-white text-sm font-medium">Cambiar imagen</p>
        </div>
      </div>
      
      <Input
        id={imageType}
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="hidden"
      />
    </CardContent>
  </Card>
);

const RestaurantInfo = ({ restaurantData, setRestaurantData, whatsappData, setWhatsappData }) => {
  const [key, setKey] = useState(0);
  
  useEffect(() => {
    if (restaurantData.phone === undefined) {
      setRestaurantData(prev => ({ ...prev, phone: '' }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      setRestaurantData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setRestaurantData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCountryCodeChange = (value) => {
    setRestaurantData(prev => ({ ...prev, phoneCountryCode: value }));
  };

  const handleImageUpload = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRestaurantData(prev => ({ 
          ...prev, 
          [imageType]: reader.result,
          [`${imageType}File`]: file 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 bg-cartaai-black/50 p-6 rounded-lg">
      <h2 className="text-2xl font-semibold text-cartaai-white border-b border-cartaai-white/10 pb-2">
        Información del Restaurante
      </h2>
      
      <div className="space-y-6">
        <InputField 
          label="Nombre del restaurante" 
          name="name" 
          value={restaurantData.name} 
          onChange={handleInputChange} 
          placeholder="Ingrese el nombre del restaurante" 
        />
        
        <InputField 
          label="Nombre de la sucursal" 
          name="branchName" 
          value={restaurantData.branchName || ''} 
          onChange={handleInputChange} 
          placeholder="Ingrese el nombre de la sucursal (opcional)" 
        />
        
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-cartaai-white/90">Descripción del restaurante</Label>
          <Textarea
            id="description"
            name="description"
            value={restaurantData.description}
            onChange={handleInputChange}
            className="mt-1.5 bg-transparent border border-cartaai-white/10 text-cartaai-white rounded-lg
                      transition-all duration-200 placeholder:text-gray-500 min-h-[100px]
                      focus:border-cartaai-white/30 focus:ring-0
                      hover:border-cartaai-white/20"
            placeholder="Ingrese la descripción del restaurante"
          />
        </div>
        
        <InputField 
          label="Dirección del restaurante" 
          name="address" 
          value={restaurantData.address} 
          onChange={handleInputChange} 
          placeholder="Ingrese la dirección del restaurante" 
        />
        
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-cartaai-white/90">Teléfono del restaurante</Label>
          <div className="flex mt-1.5">
            <CountryCodeSelect
              value={restaurantData.phoneCountryCode || '+51'}
              onChange={handleCountryCodeChange}
            />
            <Input
              id="phone"
              name="phone"
              value={restaurantData.phone || ''}
              onChange={handleInputChange}
              className="ml-2 flex-grow bg-transparent border border-cartaai-white/10 text-cartaai-white h-10 rounded-lg
                        transition-all duration-200 placeholder:text-gray-500
                        focus:border-cartaai-white/30 focus:ring-0
                        hover:border-cartaai-white/20"
              placeholder="Ingrese el teléfono del restaurante"
              type="tel"
              maxLength={9}
              pattern="[0-9]*"
              inputMode="numeric"
            />
          </div>
        </div>

      </div>

      <WhatsappInfo whatsappData={whatsappData} setWhatsappData={setWhatsappData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" key={key}>
        <ImageUploadField 
          label="Imagen del restaurante (Logo)" 
          imageType="restaurantImage" 
          imageSrc={restaurantData.restaurantImage} 
          onUpload={(e) => handleImageUpload(e, 'restaurantImage')}
        />
        <ImageUploadField 
          label="Imagen de portada del restaurante" 
          imageType="coverImage" 
          imageSrc={restaurantData.coverImage} 
          onUpload={(e) => handleImageUpload(e, 'coverImage')}
        />
      </div>
    </div>
  );
};

export default RestaurantInfo; 