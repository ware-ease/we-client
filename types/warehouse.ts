import { Base } from './base/base-type';
import { Batch } from './batch';
import { Product } from './product';

export interface Warehouse extends Base {
  id: string;
  name: string;
  address: string;
  area: number;
  operateFrom: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  locations?: Location[];
  inventories?: Inventory[];
}

export interface Inventory extends Base {
  currentQuantity: number;
  arrangedQuantity: number;
  notArrgangedQuantity: number;
  warehouseId: string;
  warehouse: Warehouse;
  batchId: string;
  batch: Batch;
  id: string;
}

export interface Location extends Base {
  id: string;
  level: number;
  name: string;
  code: string;
  parentId?: string | null;
  warehouseId?: string;
}

export interface InventoryLocation extends Base {
  location: Location;
  quantity: number;
}

export interface PutAwayGood extends Base {
  inventoryId: string;
  locationId: string;
  quantity: number;
}

export interface InventoryAdjustment extends Base {
  code?: string;
  type?: number;
  date?: string;
  reason?: string;
  note?: string;
  relatedDocument?: string;
  warehouseId?: string;
  warehouse?: Warehouse;
  warehouseName?: string;
  inventoryAdjustmentDetails: InventoryAdjustmentDetail[];
}

export interface InventoryAdjustmentDetail extends Base {
  note?: string;
  changeInQuantity?: number;
  newQuantity?: number;
  locationId?: string;
  inventoryId?: string;
  product?: Product;
  batch?: Batch;
}

export interface StockCard {
  productCode: string;
  productName: string;
  unitName: string;
  warehouseName: string;
  details: {
    date: string;
    code: string;
    description: string;
    import: number;
    export: number;
    stock: number;
    note: string;
  }[];
}

export interface StockBook {
  address: string;
  inCharge: string;
  warehouseName: string;
  details: {
    date: string;
    code: string;
    description: string;
    import: number;
    export: number;
    openingStock: number;
    closingStock: number;
    note: string;
    productName: string;
    sku: string;
    batchCode: string;
  }[];
}
