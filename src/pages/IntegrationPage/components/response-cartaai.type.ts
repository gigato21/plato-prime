interface IntegrationApiResponse {
    success: boolean;
    message: string;
    data: IntegrationResponse;
    error?: string;
  }
  
  interface IntegrationResponse {
    categories: Categoria[];
    products: ProductWithPresentations[];
    modifiers: Modificador[];
  }
  
  interface Categoria {
    _id: string;
    rId: string;
    subDomain: string;
    localId: string;
    name: string;
    description?: string;
    imageUrl?: string;
    status: number;
    order: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  interface ProductWithPresentations {
    _id: string;
    rId: string;
    subDomain: string;
    localId: string;
    name: string;
    description: string;
    categoryId: string;
    basePrice: number;
    isCombo: boolean;
    isOutOfStock: boolean;
    imageUrl?: string;
    status: number;
    modifiers?: any[];
    presentations: Presentacion[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  interface Presentacion {
    _id: string;
    rId: string;
    subDomain: string;
    localId: string;
    name: string;
    price: number;
    productId: string;
    status: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  interface Modificador {
    _id: string;
    rId: string;
    subDomain: string;
    localId: string;
    name: string;
    description?: string;
    type: string;
    isRequired: boolean;
    minSelections: number;
    maxSelections: number;
    options: ModificadorOpcion[];
    status: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  interface ModificadorOpcion {
    _id: string;
    rId: string;
    name: string;
    price: number;
    status: number;
    createdAt?: Date;
    updatedAt?: Date;
  }