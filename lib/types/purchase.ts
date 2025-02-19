export type Purchase = {
  id: string;
  supplier: string;
  totalAmount: number;
  date: string;
  status: string;
};

export type PurchaseDetail = {
  id: string;
  supplier: string;
  totalAmount: number;
  date: string;
  status: string;
  items: PurchaseItem[];
};

export type PurchaseItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};
