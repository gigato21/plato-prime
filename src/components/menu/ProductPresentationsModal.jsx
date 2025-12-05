import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusToggle from './StatusToggle';
import DeletePresentationButton from './DeletePresentationButton';

const ProductPresentationsModal = ({ isOpen, onClose, product, onTogglePresentation, onAddPresentation }) => {
  const [newPresentationName, setNewPresentationName] = useState('');
  const [newPresentationPrice, setNewPresentationPrice] = useState('');
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    if (product && isOpen) {
      const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const currentProduct = storedProducts.find(p => p.id === product.id);
      if (currentProduct && currentProduct.presentations) {
        setPresentations(currentProduct.presentations);
      }
    }
  }, [product, isOpen]);

  const handleAddPresentation = () => {
    if (newPresentationName && newPresentationPrice) {
      const newPresentation = {
        id: Date.now(),
        name: newPresentationName,
        price: parseFloat(newPresentationPrice),
        active: true
      };
      onAddPresentation(product.id, newPresentation);
      setPresentations(prevPresentations => [...prevPresentations, newPresentation]);
      setNewPresentationName('');
      setNewPresentationPrice('');

      // Update localStorage
      updateLocalStorage([...presentations, newPresentation]);
    }
  };

  const handleTogglePresentation = (presentationId) => {
    onTogglePresentation(product.id, presentationId);
    setPresentations(prevPresentations => 
      prevPresentations.map(p => 
        p.id === presentationId ? { ...p, active: !p.active } : p
      )
    );

    // Update localStorage
    updateLocalStorage(presentations.map(p => 
      p.id === presentationId ? { ...p, active: !p.active } : p
    ));
  };

  const handleDeletePresentation = (presentationId) => {
    setPresentations(prevPresentations => 
      prevPresentations.filter(p => p.id !== presentationId)
    );

    // Update localStorage
    updateLocalStorage(presentations.filter(p => p.id !== presentationId));
  };

  const updateLocalStorage = (updatedPresentations) => {
    const storedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = storedProducts.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          presentations: updatedPresentations
        };
      }
      return p;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cartaai-black border-cartaai-white/10">
        <DialogHeader>
          <DialogTitle className="text-cartaai-white">
            {product ? `Presentaciones de ${product.name}` : 'Presentaciones del Producto'}
          </DialogTitle>
        </DialogHeader>
        {presentations.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-cartaai-white">Presentación</TableHead>
                <TableHead className="text-cartaai-white">Precio</TableHead>
                <TableHead className="text-cartaai-white">Estado</TableHead>
                <TableHead className="text-cartaai-white">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presentations.map((presentation) => (
                <TableRow key={presentation.id}>
                  <TableCell className="text-cartaai-white">{presentation.name}</TableCell>
                  <TableCell className="text-cartaai-white">S/ {presentation.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusToggle
                      isActive={presentation.active}
                      onToggle={() => handleTogglePresentation(presentation.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <DeletePresentationButton onDelete={() => handleDeletePresentation(presentation.id)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-cartaai-white">Este producto no tiene presentaciones guardadas.</p>
        )}
        <div className="mt-4">
          <h3 className="text-cartaai-white mb-2">Agregar nueva presentación</h3>
          <div className="flex space-x-2">
            <Input
              placeholder="Nombre"
              value={newPresentationName}
              onChange={(e) => setNewPresentationName(e.target.value)}
              className="bg-cartaai-white/10 text-cartaai-white"
            />
            <Input
              placeholder="Precio"
              type="number"
              value={newPresentationPrice}
              onChange={(e) => setNewPresentationPrice(e.target.value)}
              className="bg-cartaai-white/10 text-cartaai-white"
            />
            <Button onClick={handleAddPresentation} className="bg-cartaai-red hover:bg-cartaai-red/80 text-white">
              Agregar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPresentationsModal;