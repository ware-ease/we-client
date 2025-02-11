export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  types: number;
  status: boolean;
};

export type ProductTypeDetail = {
  id: string;
  name: string;
  description: string;
};
