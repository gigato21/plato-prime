import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ProductForm from '@/components/ProductForm';
import { ArrowLeft } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { getModifiers } from '../hooks/useModifiers';
import ImageUploader from '@/components/ImageUploader';

const localStorageKey = 'editedProduct';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState({
    name: '',
    category: '',
    presentations: [{ name: '', price: '', image: '', description: '' }],
    description: '',
    modifiers: [],
    image: ''
  });
  const [modifiers, setModifiers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    setCategories(storedCategories);

    if (id) {
      const savedProduct = localStorage.getItem(localStorageKey);
      if (savedProduct) {
        const parsedProduct = JSON.parse(savedProduct);
        setProduct({
          ...parsedProduct,
          modifiers: parsedProduct.modifiers || []
        });
      } else {
        setProduct({
          name: 'Sánguche de Chicharrón',
          category: 'Sánguches Clásicos',
          presentations: [
            { name: 'Regular', price: '15', image: '', description: 'Tamaño regular' }
          ],
          description: 'Delicioso sánguche de chicharrón criollo',
          modifiers: []
        });
      }
    }
    
    const loadModifiers = async () => {
      const fetchedModifiers = await getModifiers();
      setModifiers(fetchedModifiers);
    };
    loadModifiers();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryChange = (value) => {
    setProduct({ ...product, category: value });
  };

  const handlePresentationChange = (index, field, value) => {
    const newPresentations = [...product.presentations];
    newPresentations[index][field] = value;
    setProduct({ ...product, presentations: newPresentations });
  };

  const addPresentation = () => {
    setProduct({
      ...product,
      presentations: [...product.presentations, { name: '', price: '', image: '', description: '' }]
    });
  };

  const handleModifierToggle = (modifierId) => {
    setProduct(prevProduct => {
      const updatedModifiers = prevProduct.modifiers.some(m => m.id === modifierId)
        ? prevProduct.modifiers.filter(m => m.id !== modifierId)
        : [...prevProduct.modifiers, { id: modifierId, items: [] }];
      return { ...prevProduct, modifiers: updatedModifiers };
    });
  };

  const handleModifierItemToggle = (modifierId, itemId) => {
    setProduct(prevProduct => {
      const updatedModifiers = prevProduct.modifiers.map(m => {
        if (m.id === modifierId) {
          const updatedItems = m.items.includes(itemId)
            ? m.items.filter(id => id !== itemId)
            : [...m.items, itemId];
          return { ...m, items: updatedItems };
        }
        return m;
      });
      return { ...prevProduct, modifiers: updatedModifiers };
    });
  };

  const handleImageUpload = (file) => {
    setProduct({ ...product, image: URL.createObjectURL(file) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(localStorageKey, JSON.stringify(product));
    
    toast({
      title: "Cambios guardados",
      description: "Los cambios en el producto han sido guardados exitosamente.",
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/menu');
    }, 1000);
  };

  const handleGoBack = () => {
    navigate('/menu', { state: { activeTab: 'products' } });
  };

  return (
    <div className="space-y-6 p-6 glass-container">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-cartaai-white border-b border-cartaai-white/10 pb-2">
          {id ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h1>
        <Button 
          onClick={handleGoBack} 
          variant="outline"
          className="text-cartaai-white hover:text-cartaai-white/80 transition-all duration-300"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Productos
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ProductForm
              product={product}
              categories={categories}
              modifiers={modifiers}
              onInputChange={handleInputChange}
              onCategoryChange={handleCategoryChange}
              onPresentationChange={handlePresentationChange}
              onAddPresentation={addPresentation}
              onModifierToggle={handleModifierToggle}
              onModifierItemToggle={handleModifierItemToggle}
            />
          </div>
          <div className="space-y-4">
            <div className="glass-container p-4">
              <label className="block text-sm font-medium text-cartaai-white mb-2">
                Imagen del producto
              </label>
              <ImageUploader
                imageUrl={product.image}
                onImageUpload={handleImageUpload}
                width={500}
                height={500}
              />
              <p className="text-sm text-cartaai-white/70 mt-2">
                Tamaño ideal de la imagen: 500x500 píxeles
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-cartaai-red hover:bg-cartaai-red/80 text-white transition-all duration-300"
          >
            Guardar Producto
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;