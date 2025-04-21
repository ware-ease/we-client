import { Base } from './base/base-type';

export interface Product extends Base {
  sku?: string;
  name?: string;
  note?: string;
  productType?: ProductType | string;
  category?: string;
  brand?: string;
  brandName?: string;
  unit?: string;
  unitName?: string;
  isBatchManaged?: boolean;
  //status?: boolean;
}

export type ProductType = {
  id?: string;
  name: string;
  note: string;
};
