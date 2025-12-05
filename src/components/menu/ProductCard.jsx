import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Package } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const ProductCard = ({ product, onEdit }) => {
  return (
    <Card className="bg-cartaai-black border-cartaai-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-cartaai-white">
          {product.name}
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="text-cartaai-white hover:text-cartaai-red"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video mb-4">
          <img
            src={product.imageUrl || '/placeholder.svg'}
            alt={product.name}
            className="rounded-md object-cover w-full h-full"
          />
        </div>
        <p className="text-sm text-gray-400 mb-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-cartaai-white font-semibold">
            S/ {product.basePrice?.toFixed(2)}
          </span>
          <div className="flex space-x-2">
            {product.isCombo && (
              <Badge variant="secondary">Combo</Badge>
            )}
            {product.isOutOfStock && (
              <Badge variant="destructive">Agotado</Badge>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-400">
          <Package className="h-4 w-4 mr-1" />
          {product.presentations?.length || 0} presentaciones
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;