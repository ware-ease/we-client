import { Base } from './base/base-type';
import { Product } from './product';
//import { Location } from './warehouse';
// import { Schedule } from './schedule';

export interface InventoryCount extends Base {
  scheduleId?: string;
  locationId?: string;
  status?: number;
  code?: string;
  note?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  schedule?: string;
  // location?: Location;
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
}
