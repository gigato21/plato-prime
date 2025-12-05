export type CategoryImport = {
  rId: string;
  name: string;
  order: number;
  status: number;
}

export type OptionImport = {
  rId: string;
  name: string;
  price: number;
  stock?: number;
}

export type ModifierImport = {
  rId: string;
  name: string;
  isMultiple?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  options: OptionImport[];
}

export type PresentationImport = {
  rId: string;
  name: string;
  rName: string;
  price: number;
  isAvailableForDelivery: boolean;
  stock: number;
}

export type ProductImport = {
  rId: string;
  name: string;
  rName: string;
  description: string;
  categoryRId: string;
  isCombo: boolean;
  isOutOfStock: boolean;
  basePrice: number;
  imageUrl?: string;
  presentations: PresentationImport[];
  modifiers?: ModifierImport[];
}

export type IntegrationImport = {
  categories: CategoryImport[];
  products: ProductImport[];
  modifiers?: ModifierImport[];
}
