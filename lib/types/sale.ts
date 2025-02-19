export type Sale = {
  id: string;
  orderNumber: string;
  customer: string;
  totalAmount: number;
  status: string;
  date: string;
};

export type SaleDetail = {
  id: string;
  orderNumber: string;
  customer: string;
  totalAmount: number;
  status: string;
  date: string;
  items: SaleItem[];
};

export type SaleItem = {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
};
