import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from "sonner";
import { getApiUrls } from '@/config/api';
import Loader from '@/components/ui/loader';
import { motion } from 'framer-motion';
import ImgModal from '@/components/ui/Modal';

const Gallery = () => {
  const API_URLS = getApiUrls();
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const subDomain = useSelector(state => state.auth.subDomain);
  const localId = useSelector(state => state.auth.localId);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchImages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu-pic?subDomain=${subDomain}&localId=${localId}`
      );

      if (!response.ok) {
        throw new Error('Error al cargar las imágenes');
      }

      const data = await response.json();
      if (data.data && data.data.files) {
        setImages(data.data.files);
      }
    } catch (error) {
      console.error('Error cargando imágenes:', error);
      toast.error("Error al cargar las imágenes");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (files) => {
    setIsUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const checkResponse = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu-pic?subDomain=${subDomain}&localId=${localId}`
      );

      if (!checkResponse.ok) {
        throw new Error('Error al verificar el grupo de imágenes');
      }

      const checkData = await checkResponse.json();
      
      const endpoint = checkData.data === null 
        ? `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu-pic` 
        : `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu-pic/update-images`;

      const uploadResponse = await fetch(
        `${endpoint}?subDomain=${subDomain}&localId=${localId}`, 
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Error al subir las imágenes');
      }

      await fetchImages();
      toast.success("Imágenes subidas exitosamente");
    } catch (error) {
      console.error('Error en la subida:', error);
      toast.error(error.message || "Error al subir las imágenes");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length === 0) {
      toast.error("Por favor selecciona archivos de imagen válidos");
      return;
    }

    try {
      await uploadImages(files);
    } catch (error) {
      console.error('Error en el proceso de subida:', error);
    }
  };

  const deleteImage = async (imageUrl) => {
    try {
      const response = await fetch(
        `${API_URLS.SERVICIOS_GENERALES_URL}/api/v1/menu-pic?subDomain=${subDomain}&localId=${localId}&url=${encodeURIComponent(imageUrl)}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la imagen');
      }

      // Actualizar la lista de imágenes después de eliminar
      await fetchImages();
      toast.success("Imagen eliminada exitosamente");
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      toast.error(error.message || "Error al eliminar la imagen");
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-container p-8 mb-8 rounded-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-cartaai-white">Galería de Imágenes</h1>
        <div className="flex items-center gap-4">
          <label 
            className={`
              relative inline-flex items-center justify-center px-6 py-3 
              bg-purple-500 hover:bg-purple-600 text-white rounded-lg
              transition-all duration-300 cursor-pointer
              ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
            `}
          >
            <span className="relative z-10">
              {isUploading ? 'Subiendo...' : 'Seleccionar Imágenes'}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
          </label>
          {isUploading && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-cartaai-white">Subiendo imágenes...</span>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {images.map((imageUrl, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative overflow-hidden glass-container rounded-xl aspect-square"
            onClick={() => openModal(imageUrl)}
          >
            <img
              src={imageUrl}
              alt={`Imagen ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
            <button 
              onClick={() => deleteImage(imageUrl)} 
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              X
            </button>
          </motion.div>
        ))}
      </motion.div>

      {isModalOpen && (
        <ImgModal onClose={closeModal}>
          <img src={selectedImage} alt="Imagen seleccionada" className="max-w-full max-h-full object-contain" />
        </ImgModal>
      )}
    </div>
  );
};

export default Gallery;