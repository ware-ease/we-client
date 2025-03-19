export type GoodRequest = {
  id?: string;
  requestType?: number;
  partnerId?: string;
  partnerName?: string;
  warehouseId?: string;
  warehouseName?: string;
  requestedWarehouseId?: string;
  requestedWarehouseName?: string;
  note?: string;
  goodRequestDetails?: GoodRequestDetail[];
};

export type GoodRequestDetail = {
  productId?: string;
  productName?: string;
  quantity?: string;
};
