/* eslint-disable @typescript-eslint/no-explicit-any */
export type Batch = {
  id: string;
  productId: any[];
  supplierId?: any[];
  code: string;
  name: string;
  mfgDate: string;
  expDate: string;
};
