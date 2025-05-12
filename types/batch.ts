import { Base } from './base/base-type';
import { Product } from './product';

export interface Batch extends Base {
  id: string;
  productId: string;
  productName: string;
  supplierId?: string;
  inventoryId?: string;
  code: string;
  name: string;
  inboundDate: string;
  mfgDate: string;
  expDate: string;
  product?: Product;
  thisWarehouseQuantity: number;
  createdTime: string;
}
