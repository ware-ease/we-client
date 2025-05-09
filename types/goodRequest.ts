import { Base } from './base/base-type';
import { GoodNote } from './goodNote';
import { Supplier } from './supplier';
import { Warehouse } from './warehouse';

export interface GoodRequest extends Base {
  id?: string;
  code?: string;
  requestType?: number;
  partnerId?: string;
  partnerName?: string;
  warehouseId?: string;
  warehouseName?: string;
  requestedWarehouseId?: string;
  requestedWarehouseName?: string;
  note?: string;
  goodRequestDetails?: GoodRequestDetail[];
  status?: number;
  warehouse?: Warehouse;
  requestedWarehouse?: Warehouse;
  partner?: Supplier;
  goodNotes?: GoodNote[];
  goodNoteCount?: number;
  statusNote?: string;
}

export interface GoodRequestDetail extends Base {
  productId?: string;
  sku?: string;
  productName?: string;
  brandName?: string;
  unitName?: string;
  quantity?: number;
  unitType?: number;
}

export interface DeclineGoodRequest {
  id: string;
  reason: string;
}
