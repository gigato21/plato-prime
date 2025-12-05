import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, Pencil } from 'lucide-react';
import StatusToggle from './StatusToggle';

const ProductTable = ({ filteredProducts, handleProductActions, handleViewPresentations, handleViewModifiers, handleEditProduct, handleSelectCategory }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="text-cartaai-white">Nombre</TableHead>
        <TableHead className="text-cartaai-white">Categoría</TableHead>
        <TableHead className="text-cartaai-white">Presentaciones</TableHead>
        <TableHead className="text-cartaai-white">Modificadores</TableHead>
        <TableHead className="text-cartaai-white">Acciones</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {filteredProducts.map((product) => (
        <TableRow key={product.id}>
          <TableCell 
            className="text-cartaai-white cursor-pointer hover:bg-cartaai-white/10"
            onClick={() => handleEditProduct(product.id)}
          >
            {product.name}
          </TableCell>
          <TableCell 
            className="text-cartaai-white cursor-pointer hover:bg-cartaai-white/10"
            onClick={() => handleSelectCategory(product)}
          >
            {product.category}
          </TableCell>
          <TableCell>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-cartaai-white hover:text-cartaai-red"
              onClick={() => handleViewPresentations(product)}
            >
              Ver Presentaciones <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </TableCell>
          <TableCell>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-cartaai-white hover:text-cartaai-red"
              onClick={() => handleViewModifiers(product)}
            >
              Ver Modificadores <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <StatusToggle
                isActive={product.active}
                onToggle={() => handleProductActions.toggleStatus(product.id)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-cartaai-white hover:text-cartaai-red"
                onClick={() => handleEditProduct(product.id)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ProductTable;