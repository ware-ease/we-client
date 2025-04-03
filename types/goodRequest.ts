import { Warehouse } from './warehouse';

export type GoodRequest = {
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
};

export type GoodRequestDetail = {
  productId?: string;
  productName?: string;
  quantity?: string;
};
