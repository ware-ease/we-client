import { Base } from './base/base-type';
import { Batch } from './batch';

export interface Warehouse extends Base {
  id: string;
  name: string;
  address: string;
  area: number;
  operateFrom: string;
  phone?: string;
  locations?: Location[];
  inventories?: Inventory[];
}

export interface Inventory extends Base {
  currentQuantity: number;
  batchId?: string;
  batch: Batch;
}

export interface Location extends Base {
  id: string;
  level: number;
  name: string;
  code: string;
  parentId?: string | null;
  warehouseId?: string;
}
