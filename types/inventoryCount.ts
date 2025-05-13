import { Scheduler } from 'timers/promises';
import { Base } from './base/base-type';
import { Product } from './product';

export interface InventoryCount extends Base {
  scheduleId?: string;
  locationId?: string;
  warehouseId?: string;
  status?: number;
  code?: string;
  note?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  schedule?: Scheduler;
  location?: Location;
  inventoryCountDetails?: InventoryCountDetail[];
}

export interface InventoryCountDetail extends Base {
  errorTicketId?: string;
  productId?: string;
  inventoryCountId?: string;
  inventoryId?: string;
  expectedQuantity?: number;
  countedQuantity?: number;
  note?: string;
  errorTicket?: string;
  product?: Product;
  inventoryCount?: InventoryCount;
  accountId?: string;
  batchCode?: string;
  productName?: string;
}
export interface InventoryAdjutment extends Base {
  date: string;
  reason: string;
  note: string;
  documentType: 0;
  relatedDocument: string;
  warehouseId: string;
  inventoryCountId: string;
  inventoryCount?: InventoryCount[];
}
