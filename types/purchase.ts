export type Purchase = {
  id: string;
  orderNumber: string;
  supplier: string;
  totalAmount: number;
  date: string;
  status: string;
};

export type PurchaseDetail = {
  id: string;
  orderNumber: string;
  supplier: string;
  totalAmount: number;
  status: string;
  date: string;
  items: PurchaseItem[];
};

export type PurchaseItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};
