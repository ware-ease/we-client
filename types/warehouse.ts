export type Warehouse = {
  id: string;
  name: string;
  address: string;
  area: number;
  operateFrom: string;
  phone?: string;
  locations?: Location[];
};

export type Location = {
  id: string;
  level: number;
  name: string;
  code: string;
  parentId?: string | null;
  warehouseId?: string;
};
