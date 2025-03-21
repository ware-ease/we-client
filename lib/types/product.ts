export type Product = {
  id?: string;
  sku?: string;
  name?: string;
  note?: string;
  productType?: string;
  category?: string;
  brand?: string;
  unit?: string;
  status?: boolean;
};

export type ProductType = {
  id?: string;
  name: string;
  note: string;
};
