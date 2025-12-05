import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { getModifiers } from '../../hooks/useModifiers';

const ProductModifiersModal = ({ isOpen, onClose, product, onToggleModifier }) => {
  const [modifiers, setModifiers] = useState([]);

  useEffect(() => {
    const fetchModifiers = async () => {
      const fetchedModifiers = await getModifiers();
      setModifiers(fetchedModifiers);
    };

    if (isOpen) {
      fetchModifiers();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modificadores para {product?.name}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Activo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modifiers.map((modifier) => (
              <TableRow key={modifier.id}>
                <TableCell>{modifier.name}</TableCell>
                <TableCell>
                  {modifier.price !== undefined ? `$${modifier.price.toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={product?.modifiers?.includes(modifier.id)}
                    onCheckedChange={() => onToggleModifier(product.id, modifier.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModifiersModal;