import { Product } from './product';

export type Batch = {
  id: string;
  productId: string;
  supplierId?: string;
  code: string;
  name: string;
  inboundDate: string;
  mfgDate: string;
  expDate: string;
  product?: Product;
};
