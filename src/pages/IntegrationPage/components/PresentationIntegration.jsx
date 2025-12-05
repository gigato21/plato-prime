import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Save, Search, Check } from 'lucide-react';

const PresentationIntegration = ({ products, onUpdatePresentation, onContinue, onBack, onSaveAll }) => {
  const [searchRestpe, setSearchRestpe] = useState('');
  const [searchCartaai, setSearchCartaai] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Filtrar presentaciones (en este ejemplo usamos los productos que ya tienen presentaciones)
  const filteredRestpeProducts = products.restpeProducts.filter(product => 
    product.name.toLowerCase().includes(searchRestpe.toLowerCase()) ||
    product.presentation.toLowerCase().includes(searchRestpe.toLowerCase())
  );
  
  const filteredCartaaiProducts = products.cartaaiProducts.filter(product => 
    product.name.toLowerCase().includes(searchCartaai.toLowerCase()) ||
    product.presentation.toLowerCase().includes(searchCartaai.toLowerCase())
  );

  // Calcular estadísticas
  const mappedCount = products.cartaaiProducts.filter(p => p.rId !== null).length;
  const totalCount = products.cartaaiProducts.length;

  return (
    <div className="glass-container p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-cartaai-white">Integración de Presentaciones</h2>
        <p className="text-cartaai-white/70 text-sm">
          Asocie las presentaciones de RESTPE con las presentaciones equivalentes en CARTAAI
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-md">RESTPE</div>
              <span className="text-sm font-medium text-cartaai-white">Presentaciones: {products.restpeProducts.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-md">CARTAAI</div>
              <span className="text-sm font-medium text-cartaai-white">Mapeadas: {mappedCount}/{totalCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lista de presentaciones RESTPE */}
        <div className="glass-container-inner p-4">
          <h3 className="text-lg font-semibold mb-4 text-cartaai-white">Presentaciones RESTPE</h3>
          
          <div className="relative mb-4">
            <Input
              placeholder="Buscar presentaciones..."
              value={searchRestpe}
              onChange={(e) => setSearchRestpe(e.target.value)}
              className="glass-input text-cartaai-white pr-10"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-cartaai-white/50" />
          </div>

          <div className="h-[500px] overflow-y-auto space-y-2 pr-2">
            {filteredRestpeProducts.map(product => (
              <div
                key={`${product.id}-${product.presentation}`}
                className={`p-3 rounded-md cursor-pointer transition-colors ${
                  selectedProduct && selectedProduct.restpe && selectedProduct.restpe.id === product.id
                    ? 'bg-blue-500/20 border border-blue-500'
                    : 'hover:bg-cartaai-white/5 border border-cartaai-white/10'
                }`}
                onClick={() => setSelectedProduct({ restpe: product, cartaai: null })}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-cartaai-white">{product.name}</h4>
                    <p className="text-sm text-cartaai-white/70">{product.presentation}</p>
                    <p className="text-xs text-cartaai-white/50">Código: {product.internalCode}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-cartaai-white">S/ {product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de presentaciones CARTAAI */}
        <div className="glass-container-inner p-4">
          <h3 className="text-lg font-semibold mb-4 text-cartaai-white">Presentaciones CARTAAI</h3>
          
          <div className="relative mb-4">
            <Input
              placeholder="Buscar presentaciones..."
              value={searchCartaai}
              onChange={(e) => setSearchCartaai(e.target.value)}
              className="glass-input text-cartaai-white pr-10"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-cartaai-white/50" />
          </div>

          <div className="h-[500px] overflow-y-auto space-y-2 pr-2">
            {filteredCartaaiProducts.map(product => {
              const isAssociated = product.rId !== null;
              const isSelected = selectedProduct && selectedProduct.restpe && product.rId === selectedProduct.restpe.id;
              
              return (
                <div
                  key={product.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-green-500/20 border border-green-500'
                      : isAssociated
                      ? 'bg-orange-500/10 border border-orange-500'
                      : 'hover:bg-cartaai-white/5 border border-cartaai-white/10'
                  }`}
                  onClick={() => {
                    if (selectedProduct && selectedProduct.restpe) {
                      onUpdatePresentation(selectedProduct.restpe.id, product.id);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-cartaai-white">{product.name}</h4>
                      <p className="text-sm text-cartaai-white/70">{product.presentation}</p>
                      <p className="text-xs text-cartaai-white/50">{product.description}</p>
                    </div>
                    <div className="text-right">
                      {isAssociated && (
                        <span className="inline-flex items-center bg-orange-500 text-white text-xs px-2 py-1 rounded-full mb-1">
                          <Check className="h-3 w-3 mr-1" /> Mapeado
                        </span>
                      )}
                      <span className="block text-sm font-semibold text-cartaai-white">S/ {product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Regresar
        </Button>
        <div className="flex gap-3">
          <Button 
            onClick={onSaveAll}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Guardar Todo
          </Button>
          <Button 
            onClick={onContinue}
            className="bg-cartaai-red hover:bg-cartaai-red/90 text-white flex items-center gap-2"
          >
            Continuar <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PresentationIntegration; 