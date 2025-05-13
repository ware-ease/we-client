/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/shadcn-base/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn-base/Dialog';
import {
  createInventoryAdjustment,
  updateInventoryCount,
} from '@/services/inventoryCountService';
import { InventoryAdjutment, InventoryCount } from '@/types/inventoryCount';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface InventoryCountAdjustmentDialogProps {
  open: boolean;
  onClose: () => void;
  inventoryCounts: InventoryCount;
  onConfirm: (data: any) => void;
}
const InventoryCountAdjustmentDialog = ({
  open,
  onClose,
  inventoryCounts,
}: //   onConfirm,
InventoryCountAdjustmentDialogProps) => {
  const [loading, setLoading] = useState(false);

  const [adjustmentNote, setAdjustmentNote] = useState('');

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAdjustmentNote(e.target.value);
  };
  const { warehouseId } = useParams<{ warehouseId: string }>();

  const addInventoryAdjustmentMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);

      // 1. Cập nhật inventory count status
      await updateInventoryCount(inventoryCounts.id as string, { status: 2 });

      // 2. Gửi dữ liệu điều chỉnh
      const inventoryAdjustment: InventoryAdjutment = {
        date: new Date().toISOString(),
        reason: adjustmentNote,
        note: inventoryCounts?.note || '',
        documentType: 0,
        relatedDocument: '',
        warehouseId: warehouseId,
        inventoryCountId: inventoryCounts.id as string,
      };
      console.log('inventoryAdjustment:', {
        date: inventoryAdjustment.date,
        reason: inventoryAdjustment.reason,
        note: inventoryAdjustment.note,
        documentType: inventoryAdjustment.documentType,
        relatedDocument: inventoryAdjustment.relatedDocument,
        warehouseId: inventoryAdjustment.warehouseId,
        inventoryCountId: inventoryAdjustment.inventoryCountId,
      });

      return createInventoryAdjustment(inventoryAdjustment);
    },
    onSuccess: () => {
      onClose();
    },
    onError: () => {
      // xử lý lỗi nếu cần
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  //   const confirmAdjustment = async () => {
  //     setLoading(true);
  //     try {
  //       // Setup the structure for inventory adjustment
  //       const updatedData: InventoryAdjustment = {
  //         code: 'INV-ADJ-' + new Date().getTime(),
  //         type: 1,
  //         date: new Date().toISOString(),
  //         reason: adjustmentNote,
  //         note: adjustmentNote,
  //         relatedDocument: relatedDocument,
  //         warehouseId: selectedWarehouseId,
  //         inventoryCounts: [],

  //       // Call the mutation function to create the inventory adjustment
  //       await createInventoryAdjustment(updatedData);

  //       // Close the dialog after confirming
  //       onClose();
  //     } catch (error) {
  //       console.error('Error during inventory count adjustment:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='p-6 bg-white rounded-lg shadow-xl max-w-3xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-gray-900'>
            Cập nhập cân bằng kiểm kê
          </DialogTitle>
        </DialogHeader>

        {/* Form Fields Section */}
        <div className='space-y-4'>
          {/* Code Field */}
          <div>
            <label htmlFor='code' className='text-sm font-medium text-gray-700'>
              Mã số
            </label>
            <input
              id='code'
              type='text'
              value={inventoryCounts?.code || ''}
              disabled
              className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Note Field */}
          <div>
            <label htmlFor='note' className='text-sm font-medium text-gray-700'>
              Ghi chú
            </label>
            <textarea
              id='note'
              value={inventoryCounts?.note || ''}
              disabled
              className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Date and Time Fields in a row */}
          <div className='grid grid-cols-2 gap-4'>
            {/* Date Field */}
            <div>
              <label
                htmlFor='date'
                className='text-sm font-medium text-gray-700'
              >
                Ngày
              </label>
              <input
                id='date'
                type='date'
                value={inventoryCounts?.date || ''}
                disabled
                className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Start Time Field */}
            <div>
              <label
                htmlFor='startTime'
                className='text-sm font-medium text-gray-700'
              >
                Giờ bắt đầu
              </label>
              <input
                id='startTime'
                type='time'
                value={inventoryCounts?.startTime || ''}
                disabled
                className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* End Time Field */}
            <div>
              <label
                htmlFor='endTime'
                className='text-sm font-medium text-gray-700'
              >
                Giờ kết thúc
              </label>
              <input
                id='endTime'
                type='time'
                value={inventoryCounts?.endTime || ''}
                disabled
                className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label
                htmlFor='note'
                className='text-sm font-medium text-red-500'
              >
                Lý do
              </label>
              <textarea
                id='note'
                value={adjustmentNote}
                onChange={handleNoteChange}
                className='mt-2 w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Counted Quantity Field (Editable) */}
            {/* <div>
          <label htmlFor='countedQuantity' className='text-sm font-medium text-gray-700'>
            Số lượng đếm
          </label>
          <input
            id='countedQuantity'
            type='number'
            value={countedQuantity}
            onChange={handleCountedQuantityChange}
            className='mt-2 w-full p-2.5 border border-blue-500 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500'
          />
        </div> */}
          </div>
        </div>

        {/* Inventory Count Details */}
        <div className='mt-6'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Chi tiết kiểm kho
          </h3>
          <div className='overflow-x-auto bg-gray-50 p-4 rounded-lg'>
            <table className='min-w-full table-auto'>
              <thead>
                <tr>
                  <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                    Sản phẩm
                  </th>
                  <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                    Mã lô
                  </th>
                  <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                    Số lượng dự kiến
                  </th>
                  <th className='px-4 py-2 text-sm font-medium text-gray-700 border-b'>
                    Số lượng đếm
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventoryCounts.inventoryCountDetails?.map((detail) => (
                  <tr key={detail.id} className='border-b'>
                    <td className='px-4 py-2 text-sm text-gray-700'>
                      {detail.productName || 'Không có thông tin'}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-700'>
                      {detail.batchCode || 'Không có thông tin'}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-700'>
                      {detail.expectedQuantity}
                    </td>
                    <td className='px-4 py-2 text-sm text-gray-700'>
                      {detail.countedQuantity}
                    </td>
                    {/* <td className='px-4 py-2'>
                      <input
                        type='number'
                        value={countedQuantities[detail.id || ''] || ''}
                        onChange={(e) =>
                          handleCountedQuantityChange(detail.id || '', e)
                        }
                        className='w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500'
                      />
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='mt-6 flex justify-end space-x-4'>
          <Button
            variant='ghost'
            onClick={onClose}
            className='px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400'
          >
            Hủy
          </Button>
          <Button
            onClick={() => addInventoryAdjustmentMutation.mutate()}
            disabled={loading}
            className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
          >
            {loading ? (
              <Loader2 className='animate-spin' size={16} />
            ) : (
              'Xác nhận'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryCountAdjustmentDialog;
