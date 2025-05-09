import { toast } from 'react-toastify';

interface GoodNoteRow {
  quantity: number | string;
  note: string;
  name?: string;
  productId?: string;
  unitType: number;
  mfgDate: string;
  expDate: string;
  batch?: string;
  isBatchManaged?: boolean;
}

interface GoodNoteDetail {
  quantity: number;
  note: string;
  newBatch: {
    productId?: string;
    name: string;
    mfgDate: Date;
    expDate: Date;
  };
}

export const mapGoodNoteDetails = (data: GoodNoteRow[]): GoodNoteDetail[] => {
  const validDetails: GoodNoteDetail[] = [];
  const seenErrors = new Set<string>(); // Track productIds with errors to avoid duplicate toasts

  data.forEach((row) => {
    // Convert quantity to number
    const quantity = Number(row.quantity);

    // Check if quantity is valid
    if (isNaN(quantity)) {
      if (!seenErrors.has(row.productId || '')) {
        toast.error(`Số lượng không hợp lệ cho sản phẩm ${row.name}`);
        seenErrors.add(row.productId || '');
      }
      return;
    }

    // Check if quantity is integer for unitType === 0
    if (row.unitType === 0 && !Number.isInteger(quantity)) {
      if (!seenErrors.has(row.productId || '')) {
        toast.error(`Số lượng phải là số nguyên cho sản phẩm ${row.name}`);
        seenErrors.add(row.productId || '');
      }
      return;
    }

    if (!row.batch && row.isBatchManaged === true) {
      toast.error(`Mã lô của sản phẩm ${row.name} không được để trống!`);
      return;
    }

    // Add valid row to result
    validDetails.push({
      quantity,
      note: row.note,
      newBatch: {
        productId: row.productId,
        name: row.batch || '',
        mfgDate: new Date(row.mfgDate),
        expDate: new Date(row.expDate),
      },
    });
  });

  return validDetails;
};

interface GoodRequestDetail {
  productId: string;
  quantity: number;
}

export const mapGoodRequestDetails = (
  data: GoodNoteRow[]
): GoodRequestDetail[] => {
  const seenErrors = new Set<string>(); // Track productIds with errors to avoid duplicate toasts

  return Object.values(
    data.reduce((acc, row) => {
      const { productId, quantity, unitType, name } = row;

      // Skip if productId is missing
      if (!productId) return acc;

      // Convert quantity to number
      const parsedQuantity = Number(quantity);

      // Check if quantity is valid
      if (isNaN(parsedQuantity)) {
        if (!seenErrors.has(productId)) {
          toast.error(`Số lượng không hợp lệ cho sản phẩm ${name}`);
          seenErrors.add(productId);
        }
        return acc;
      }

      // Check if quantity is integer for unitType === 0
      if (unitType === 0 && !Number.isInteger(parsedQuantity)) {
        if (!seenErrors.has(productId)) {
          toast.error(`Số lượng phải là số nguyên cho sản phẩm ${name}`);
          seenErrors.add(productId);
        }
        return acc;
      }

      // Aggregate quantity
      acc[productId] = acc[productId] || { productId, quantity: 0 };
      acc[productId].quantity += parsedQuantity;

      return acc;
    }, {} as Record<string, { productId: string; quantity: number }>)
  );
};
